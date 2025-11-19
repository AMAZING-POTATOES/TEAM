package org.example.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Objects;

@Service
public class GoogleAuthService {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserRepository userRepository;

    // Frontend의 VITE_CLIENT_ID와 동일해야 함
    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    // 간단한 시크릿(데모용). 운영에서는 안전한 키 보관 필요
    @Value("${security.jwt.secret:change-this-secret-in-production}")
    private String jwtSecret;

    public record GoogleUser(String email, String name, String picture, String sub) {}

    public GoogleAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public GoogleUser verifyIdToken(String idToken) throws Exception {
        // 구글 토큰 검증 엔드포인트 호출
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        if (response.statusCode() != 200) {
            throw new IllegalArgumentException("Invalid Google ID token");
        }

        JsonNode node = objectMapper.readTree(response.body());
        String aud = node.path("aud").asText(null);
        String email = node.path("email").asText(null);
        String name = node.path("name").asText(null);
        String picture = node.path("picture").asText(null);
        String sub = node.path("sub").asText(null);

        if (aud == null || !aud.equals(googleClientId)) {
            throw new IllegalArgumentException("ID token audience mismatch");
        }
        if (email == null || sub == null) {
            throw new IllegalArgumentException("Missing fields in Google token");
        }

        return new GoogleUser(email, name, picture, sub);
    }

    @Transactional
    public long ensureUser(String googleId, String email, String name) {
        return userRepository.findByGoogleId(googleId)
                .map(existingUser -> {
                    boolean changed = false;
                    if (!Objects.equals(existingUser.getEmail(), email)) {
                        existingUser.setEmail(email);
                        changed = true;
                    }
                    if (!Objects.equals(existingUser.getName(), name)) {
                        existingUser.setName(name);
                        changed = true;
                    }
                    if (changed) {
                        userRepository.save(existingUser);
                    }
                    return existingUser.getUserId();
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setGoogleId(googleId);
                    newUser.setEmail(email);
                    newUser.setName(name);
                    return userRepository.save(newUser).getUserId();
                });
    }

    public String issueJwt(String email, long userId, String name) {
        // 간단한 HS256 JWT 구현 (외부 라이브러리 없이)
        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        long nowSec = Instant.now().getEpochSecond();
        long expSec = nowSec + 60L * 60L * 24L; // 24h
        String payloadJson = String.format(
                "{\"sub\":\"%s\",\"iss\":\"amazing-potatoes\",\"iat\":%d,\"exp\":%d,\"email\":\"%s\",\"name\":\"%s\"}",
                userId, nowSec, expSec, escapeJson(email), escapeJson(name)
        );

        String header = base64Url(headerJson.getBytes(StandardCharsets.UTF_8));
        String payload = base64Url(payloadJson.getBytes(StandardCharsets.UTF_8));
        String signingInput = header + "." + payload;
        String signature = hmacSha256(signingInput, jwtSecret);
        return signingInput + "." + signature;
    }

    private static String base64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] sig = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return base64Url(sig);
        } catch (Exception e) {
            throw new RuntimeException("Failed to sign JWT", e);
        }
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}


