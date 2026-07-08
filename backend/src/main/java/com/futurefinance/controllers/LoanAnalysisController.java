package com.futurefinance.controllers;

import com.futurefinance.dto.LoanAnalysisRequest;
import com.futurefinance.dto.LoanAnalysisResponse;
import com.futurefinance.models.User;
import com.futurefinance.services.LoanAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/analysis/loan")
@RequiredArgsConstructor
public class LoanAnalysisController {

    private final LoanAnalysisService loanAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<LoanAnalysisResponse> analyzeLoan(
            @Valid @RequestBody LoanAnalysisRequest request) throws Exception {
        // In production, get user from Authentication context
        User mockUser = User.builder()
                .id(1L)
                .email("user@example.com")
                .language("en")
                .build();
        
        LoanAnalysisResponse response = loanAnalysisService.analyzeLoan(request, mockUser);
        return ResponseEntity.ok(response);
    }
}
