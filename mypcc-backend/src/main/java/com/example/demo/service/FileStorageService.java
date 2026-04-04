package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root = Paths.get("uploads");

    @Value("${CLOUDINARY_URL:}")
    private String cloudinaryUrl;

    public FileStorageService() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload folder!");
        }
    }

    public String save(MultipartFile file) {
        // If Cloudinary is configured, use it for permanent storage
        if (cloudinaryUrl != null && !cloudinaryUrl.isEmpty()) {
            try {
                Cloudinary cloudinary = new Cloudinary(cloudinaryUrl);
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                    ObjectUtils.asMap("resource_type", "auto"));
                return (String) uploadResult.get("secure_url");
            } catch (Exception e) {
                System.err.println("Cloudinary upload failed, falling back to local: " + e.getMessage());
            }
        }

        // Fallback to local storage (Only works for local development)
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            Files.copy(file.getInputStream(), this.root.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            return "/api/uploads/" + filename;
        } catch (Exception e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage());
        }
    }
}
