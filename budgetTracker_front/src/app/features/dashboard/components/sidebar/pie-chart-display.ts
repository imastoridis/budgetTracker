import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  input,
  effect,
  computed,
  inject,
} from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
/* import {
  ChartComponent,
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartType,
} from 'ng-apexcharts'; */

import { Category } from '../../../categories/models/categories.models';
import { CategoriesStateService } from '../../../../shared/services/state/categoriesStateService';

/* export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
}; */

@Component({
  selector: 'app-pie-chart-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule],
  template: `
    <div>
      <div
        class="flex border-b align-items-center  text-xl font-semibold text-sky-700  gap-2"
      >
        <mat-icon aria-label="face icon" fontIcon="pie_chart"></mat-icon>
        <h2>Chart</h2>
      </div>

      <div
        class="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500"
        id="chart"
      >
        <!--    <apx-chart
          [series]="chartSeries()"
          [chart]="chartDetails"
          [labels]="chartLabels()"
        >
          </apx-chart 
        >-->
      </div>
    </div>
  `,
})
export class PieChartDisplay {
  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  chartSeries = computed(() =>
    this.allCategories().map((c) => c.totalAmount || 0),
  );
  chartLabels = computed(() => this.allCategories().map((c) => c.name));
  /*   chartDetails: ApexChart = {
    type: 'donut' as ChartType,
    width: '100%',
  }; */
}
