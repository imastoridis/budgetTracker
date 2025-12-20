import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';

@Component({
  selector: 'app-pie-chart-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, ReactiveFormsModule],
  template: `
    <div>
      <div
        class="flex border-b align-items-center  text-xl font-semibold text-sky-700  gap-2"
      >
        <mat-icon aria-label="face icon" fontIcon="pie_chart"></mat-icon>
        <h2>Repartition</h2>
      </div>

      <div
        class="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500"
      >
        [Pie Chart Placeholder]
      </div>
    </div>
  `,
})
export class PieChartDisplay {}
