package team.kitemc.verifymc.web.handler;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import org.bukkit.plugin.java.JavaPlugin;
import org.junit.jupiter.api.Test;
import team.kitemc.verifymc.core.ConfigManager;
import team.kitemc.verifymc.core.PluginContext;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LoginHandlerClientIpTest {
    @Test
    void loginRateLimitUsesResolvedClientIpBehindTrustedProxy() throws Exception {
        ConfigManager config = mock(ConfigManager.class);
        when(config.isProxyEnabled()).thenReturn(true);
        when(config.getClientIpHeader()).thenReturn("X-Forwarded-For");
        when(config.getTrustedProxies()).thenReturn(List.of("10.0.0.0/8"));

        JavaPlugin plugin = mock(JavaPlugin.class);
        when(plugin.getLogger()).thenReturn(Logger.getLogger("LoginHandlerClientIpTest"));
        PluginContext context = mock(PluginContext.class);
        when(context.getConfigManager()).thenReturn(config);
        when(context.getPlugin()).thenReturn(plugin);
        when(context.getMessage(anyString(), anyString())).thenReturn("invalid JSON");

        LoginHandler handler = new LoginHandler(context);
        for (int i = 0; i < 5; i++) {
            handler.handle(exchange("203.0.113.10"));
        }

        List<Integer> statuses = new ArrayList<>();
        handler.handle(exchange("203.0.113.11", statuses));
        assertEquals(List.of(400), statuses);
    }

    private static HttpExchange exchange(String clientIp) throws Exception {
        return exchange(clientIp, new ArrayList<>());
    }

    private static HttpExchange exchange(String clientIp, List<Integer> statuses) throws Exception {
        HttpExchange exchange = mock(HttpExchange.class);
        Headers requestHeaders = new Headers();
        requestHeaders.add("X-Forwarded-For", clientIp);
        when(exchange.getRequestMethod()).thenReturn("POST");
        when(exchange.getRemoteAddress()).thenReturn(
                new InetSocketAddress(InetAddress.getByName("10.2.3.4"), 8080));
        when(exchange.getRequestHeaders()).thenReturn(requestHeaders);
        when(exchange.getRequestBody()).thenReturn(new ByteArrayInputStream("not-json".getBytes()));
        when(exchange.getResponseHeaders()).thenReturn(new Headers());
        when(exchange.getResponseBody()).thenReturn(new ByteArrayOutputStream());
        doAnswer(invocation -> {
            statuses.add(invocation.getArgument(0));
            return null;
        }).when(exchange).sendResponseHeaders(anyInt(), anyLong());
        return exchange;
    }
}
