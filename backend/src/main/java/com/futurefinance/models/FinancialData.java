package com.futurefinance.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "financial_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private BigDecimal monthlySalary;
    private BigDecimal monthlyExpenses;
    private BigDecimal currentSavings;
    private BigDecimal existingEMI;
    private Integer creditScore;

    private BigDecimal loanAmount;
    private Integer loanTenure;
    private BigDecimal interestRate;

    private BigDecimal investmentAmount;
    private String investmentType; // FD, MF, GOLD, STOCKS

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
