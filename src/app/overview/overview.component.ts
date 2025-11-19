import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { BookDTO, BookstoreBffService } from '@openapi';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { MaterialModules } from './material.modules';
import { BookDataService } from './services/book-data.service';
import { BookDialogService } from './services/book-dialog.service';
import { PaginatorIntl } from './services/paginator.service';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'mxs-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, MatPaginatorModule, MaterialModules],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntl }],
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  private dialog = inject(MatDialog);
  private bookstoreService = inject(BookstoreBffService);
  private dialogService = inject(BookDialogService);
  private dataService = inject(BookDataService);
  private snackbarService = inject(SnackbarService);

  public displayedColumns: string[] = ['title', 'price', 'saleStatus', 'actions'];
  public dataSource = new MatTableDataSource<BookDTO>([]);
  public showOnlyOnSale = false;
  public searchFilter: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private filterSubject = new BehaviorSubject<{ showOnlyOnSale: boolean; searchFilter: string }>({
    showOnlyOnSale: false,
    searchFilter: '',
  });

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setupDataSubscription();
    this.applyFilter();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataService.initializeDataSource(this.dataSource);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDataSubscription(): void {
    this.filterSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => prev.showOnlyOnSale === curr.showOnlyOnSale && prev.searchFilter === curr.searchFilter
        ),
        switchMap(filters =>
          this.bookstoreService
            .getBooks({ onSale: filters.showOnlyOnSale })
            .pipe(map((books: BookDTO[]) => this.applySearchFilterToBooks(books, filters.searchFilter)))
        ),
        tap((books: BookDTO[]) => {
          this.dataSource.data = books;
          // Update paginator when data changes
          if (this.paginator) {
            this.paginator.firstPage();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  applyFilter(): void {
    this.filterSubject.next({
      showOnlyOnSale: this.showOnlyOnSale,
      searchFilter: this.searchFilter,
    });
  }

  applySearchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchFilter = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  onSaleToggleChange(): void {
    this.applyFilter();
  }

  private applySearchFilterToBooks(books: BookDTO[], searchFilter: string): BookDTO[] {
    if (!searchFilter) {
      return books;
    }

    return books.filter(book => book.title?.toLowerCase().includes(searchFilter.toLowerCase()));
  }

  openDetailsDialog(book: BookDTO): void {
    this.dialogService.openDetailsDialog(book, this.dialog);
  }

  openEditDialog(book: BookDTO): void {
    this.dialogService.openEditDialog(
      book,
      this.dialog,
      this.bookstoreService,
      this.dataService,
      this.snackbarService,
      this.destroy$
    );
  }

  openDeleteDialog(book: BookDTO): void {
    this.dialogService.openDeleteDialog(
      book,
      this.dialog,
      this.bookstoreService,
      this.dataService,
      this.snackbarService,
      this.destroy$
    );
  }

  openCreateDialog(): void {
    this.dialogService.openCreateDialog(
      this.dialog,
      this.bookstoreService,
      this.dataService,
      this.snackbarService,
      this.destroy$
    );
  }
}
