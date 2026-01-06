import { Injectable, signal } from '@angular/core';
import { Category } from '../../../features/categories/models/categories.models';

@Injectable({ providedIn: 'root' })
export class CategoriesStateService {
  // The private writable signal
  private _categories = signal<Category[]>([]);
  private _categoriesIncome = signal<Category[]>([]);
  private _categoriesExpense = signal<Category[]>([]);

  // The public read-only signal that components consume
  readonly categories = this._categories.asReadonly();
  readonly categoriesIncome = this._categoriesIncome.asReadonly();
  readonly categoriesExpense = this._categoriesExpense.asReadonly();

  /* Sets categories */
  setCategories(categories: Category[]) {
    this._categories.set(categories);

    this.updateCategoriesTotals(categories);
  }

  setCategoriesIncome(categories: Category[]) {
    this._categoriesIncome.set(categories);
  }

  setCategoriesExpense(categories: Category[]) {
    this._categoriesExpense.set(categories);
  }

  /* Calculates and returns a new category object with the updated total amount.   */
  updateCategoryAmount(
    categoryId: number | null,
    oldAmount: number,
    newAmount: number,
  ) {
    this._categories.update((list) =>
      list.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              totalAmount: (cat.totalAmount ?? 0) - oldAmount + newAmount,
            }
          : cat,
      ),
    );
  }

  /* Category added */
  addCategory(newCategory: Category) {
    this._categories.update((categories) => {
      const updated = [...categories, newCategory];
      return updated.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.updateCategoriesTotals(this._categories());
  }

  /* Category updated */
  updateCategory(updatedCategory: Category) {
    this._categories.update((categories) =>
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category,
      ),
    );

    this.updateCategoriesTotals(this._categories());
  }

  /* Category deleted */
  deleteCategory(deletedCategory: Category) {
    this._categories.update((categories) =>
      categories.filter((category) => category.id !== deletedCategory.id),
    );

    this.updateCategoriesTotals(this._categories());
  }

  /* Update the categoriesIncome and categoriesExpense */
  private updateCategoriesTotals(categories: Category[]) {
    this.setCategoriesIncome([]);
    this.setCategoriesExpense([]);

    categories.map((category) => {
      if (category.type === 'INCOME') {
        this._categoriesIncome.update((list) => [...list, category]);
      } else {
        this._categoriesExpense.update((list) => [...list, category]);
      }
    });
  }
}
