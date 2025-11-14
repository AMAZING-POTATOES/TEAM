package org.example.repository;

import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Entity Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Google ID로 사용자 조회
     */
    Optional<User> findByGoogleId(String googleId);
    
    /**
     * 이메일로 사용자 조회
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Google ID 또는 이메일로 사용자 존재 여부 확인
     */
    boolean existsByGoogleId(String googleId);
    
    boolean existsByEmail(String email);
}

