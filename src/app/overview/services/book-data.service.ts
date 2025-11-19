import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BookDTO } from '@openapi';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookDataService implements OnDestroy {
  private dataSource: MatTableDataSource<BookDTO> | null = null;
  private destroy$ = new Subject<void>();

  initializeDataSource(dataSource: MatTableDataSource<BookDTO>): void {
    this.dataSource = dataSource;
  }

  updateDataSource(books: BookDTO[], paginator?: MatPaginator): void {
    if (!this.dataSource) return;

    this.dataSource.data = books;

    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  addBookToDataSource(newBook: BookDTO, paginator?: MatPaginator): void {
    if (!this.dataSource || !newBook?.id) return;

    this.dataSource.data = [newBook, ...this.dataSource.data];
    paginator?.firstPage();
  }

  updateBookInDataSource(updatedBook: BookDTO): void {
    if (!this.dataSource || !updatedBook?.id) return;

    const currentData = this.dataSource.data;
    const updatedData = currentData.map(book => (book.id === updatedBook.id ? { ...book, ...updatedBook } : book));
    this.dataSource.data = updatedData;
  }

  removeBookFromDataSource(bookToRemove: BookDTO): void {
    if (!this.dataSource || !bookToRemove?.id) return;

    const currentData = this.dataSource.data;
    const updatedData = currentData.filter(book => book.id !== bookToRemove.id);
    this.dataSource.data = updatedData;
  }

  getCurrentData(): BookDTO[] {
    return this.dataSource ? [...this.dataSource.data] : [];
  }

  findBookById(bookId: string): BookDTO | undefined {
    return this.dataSource?.data.find(book => book.id === bookId);
  }

  bookExists(bookId: string): boolean {
    return !!this.findBookById(bookId);
  }

  clearDataSource(): void {
    if (this.dataSource) {
      this.dataSource.data = [];
    }
  }

  getDataSource(): MatTableDataSource<BookDTO> | null {
    return this.dataSource;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dataSource = null;
  }
}
