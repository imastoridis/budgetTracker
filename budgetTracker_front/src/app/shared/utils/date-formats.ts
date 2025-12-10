import { MatDateFormats } from '@angular/material/core';

/**
 * Custom date formats for dd/MM/yyyy display.
 * Using 'dd' for day (2-digit), 'MM' for month (2-digit), and 'yyyy' for year (4-digit).
 */
export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    // Defines the expected format for user input (e.g., '25/12/2025')
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    // The format used to display the date in the input field
    dateInput: 'dd/MM/yyyy',
    // The format used in the calendar header
    monthYearLabel: 'MMM yyyy', // e.g., 'Dec 2025'
    // The format used in the year view (e.g., '2025')
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy', // e.g., 'December 2025'
  },
};
