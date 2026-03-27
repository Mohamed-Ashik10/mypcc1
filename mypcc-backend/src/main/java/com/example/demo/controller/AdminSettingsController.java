package com.example.demo.controller;

import com.example.demo.model.AppSetting;
import com.example.demo.repository.AppSettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
public class AdminSettingsController {

    private final AppSettingRepository repository;

    public AdminSettingsController(AppSettingRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Map<String, String> getSettings() {
        List<AppSetting> settings = repository.findAll();
        Map<String, String> result = new HashMap<>();
        for (AppSetting s : settings) {
            result.put(s.getKey(), s.getValue());
        }
        return result;
    }

    @PostMapping
    public ResponseEntity<?> saveSettings(@RequestBody Map<String, String> settings) {
        // Build all entities first, then batch-save in ONE round trip
        List<AppSetting> toSave = new java.util.ArrayList<>();
        
        settings.forEach((key, value) -> {
            AppSetting s = repository.findByKey(key)
                    .orElseGet(() -> {
                        AppSetting newItem = new AppSetting();
                        newItem.setKey(key);
                        String safeId = key.length() > 30 ? key.substring(0, 30) : key;
                        newItem.setId(safeId);
                        return newItem;
                    });
            s.setValue(value != null ? value : "");
            toSave.add(s);
        });
        
        repository.saveAll(toSave); // ONE batch write instead of N separate writes

        return ResponseEntity.ok(Map.of("message", "Settings synchronized successfully."));
    }

    @PutMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestBody Map<String, String> payload) {
        String to = payload.get("toEmail");
        if (to == null || to.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Recipient address required."));
        }
        
        // Mock email sending for now
        System.out.println("DEBUG: Dispatching test email to " + to);
        
        return ResponseEntity.ok(Map.of("message", "Test broadcast dispatched to " + to));
    }
}
