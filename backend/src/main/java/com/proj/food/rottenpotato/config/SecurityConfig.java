package com.proj.food.rottenpotato.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Security 기능을 활성화합니다.
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF 보호 비활성화 (POST 요청 허용을 위해 필수)
            // DB 없는 상태에서 POST 요청 시 403 Forbidden/404 Not Found를 방지합니다.
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. HTTP 요청 인가 규칙 설정
            .authorizeHttpRequests(authorize -> authorize
                // 모든 /receipt/**, /inventory/** 경로는 인증 없이 접근 허용
                .requestMatchers("/receipt/**", "/inventory/**", "/auth/**").permitAll()
                // 나머지 모든 요청은 인증 필요 (기본값)
                .anyRequest().authenticated()
            );
        return http.build();
    }
}