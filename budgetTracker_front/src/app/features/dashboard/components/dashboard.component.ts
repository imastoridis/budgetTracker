import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.service';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { CategoriesService } from '../../categories/services/categories.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private categoriesService = inject(CategoriesService);

  addExpense(): void {
    console.log('Add expense clicked');
  }

  addIncome(): void {
    console.log('Add income clicked');
  }

  /*   getCategories() {
    const categories = this.categoriesService.getCategories();
    return categories;
  } */

  /**
   * Calls the service's logout method to clear the token and redirect.
   */
  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories in dashboard:', categories);
      },
      error: (err) => {
        console.error(
          'Error fetching categories in dashboard:',
          err.error.message,
        );
      },
    });
  }
}
