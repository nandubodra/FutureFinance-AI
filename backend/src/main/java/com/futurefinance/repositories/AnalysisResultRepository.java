package com.futurefinance.repositories;

import com.futurefinance.models.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    List<AnalysisResult> findByUserId(Long userId);
    List<AnalysisResult> findByUserIdAndAnalysisType(Long userId, String analysisType);
}
