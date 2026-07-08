package com.futurefinance.services;

import com.futurefinance.dto.LoanAnalysisRequest;
import com.futurefinance.dto.LoanAnalysisResponse;
import com.futurefinance.models.AnalysisResult;
import com.futurefinance.models.User;
import com.futurefinance.repositories.AnalysisResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanAnalysisService {

    private final AnalysisResultRepository analysisResultRepository;
    private final ObjectMapper objectMapper;

    private static final BigDecimal SAFE_EMI_PERCENTAGE = new BigDecimal("40");
    private static final BigDecimal MEDIUM_EMI_PERCENTAGE = new BigDecimal("50");
    private static final BigDecimal ANNUAL_INTEREST_RATE = new BigDecimal("0.09"); // 9% default

    public LoanAnalysisResponse analyzeLoan(LoanAnalysisRequest request, User user) throws Exception {
        // Calculate max safe loan
        BigDecimal availableIncome = request.getMonthlySalary()
                .subtract(request.getMonthlyExpenses())
                .subtract(request.getExistingEMI());

        BigDecimal maxSafeLoan = calculateMaxLoan(availableIncome, SAFE_EMI_PERCENTAGE);
        
        // Calculate EMI for requested loan
        BigDecimal emiAmount = calculateEMI(request.getLoanAmount(), 
                                           ANNUAL_INTEREST_RATE, 
                                           request.getTenure());

        BigDecimal emiPercentage = emiAmount
                .divide(request.getMonthlySalary(), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        // Determine risk level
        String riskLevel = determineRiskLevel(emiPercentage);

        // Generate recommendation
        String recommendation = generateRecommendation(request, emiAmount, riskLevel, user.getLanguage());

        // Calculate interest comparisons
        List<LoanAnalysisResponse.InterestComparison> comparisons = generateInterestComparisons(request);

        // Check emergency fund warning
        BigDecimal emergencyFundAfterLoan = request.getCurrentSavings()
                .subtract(request.getLoanAmount().multiply(new BigDecimal("0.2"))); // Assuming 20% down payment

        LoanAnalysisResponse response = LoanAnalysisResponse.builder()
                .maxSafeLoan(maxSafeLoan)
                .emiAmount(emiAmount)
                .monthlyEMIPercentage(emiPercentage)
                .riskLevel(riskLevel)
                .recommendation(recommendation)
                .interestComparison(comparisons)
                .emergencyFundWarning(emergencyFundAfterLoan)
                .build();

        // Save analysis result
        saveAnalysisResult(user, request, response);

        return response;
    }

    private BigDecimal calculateMaxLoan(BigDecimal availableIncome, BigDecimal emiPercentage) {
        BigDecimal maxEMI = availableIncome
                .multiply(emiPercentage)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        
        // Reverse EMI calculation to get principal
        // EMI = P * (r(1+r)^n) / ((1+r)^n - 1)
        // Using simplified formula: P = EMI * n / (1 + r*n)
        BigDecimal monthlyRate = ANNUAL_INTEREST_RATE.divide(new BigDecimal("12"), 6, RoundingMode.HALF_UP);
        BigDecimal n = new BigDecimal("60"); // 5 years default
        
        BigDecimal denominator = BigDecimal.ONE.add(monthlyRate.multiply(n));
        BigDecimal maxLoan = maxEMI.multiply(n).divide(denominator, 2, RoundingMode.HALF_UP);
        
        return maxLoan;
    }

    private BigDecimal calculateEMI(BigDecimal principal, BigDecimal annualRate, Integer years) {
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("12"), 6, RoundingMode.HALF_UP);
        int numberOfMonths = years * 12;
        
        BigDecimal factor = monthlyRate.pow(numberOfMonths);
        BigDecimal numerator = monthlyRate.multiply(factor);
        BigDecimal denominator = factor.subtract(BigDecimal.ONE);
        
        return principal.multiply(numerator).divide(denominator, 2, RoundingMode.HALF_UP);
    }

    private String determineRiskLevel(BigDecimal emiPercentage) {
        if (emiPercentage.compareTo(SAFE_EMI_PERCENTAGE) <= 0) {
            return "LOW";
        } else if (emiPercentage.compareTo(MEDIUM_EMI_PERCENTAGE) <= 0) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }

    private String generateRecommendation(LoanAnalysisRequest request, BigDecimal emi, 
                                         String riskLevel, String language) {
        if (language.equals("hi")) {
            if ("HIGH".equals(riskLevel)) {
                return "⚠️ जोखिम अधिक है। डाउन पेमेंट बढ़ाने पर विचार करें।";
            } else if ("MEDIUM".equals(riskLevel)) {
                return "⚡ मध्यम जोखिम। ध्यानपूर्वक निर्णय लें।";
            } else {
                return "✅ सुरक्षित है। आप यह लोन ले सकते हैं।";
            }
        } else {
            if ("HIGH".equals(riskLevel)) {
                return "⚠️ Risk is HIGH. Consider increasing down payment or reducing loan amount.";
            } else if ("MEDIUM".equals(riskLevel)) {
                return "⚡ Risk is MEDIUM. Proceed with caution.";
            } else {
                return "✅ Safe to take this loan. EMI is manageable.";
            }
        }
    }

    private List<LoanAnalysisResponse.InterestComparison> generateInterestComparisons(LoanAnalysisRequest request) {
        List<LoanAnalysisResponse.InterestComparison> comparisons = new ArrayList<>();
        
        int[] tenures = {3, 5, 7};
        for (int tenure : tenures) {
            BigDecimal totalEMI = calculateEMI(request.getLoanAmount(), ANNUAL_INTEREST_RATE, tenure)
                    .multiply(new BigDecimal(tenure * 12));
            BigDecimal totalInterest = totalEMI.subtract(request.getLoanAmount());
            
            comparisons.add(LoanAnalysisResponse.InterestComparison.builder()
                    .loanAmount(request.getLoanAmount())
                    .tenure(tenure)
                    .totalInterest(totalInterest)
                    .build());
        }
        
        return comparisons;
    }

    private void saveAnalysisResult(User user, LoanAnalysisRequest request, LoanAnalysisResponse response) throws Exception {
        AnalysisResult result = AnalysisResult.builder()
                .user(user)
                .analysisType("LOAN")
                .inputData(objectMapper.writeValueAsString(request))
                .resultData(objectMapper.writeValueAsString(response))
                .recommendation(response.getRecommendation())
                .riskLevel(response.getRiskLevel())
                .build();
        
        analysisResultRepository.save(result);
    }
}
