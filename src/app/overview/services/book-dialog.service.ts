import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BookCreateDTO, BookDTO, BookstoreBffService, BookUpdateDTO } from '@openapi';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CreateComponent } from '../dialogs/create/create.component';
import { DeleteComponent } from '../dialogs/delete/delete.component';
import { DetailsComponent } from '../dialogs/details/details.component';
import { EditComponent } from '../dialogs/edit/edit.component';
import { BookDataService } from './book-data.service';
import { SnackbarService } from './snackbar.service';

@Injectable({ providedIn: 'root' })
export class BookDialogService {
  private translate = inject(TranslateService);

  openDetailsDialog(book: BookDTO, dialog: MatDialog): void {
    dialog.open(DetailsComponent, {
      panelClass: 'dialog',
      data: book,
    });
  }

  openEditDialog(
    book: BookDTO,
    dialog: MatDialog,
    bookstoreService: BookstoreBffService,
    dataService: BookDataService,
    snackbarService: SnackbarService,
    destroy$: Subject<void>
  ): void {
    const dialogRef = dialog.open(EditComponent, {
      panelClass: 'dialog',
      data: book,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((updatedBook: BookDTO) => {
        if (updatedBook) {
          dataService.updateBookInDataSource(updatedBook);

          const bookUpdateDTO: BookUpdateDTO = {
            title: updatedBook.title,
            price: updatedBook.price || 0,
            onSale: updatedBook.onSale || false,
            pageCount: updatedBook.pageCount || 0,
            lastUpdated: Date.now(),
          };

          bookstoreService
            .updateBook({
              bookId: updatedBook.id!,
              bookUpdateDTO,
            })
            .subscribe({
              next: () =>
                snackbarService.showSuccess(
                  this.translate.instant('messages.bookUpdated', { title: updatedBook.title })
                ),
              error: error => {
                console.error('Update error:', error);
                dataService.updateBookInDataSource(book);
                snackbarService.showError(this.translate.instant('errors.bookUpdateFailed'));
              },
            });
        }
      });
  }

  openDeleteDialog(
    book: BookDTO,
    dialog: MatDialog,
    bookstoreService: BookstoreBffService,
    dataService: BookDataService,
    snackbarService: SnackbarService,
    destroy$: Subject<void>
  ): void {
    const dialogRef = dialog.open(DeleteComponent, {
      panelClass: 'dialog',
      data: book,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          dataService.removeBookFromDataSource(book);

          bookstoreService.deleteBook({ bookId: book.id! }).subscribe({
            next: () =>
              snackbarService.showSuccess(this.translate.instant('messages.bookDeleted', { title: book.title })),
            error: error => {
              console.error('Delete error:', error);
              dataService.addBookToDataSource(book);
              snackbarService.showError(this.translate.instant('errors.bookDeleteFailed'));
            },
          });
        }
      });
  }

  openCreateDialog(
    dialog: MatDialog,
    bookstoreService: BookstoreBffService,
    dataService: BookDataService,
    snackbarService: SnackbarService,
    destroy$: Subject<void>
  ): void {
    const dialogRef = dialog.open(CreateComponent, {
      panelClass: 'dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((createdBook: BookDTO) => {
        if (createdBook) {
          dataService.addBookToDataSource(createdBook);

          const bookCreateDTO: BookCreateDTO = {
            title: createdBook.title,
            price: createdBook.price || 0,
            onSale: createdBook.onSale || false,
            pageCount: createdBook.pageCount || 0,
          };

          bookstoreService.createBook({ bookCreateDTO }).subscribe({
            next: () =>
              snackbarService.showSuccess(this.translate.instant('messages.bookCreated', { title: createdBook.title })),
            error: error => {
              console.error('Create error:', error);
              dataService.removeBookFromDataSource(createdBook);
              snackbarService.showError(this.translate.instant('errors.createFailed', { title: createdBook.title }));
            },
          });
        }
      });
  }
}
