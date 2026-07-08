package com.futurefinance.repositories;

import com.futurefinance.models.FinancialData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialDataRepository extends JpaRepository<FinancialData, Long> {
    List<FinancialData> findByUserId(Long userId);
}
