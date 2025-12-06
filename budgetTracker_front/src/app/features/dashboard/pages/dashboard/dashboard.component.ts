import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { CategoriesService } from '../../../categories/services/categories.service';
import { Category } from '../../../categories/models/categories.models';
import { of } from 'rxjs';
import { DialogUpdateCategory } from '../../../categories/components/category-update.component';
import { MatDialog } from '@angular/material/dialog';
import { AddCategory } from '../../../categories/components/category-add.component';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, AddCategory],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private categoriesService = inject(CategoriesService);
  readonly allCategories = signal<Category[]>([]);

  readonly categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /* Add expense */
  addExpense(): void {
    console.log('Add expense clicked');
  }

  /* Add income */
  addIncome(): void {
    console.log('Add income clicked');
  }

  /* Get all categories for user */
  getCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.allCategories.set(categories);
      },
      error: (err) => {
        console.error('Error fetching categories in dashboard:', err);
        this.allCategories.set([]);
        return of([]);
      },
    });
  }

  /* Open update category dialog */
  dialog = inject(MatDialog);

  openDialogUpdateCategory(category: Category): void {
    const dialogRef = this.dialog.open(DialogUpdateCategory, {
      data: category,
    });

    //After update, update the signal
    dialogRef.afterClosed().subscribe((result: Category) => {
      if (result) {
        this.allCategories.update((categories) =>
          categories.map((cat) => {
            return cat.id === result.id ? result : cat;
          }),
        );
      }
    });
  }

  /* Handles the event emitted by the AddCategory component when a new category is added. */
  onCategoryAdded(newCategory: Category): void {
    this.allCategories.update((categories) => [...categories, newCategory]);
  }

  /* Calls the service's logout method to clear the token and redirect.   */
  logout(): void {
    this.authService.logout();
  }

  /* On init */
  ngOnInit(): void {
    this.getCategories();
  }
}
