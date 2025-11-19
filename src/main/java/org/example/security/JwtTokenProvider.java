package org.example.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

/**
 * JWT 생성 및 검증 유틸리티.
 */
@Component
public class JwtTokenProvider {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String jwtSecret;

    public JwtTokenProvider(@Value("${security.jwt.secret:change-this-secret-in-production}") String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public String generateToken(long userId, String email, String name) {
        try {
            String headerJson = objectMapper.writeValueAsString(Map.of(
                    "alg", "HS256",
                    "typ", "JWT"
            ));
            long nowSec = Instant.now().getEpochSecond();
            long expSec = nowSec + 60L * 60L * 24L; // 24 hours
            String payloadJson = objectMapper.writeValueAsString(Map.of(
                    "sub", String.valueOf(userId),
                    "iss", "amazing-potatoes",
                    "iat", nowSec,
                    "exp", expSec,
                    "email", email,
                    "name", name
            ));

            String header = base64Url(headerJson.getBytes(StandardCharsets.UTF_8));
            String payload = base64Url(payloadJson.getBytes(StandardCharsets.UTF_8));
            String signingInput = header + "." + payload;
            String signature = hmacSha256(signingInput, jwtSecret);
            return signingInput + "." + signature;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate JWT", e);
        }
    }

    public JwtUserDetails parseToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT structure");
            }

            String signingInput = parts[0] + "." + parts[1];
            String expectedSignature = hmacSha256(signingInput, jwtSecret);
            if (!constantTimeEquals(expectedSignature, parts[2])) {
                throw new IllegalArgumentException("Invalid JWT signature");
            }

            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            JsonNode payload = objectMapper.readTree(payloadBytes);

            long exp = payload.path("exp").asLong(0);
            if (exp != 0 && Instant.now().getEpochSecond() > exp) {
                throw new IllegalArgumentException("JWT expired");
            }

            long userId = payload.path("sub").asLong(0);
            String email = payload.path("email").asText(null);
            String name = payload.path("name").asText(null);

            if (userId == 0 || email == null) {
                throw new IllegalArgumentException("Invalid JWT payload");
            }

            return new JwtUserDetails(userId, email, name);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse JWT", e);
        }
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
            throw new IllegalStateException("Failed to sign JWT", e);
        }
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}

