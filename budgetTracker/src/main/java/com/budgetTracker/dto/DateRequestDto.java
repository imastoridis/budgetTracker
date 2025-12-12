package com.budgetTracker.dto;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import lombok.Getter;
import lombok.Setter;
// Add other necessary annotations like @NoArgsConstructor, @AllArgsConstructor

@Getter
@Setter
public class DateRequestDto {

    // Ensure the field name 'date' matches the key you send from Angular
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate date;
}