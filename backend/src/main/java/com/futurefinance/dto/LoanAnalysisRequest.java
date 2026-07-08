package com.futurefinance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanAnalysisRequest {
    private BigDecimal monthlySalary;
    private BigDecimal monthlyExpenses;
    private BigDecimal currentSavings;
    private BigDecimal existingEMI;
    private Integer creditScore;
    private BigDecimal loanAmount;
    private Integer tenure; // in years
}
