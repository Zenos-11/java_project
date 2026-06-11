package com.blog.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("admin123");
        System.out.println("New hash for admin123: " + hash);
        // Also verify the old hash
        String oldHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6n5ti";
        boolean matches = encoder.matches("admin123", oldHash);
        System.out.println("Old hash matches admin123: " + matches);
    }
}
