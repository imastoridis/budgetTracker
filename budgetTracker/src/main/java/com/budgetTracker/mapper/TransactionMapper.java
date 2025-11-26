package com.budgetTracker.mapper;

import com.budgetTracker.dto.CategoryDto;
import com.budgetTracker.dto.TransactionDto;
import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.Transaction;
import com.budgetTracker.model.entity.User;

public class TransactionMapper {
    // Convert Entity to DTO
    public static TransactionDto toDto(Transaction transaction) {
        if (transaction == null) return null;

        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setType(transaction.getType());
        dto.setAmount(transaction.getAmount());
        dto.setDate(transaction.getDate());
        dto.setDescription(transaction.getDescription());
        dto.setUserId(transaction.getUser().getId());
        dto.setCategoryId(transaction.getCategory().getId());

        return dto;
    }

    // Convert DTO to Entity
    public static Transaction toEntity(TransactionDto transactionDto, User user, Category category) {

        if (transactionDto == null) return null;

        Transaction transaction = new Transaction();
        transaction.setId(transactionDto.getId());
        transaction.setType(transactionDto.getType());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setDate(transactionDto.getDate());
        transaction.setDescription(transactionDto.getDescription());
        transaction.setUser(user);
        transaction.setCategory(category);
        return transaction;
    }

    // Convert DTO to Entity Update
    public static Transaction toEntityUpdate(Transaction existingTransaction, TransactionDto transactionDto, Category category) {

        if (transactionDto == null) return null;
        existingTransaction.setId(transactionDto.getId());
        existingTransaction.setType(transactionDto.getType());
        existingTransaction.setAmount(transactionDto.getAmount());
        existingTransaction.setDate(transactionDto.getDate());
        existingTransaction.setDescription(transactionDto.getDescription());
        existingTransaction.setCategory(category);
        return existingTransaction;
    }
}
