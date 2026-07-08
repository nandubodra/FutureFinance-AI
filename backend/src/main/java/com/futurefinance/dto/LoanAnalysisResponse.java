package com.futurefinance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanAnalysisResponse {
    private BigDecimal maxSafeLoan;
    private BigDecimal emiAmount;
    private BigDecimal monthlyEMIPercentage;
    private String riskLevel; // LOW, MEDIUM, HIGH
    private String recommendation;
    private List<InterestComparison> interestComparison;
    private BigDecimal emergencyFundWarning;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterestComparison {
        private BigDecimal loanAmount;
        private Integer tenure;
        private BigDecimal totalInterest;
    }
}
