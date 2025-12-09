import { MatDateFormats } from '@angular/material/core';

/**
 * Custom date formats for dd/MM/yyyy display.
 */
export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    // Defines the expected format for user input (e.g., '25/12/2025')
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    // The format used to display the date in the input field
    dateInput: 'DD/MM/YYYY',
    // The format used in the calendar header
    monthYearLabel: 'MMM YYYY',
    // The format used in the year view (e.g., '2025')
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
