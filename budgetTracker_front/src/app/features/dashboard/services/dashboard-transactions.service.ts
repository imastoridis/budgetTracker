import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCategory } from '../../categories/components/category-update.component';
import { DeleteCategory } from '../../categories/components/category-delete.component';
import { Category } from '../../categories/models/categories.models';
@Injectable({
  providedIn: 'root',
})
export class DashboardTransactionsService {
  private dialog = inject(MatDialog);

  /**
   * Opens the update transaction dialog.
   * @param transaction The transaction object to update.
   * @returns An Observable that emits the updated transaction object upon dialog close,
   */
  openDialogUpdateTransaction(transaction: Category): Observable<Category> {
    const dialogRef = this.dialog.open(UpdateCategory, {
      data: transaction,
    });

    // The component will subscribe to this Observable to update its signal.
    return dialogRef.afterClosed() as Observable<Category>;
  }

  /**
   * Opens the delete transaction dialog.
   * @param transaction The transaction object to update.
   * @returns An Observable that emits the updated transaction object upon dialog close,
   */
  openDialogDeleteTransaction(transaction: Category): Observable<Category> {
    const dialogRef = this.dialog.open(DeleteCategory, {
      data: transaction,
    });

    // The component will subscribe to this Observable to update its signal.
    return dialogRef.afterClosed() as Observable<Category>;
  }
}
