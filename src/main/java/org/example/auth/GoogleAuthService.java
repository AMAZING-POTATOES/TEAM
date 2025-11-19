package org.example.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.example.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Service
public class GoogleAuthService {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // Frontend의 VITE_CLIENT_ID와 동일해야 함
    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    public record GoogleUser(String email, String name, String picture, String sub) {}

    public GoogleAuthService(UserRepository userRepository,
                             JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
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
        return jwtTokenProvider.generateToken(userId, email, name);
    }
}


