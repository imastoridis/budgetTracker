import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCategory } from '../../categories/components/category-delete.component';
import { Category } from '../../categories/models/categories.models';
@Injectable({
  providedIn: 'root',
})
export class DashboardCategoriesService {
  private dialog = inject(MatDialog);

  /**
   * Opens the update category dialog.
   * @param category The category object to update.
   * @returns An Observable that emits the updated Category object upon dialog close,
   * or null/undefined if the dialog is cancelled.
   */
  openDialogDeleteCategory(category: Category): Observable<Category> {
    const dialogRef = this.dialog.open(DeleteCategory, {
      data: category,
    });

    // The component will subscribe to this Observable to update its signal.
    return dialogRef.afterClosed() as Observable<Category>;
  }
}
