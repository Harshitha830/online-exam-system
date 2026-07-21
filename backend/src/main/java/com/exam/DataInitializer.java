package com.exam;

import com.exam.entity.User;
import com.exam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@exam.com")) {
            User admin = new User("Admin", "admin@exam.com", passwordEncoder.encode("admin123"), "ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Default Admin created: admin@exam.com / admin123");
        }
    }
}
