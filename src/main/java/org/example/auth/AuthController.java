package org.example.auth;

import org.example.auth.dto.GoogleLoginRequest;
import org.example.auth.dto.GoogleLoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GoogleAuthService googleAuthService;

    public AuthController(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/google")
    public ResponseEntity<?> google(@RequestBody GoogleLoginRequest request) {
        try {
            var user = googleAuthService.verifyIdToken(request.getIdToken());
            long userId = googleAuthService.ensureUserId(user.email());
            String jwt = googleAuthService.issueJwt(user.email(), userId, user.name());

            GoogleLoginResponse resp = new GoogleLoginResponse();
            resp.setAccessToken(jwt);
            resp.setUserId(userId);
            resp.setEmail(user.email());
            resp.setName(user.name());
            resp.setPicture(user.picture());

            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    java.util.Map.of("message", "Login failed")
            );
        }
    }
}


