package com.budgetTracker.repository;

import com.budgetTracker.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// JpaRepository requires the Entity type (User) and the type of the Primary Key (Long)
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //Optional in case the user doesn't exist
    Optional<User> findByUsername(String username);
}