import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { CUSTOM_MONTH_YEAR_DATE_FORMATS } from '@shared/utils/date-formats';
import { MaterialModule } from '@shared/modules/material/material.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardEventsService } from '../../../services/dashboard-events.service';
import { DateForm, initDateForm } from '@shared/forms/date-form-builder';
@Component({
  selector: 'app-datepicker-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_MONTH_YEAR_DATE_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="flex flex-col text-center gap-6 -mb-8">
      <div
        class="flex border-b align-items-center text-xl font-semibold text-sky-700  gap-2"
      >
        <mat-icon aria-label="face icon" fontIcon="calendar_month"></mat-icon>
        <h2 class="text-sm xl:text-xl">Current Month</h2>
      </div>

      <form [formGroup]="dateForm">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="date"
            class="w-full"
          />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>

          <mat-datepicker
            #picker
            startView="year"
            (monthSelected)="setMonthAndYear($event, picker)"
          >
          </mat-datepicker>
        </mat-form-field>
      </form>
    </div>
  `,
})
export class DatePickerSidebar {
  /* Sets datepicker to only show month and year in selection */
  private destroyRef = inject(DestroyRef);
  private dashBoardEventsService = inject(DashboardEventsService);
  readonly dateForm: DateForm = initDateForm();

  setMonthAndYear(
    normalizedMonthAndYear: Date,
    datepicker: MatDatepicker<Date>,
  ) {
    const ctrlValue: Date = this.dateForm.getRawValue().date;

    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    this.dateForm.setValue({ date: new Date(ctrlValue) });
    datepicker.close();
  }

  constructor() {
    // Listen for any change to the dateControl
    this.dateForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newDate) => {
        if (newDate.date) {
          this.dashBoardEventsService.notifyDateChanged(newDate.date);
        }
      });
  }

  get date() {
    return this.dateForm.get('date');
  }
}
