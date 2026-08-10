package team.kitemc.verifymc.web;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import org.junit.jupiter.api.Test;
import team.kitemc.verifymc.core.ConfigManager;

import java.net.InetAddress;
import java.net.InetSocketAddress;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ClientIpResolverTest {
    @Test
    void proxyDisabledUsesRemoteAddress() throws Exception {
        ConfigManager config = config(false, "X-Forwarded-For", "127.0.0.1");
        HttpExchange exchange = exchange("198.51.100.20");
        exchange.getRequestHeaders().add("X-Forwarded-For", "203.0.113.10");
        assertEquals("198.51.100.20", new ClientIpResolver(config).resolve(exchange));
    }

    @Test
    void untrustedRemoteCannotForgeForwardedAddress() throws Exception {
        ConfigManager config = config(true, "X-Forwarded-For", "10.0.0.0/8");
        HttpExchange exchange = exchange("198.51.100.20");
        exchange.getRequestHeaders().add("X-Forwarded-For", "203.0.113.10");
        assertEquals("198.51.100.20", new ClientIpResolver(config).resolve(exchange));
    }

    @Test
    void trustedRemoteReadsXRealIp() throws Exception {
        ConfigManager config = config(true, "X-Real-IP", "10.0.0.0/8");
        HttpExchange exchange = exchange("10.2.3.4");
        exchange.getRequestHeaders().add("X-Real-IP", "203.0.113.10");
        assertEquals("203.0.113.10", new ClientIpResolver(config).resolve(exchange));
    }

    @Test
    void trustedRemoteUsesOnlyUniqueUntrustedForwardedAddress() throws Exception {
        ConfigManager config = config(true, "X-Forwarded-For", "10.0.0.0/8");
        HttpExchange exchange = exchange("10.2.3.4");
        exchange.getRequestHeaders().add("X-Forwarded-For", "203.0.113.10, 10.4.5.6");
        assertEquals("203.0.113.10", new ClientIpResolver(config).resolve(exchange));
    }

    @Test
    void invalidEmptyAndMultipleUntrustedValuesFallback() throws Exception {
        ConfigManager config = config(true, "X-Forwarded-For", "10.0.0.0/8");
        HttpExchange invalid = exchange("10.2.3.4");
        invalid.getRequestHeaders().add("X-Forwarded-For", "not-an-ip");
        assertEquals("10.2.3.4", new ClientIpResolver(config).resolve(invalid));

        HttpExchange empty = exchange("10.2.3.4");
        empty.getRequestHeaders().add("X-Forwarded-For", " ");
        assertEquals("10.2.3.4", new ClientIpResolver(config).resolve(empty));

        HttpExchange forged = exchange("10.2.3.4");
        forged.getRequestHeaders().add("X-Forwarded-For", "203.0.113.10, 192.0.2.5");
        assertEquals("10.2.3.4", new ClientIpResolver(config).resolve(forged));
    }

    @Test
    void supportsIpv4Ipv6MappedIpv6AndCidr() throws Exception {
        assertEquals("203.0.113.10", new ClientIpResolver(
                config(true, "X-Real-IP", "2001:db8::/32")).resolve(exchange("2001:db8::1", "203.0.113.10")));
        assertEquals("203.0.113.10", new ClientIpResolver(
                config(true, "X-Real-IP", "10.0.0.0/8")).resolve(exchange("::ffff:10.2.3.4", "203.0.113.10")));
        assertEquals("2001:db8:0:0:0:0:0:10", new ClientIpResolver(
                config(true, "X-Real-IP", "10.0.0.0/8")).resolve(exchange("10.2.3.4", "2001:db8::10")));
    }

    @Test
    void rejectsCatchAllTrustedNetwork() {
        org.junit.jupiter.api.Assertions.assertFalse(ClientIpResolver.isValidNetwork("0.0.0.0/0"));
    }

    private static ConfigManager config(boolean enabled, String header, String trusted) {
        ConfigManager config = mock(ConfigManager.class);
        when(config.isProxyEnabled()).thenReturn(enabled);
        when(config.getClientIpHeader()).thenReturn(header);
        when(config.getTrustedProxies()).thenReturn(java.util.List.of(trusted));
        return config;
    }

    private static HttpExchange exchange(String remote) throws Exception {
        return exchange(remote, null);
    }

    private static HttpExchange exchange(String remote, String forwarded) throws Exception {
        HttpExchange exchange = mock(HttpExchange.class);
        when(exchange.getRemoteAddress()).thenReturn(new InetSocketAddress(InetAddress.getByName(remote), 8080));
        Headers headers = new Headers();
        if (forwarded != null) {
            headers.add("X-Real-IP", forwarded);
        }
        when(exchange.getRequestHeaders()).thenReturn(headers);
        return exchange;
    }
}
