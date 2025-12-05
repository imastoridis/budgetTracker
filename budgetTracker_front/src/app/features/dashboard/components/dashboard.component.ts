import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.service';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { CategoriesService } from '../../categories/services/categories.service';
import { CategoryCreate } from '../../categories/models/categories.models';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
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

  /* Get all categories for user */
  getCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories in dashboard:', categories);
      },
      error: (err) => {
        console.error('Error fetching categories in dashboard:', err);
      },
    });
  }

  addCategory(): void {
    const categoryData: CategoryCreate = this.categoryForm.getRawValue();

    this.categoriesService.addCategory(categoryData).subscribe({
      next: (category) => {
        console.log('Category added:', category);
        this.categoryForm.reset();
        this.getCategories();
      },
      error: (err) => {
        console.error('Error adding category:', err);
      },
    });
  }

  readonly categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /**
   * Calls the service's logout method to clear the token and redirect.
   */
  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.getCategories();
  }
}
