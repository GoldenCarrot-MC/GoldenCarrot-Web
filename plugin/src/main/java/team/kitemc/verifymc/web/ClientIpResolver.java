package team.kitemc.verifymc.web;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import team.kitemc.verifymc.core.ConfigManager;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** Resolves a client address without trusting proxy headers by default. */
public final class ClientIpResolver {
    private final ConfigManager config;

    public ClientIpResolver(ConfigManager config) {
        this.config = config;
    }

    public String resolve(HttpExchange exchange) {
        InetSocketAddress remote = exchange == null ? null : exchange.getRemoteAddress();
        String remoteAddress = hostAddress(remote);
        if (exchange == null || config == null || !config.isProxyEnabled()) {
            return remoteAddress;
        }

        List<IpNetwork> trusted = parseNetworks(config.getTrustedProxies());
        InetAddress remoteIp = parseAddress(remoteAddress);
        if (remoteIp == null || trusted.isEmpty() || !matchesAny(remoteIp, trusted)) {
            return remoteAddress;
        }

        String headerName = config.getClientIpHeader();
        Headers headers = exchange.getRequestHeaders();
        String raw = headers == null ? null : headers.getFirst(headerName);
        String resolved = resolveHeader(raw, headerName, trusted);
        return resolved == null ? remoteAddress : resolved;
    }

    private static String resolveHeader(String raw, String headerName, List<IpNetwork> trusted) {
        if (raw == null || raw.trim().isEmpty()) {
            return null;
        }
        if ("X-Forwarded-For".equalsIgnoreCase(headerName)) {
            String[] values = raw.split(",", -1);
            List<InetAddress> addresses = new ArrayList<>(values.length);
            for (String value : values) {
                InetAddress address = parseAddress(value.trim());
                if (address == null) {
                    return null;
                }
                addresses.add(address);
            }
            InetAddress candidate = null;
            for (int i = addresses.size() - 1; i >= 0; i--) {
                InetAddress address = addresses.get(i);
                if (matchesAny(address, trusted)) {
                    continue;
                }
                if (candidate != null) {
                    // More than one untrusted hop means the chain may have been forged.
                    return null;
                }
                candidate = address;
            }
            return candidate == null ? null : candidate.getHostAddress();
        }

        // Other supported headers must contain exactly one valid address.
        if (raw.indexOf(',') >= 0) {
            return null;
        }
        InetAddress address = parseAddress(raw.trim());
        return address == null ? null : address.getHostAddress();
    }

    private static String hostAddress(InetSocketAddress address) {
        if (address == null) {
            return "";
        }
        InetAddress inetAddress = address.getAddress();
        return inetAddress != null ? inetAddress.getHostAddress() : address.getHostString();
    }

    private static InetAddress parseAddress(String value) {
        if (value == null || value.isEmpty() || value.indexOf('/') >= 0 || value.indexOf('%') >= 0) {
            return null;
        }
        try {
            // InetAddress.getByName accepts host names; only accept numeric IP literals.
            if (!isNumericAddress(value)) {
                return null;
            }
            return InetAddress.getByName(value);
        } catch (Exception ignored) {
            return null;
        }
    }

    private static boolean isNumericAddress(String value) {
        if (value.indexOf(':') >= 0) {
            return value.matches("[0-9a-fA-F:]+(?:\\.[0-9]{1,3})?");
        }
        String[] octets = value.split("\\.", -1);
        if (octets.length != 4) {
            return false;
        }
        for (String octet : octets) {
            if (octet.isEmpty() || !octet.matches("[0-9]{1,3}")) {
                return false;
            }
            try {
                if (Integer.parseInt(octet) > 255) {
                    return false;
                }
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return true;
    }

    /** Used by ConfigManager to validate configured IP/CIDR values. */
    public static boolean isValidNetwork(String value) {
        return parseNetwork(value) != null;
    }

    private static List<IpNetwork> parseNetworks(List<String> values) {
        if (values == null || values.isEmpty()) {
            return Collections.emptyList();
        }
        List<IpNetwork> result = new ArrayList<>();
        for (String value : values) {
            IpNetwork network = parseNetwork(value);
            if (network != null) {
                result.add(network);
            }
        }
        return result;
    }

    private static IpNetwork parseNetwork(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String text = value.trim();
        int slash = text.indexOf('/');
        String addressText = slash < 0 ? text : text.substring(0, slash).trim();
        InetAddress address = parseAddress(addressText);
        if (address == null) {
            return null;
        }
        byte[] original = address.getAddress();
        boolean mapped = isMapped(original);
        int bits = address.getAddress().length * 8;
        if (slash >= 0) {
            try {
                bits = Integer.parseInt(text.substring(slash + 1).trim());
            } catch (NumberFormatException e) {
                return null;
            }
            if (bits <= 0 || bits > address.getAddress().length * 8
                    || (mapped && bits < 96)) {
                return null;
            }
        }
        if (mapped) {
            bits = slash >= 0 ? bits - 96 : 32;
        }
        if (bits <= 0) {
            return null;
        }
        byte[] network = normalize(original);
        mask(network, bits);
        return new IpNetwork(network, bits);
    }

    private static boolean matchesAny(InetAddress address, List<IpNetwork> networks) {
        byte[] candidate = normalize(address.getAddress());
        for (IpNetwork network : networks) {
            if (candidate.length == network.address.length && network.matches(candidate)) {
                return true;
            }
        }
        return false;
    }

    private static byte[] normalize(byte[] address) {
        if (isMapped(address)) {
            byte[] ipv4 = new byte[4];
            System.arraycopy(address, 12, ipv4, 0, 4);
            return ipv4;
        }
        return address.clone();
    }

    private static boolean isMapped(byte[] address) {
        if (address.length != 16) {
            return false;
        }
        for (int i = 0; i < 10; i++) {
            if (address[i] != 0) {
                return false;
            }
        }
        return (address[10] & 0xff) == 0xff && (address[11] & 0xff) == 0xff;
    }

    private static void mask(byte[] address, int bits) {
        for (int i = 0; i < address.length; i++) {
            int remaining = bits - i * 8;
            if (remaining <= 0) {
                address[i] = 0;
            } else if (remaining < 8) {
                address[i] = (byte) (address[i] & (0xff << (8 - remaining)));
            }
        }
    }

    private static final class IpNetwork {
        private final byte[] address;
        private final int bits;

        private IpNetwork(byte[] address, int bits) {
            this.address = address;
            this.bits = bits;
        }

        private boolean matches(byte[] candidate) {
            int fullBytes = bits / 8;
            int remaining = bits % 8;
            for (int i = 0; i < fullBytes; i++) {
                if (address[i] != candidate[i]) {
                    return false;
                }
            }
            return remaining == 0 || (address[fullBytes] & (0xff << (8 - remaining)))
                    == (candidate[fullBytes] & (0xff << (8 - remaining)));
        }
    }
}
