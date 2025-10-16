package com.college.library.repository;

import com.college.library.entity.MarketplaceBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketplaceBookRepository extends JpaRepository<MarketplaceBook, Long> {
    // Custom queries can be added here
}
