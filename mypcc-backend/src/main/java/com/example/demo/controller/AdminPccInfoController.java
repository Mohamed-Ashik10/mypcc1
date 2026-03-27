package com.example.demo.controller;

import com.example.demo.model.PccInfo;
import com.example.demo.repository.PccInfoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/pcc-info")
public class AdminPccInfoController {

    private final PccInfoRepository pccInfoRepository;

    public AdminPccInfoController(PccInfoRepository pccInfoRepository) {
        this.pccInfoRepository = pccInfoRepository;
    }

    @GetMapping
    public List<PccInfo> getAllPccInfo() {
        return pccInfoRepository.findAllByOrderBySectionAsc();
    }

    @PostMapping
    public PccInfo createPccInfo(@RequestBody PccInfo pccInfo) {
        return pccInfoRepository.save(pccInfo);
    }

    @PatchMapping("/{id}")
    public PccInfo updatePccInfo(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        PccInfo info = pccInfoRepository.findById(id).orElseThrow(() -> new RuntimeException("Section not found"));
        
        if (updates.containsKey("content")) info.setContent(updates.get("content").toString());
        if (updates.containsKey("section")) info.setSection(updates.get("section").toString());
        
        return pccInfoRepository.save(info);
    }

    @DeleteMapping("/{id}")
    public void deletePccInfo(@PathVariable String id) {
        pccInfoRepository.deleteById(id);
    }
}
