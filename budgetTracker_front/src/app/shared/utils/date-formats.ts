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

/**
 * Custom date formats for MM/yyyy display.
 */
export const CUSTOM_MONTH_YEAR_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MM/yyyy',
  },
  display: {
    dateInput: 'MMMM yyyy', // This is what the user sees in the input
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
