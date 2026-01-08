import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
} from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import {
  ApexLegend,
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartType,
} from 'ng-apexcharts';

import { CategoriesStateService } from '@shared/services/state/categoriesStateService';
import { TransactionType } from '@app/features/transactions/models/transaction-types.enum';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-pie-chart-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, NgApexchartsModule],
  template: `
    <div class="flex flex-col h-full">
      <div
        class="flex-none flex border-b align-items-center text-sm xl:text-xl font-semibold text-sky-700 xl:gap-2"
      >
        <mat-icon
          aria-label="face icon"
          fontIcon="pie_chart"
          class="!text-sm xl:!text-xl"
        ></mat-icon>
        <h2>Expenses Chart</h2>
      </div>

      <div
        class="flex-grow w-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden"
        id="chart"
      >
        @if (chartSeries().length > 0) {
          <apx-chart
            class="w-full h-full"
            [series]="chartSeries()"
            [chart]="chartDetails"
            [labels]="chartLabels()"
            [legend]="chartLegend"
          ></apx-chart>
        } @else {
          <p class="text-sm italic">No data available for this month</p>
        }
      </div>
    </div>
  `,
})
export class PieChartDisplay {
  private categoriesState = inject(CategoriesStateService);
  readonly allCategories = this.categoriesState.categories;

  /* Chart data , filters categories with totalAmount > 0*/
  readonly chartData = computed(() => {
    const active = this.allCategories().filter(
      (c) => (c.totalAmount || 0) > 0 && c.type !== TransactionType.INCOME,
    );
    return {
      series: active.map((c) => c.totalAmount || 0),
      labels: active.map((c) => c.name),
    };
  });

  chartSeries = computed(() => this.chartData().series);
  chartLabels = computed(() => this.chartData().labels);

  /* Details */
  chartDetails: ApexChart = {
    type: 'donut' as ChartType,
    width: '100%',
    height: '100%', // Changed from 'auto' to '100%'
    sparkline: {
      enabled: false, // Ensure this is false so the chart doesn't collapse
    },
    parentHeightOffset: 0,
  };

  /* Legend */
  chartLegend: ApexLegend = {
    position: 'bottom',
    horizontalAlign: 'center',
  };
}
