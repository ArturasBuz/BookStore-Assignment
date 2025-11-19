import { expect, test } from '@playwright/test';

import { BookStorePage } from './BookStorePage';

test.describe('Book Store - Add New Book', () => {
  let bookStorePage: BookStorePage;

  test.beforeEach(async ({ page }) => {
    bookStorePage = new BookStorePage(page);
    await bookStorePage.navigate();
  });

  test('should open create book dialog', async () => {
    await bookStorePage.openAddBookDialog();
    await expect(bookStorePage.dialogTitle).toBeVisible();
    await expect(bookStorePage.bookTitleInput).toBeVisible();
    await expect(bookStorePage.bookPriceInput).toBeVisible();
    await expect(bookStorePage.bookPageCountInput).toBeVisible();
    await expect(bookStorePage.onSaleCheckbox).toBeVisible();
    await expect(bookStorePage.saveButton).toBeVisible();
    await expect(bookStorePage.cancelButton).toBeVisible();
  });

  test('should create a new book successfully', async () => {
    const testBook = {
      title: 'Test Book',
      price: '29.99',
      pageCount: '300',
    };

    await bookStorePage.openAddBookDialog();
    await bookStorePage.fillBookForm(testBook.title, testBook.price, testBook.pageCount);
    await bookStorePage.saveBook();

    // Verify success message
    const successMessage = await bookStorePage.getSuccessMessage();
    await expect(successMessage).toBeVisible();

    // Verify book appears in table
    const isBookInTable = await bookStorePage.isBookInTable(testBook.title);
    expect(isBookInTable).toBeTruthy();
  });

  test('should cancel book creation', async () => {
    await bookStorePage.openAddBookDialog();

    // Fill some data but cancel
    await bookStorePage.fillBookForm('Cancel Test Book', '39.99', '400');
    await bookStorePage.cancelBook();

    // Verify dialog is closed and book not in table
    await expect(bookStorePage.dialogTitle).not.toBeVisible();

    const isBookInTable = await bookStorePage.isBookInTable('Cancel Test Book');
    expect(isBookInTable).toBeFalsy();
  });

  test('should close dialog using close button', async () => {
    await bookStorePage.openAddBookDialog();
    await bookStorePage.closeDialog();
    await expect(bookStorePage.dialogTitle).not.toBeVisible();
  });

  test('should create multiple books and verify in table', async () => {
    const testBooks = [
      { title: 'Book One', price: '20.50', pages: '150', onSale: true },
      { title: 'Book Two', price: '45.00', pages: '400', onSale: false },
      { title: 'Book Three', price: '15.99', pages: '200', onSale: true },
    ];

    for (const book of testBooks) {
      await bookStorePage.openAddBookDialog();
      await bookStorePage.fillBookForm(book.title, book.price, book.pages, book.onSale);
      await bookStorePage.saveBook();

      // Wait for success message to disappear
      await bookStorePage.page.waitForTimeout(1000);
    }

    // Verify all books are in the table
    for (const book of testBooks) {
      const isBookInTable = await bookStorePage.isBookInTable(book.title);
      expect(isBookInTable).toBeTruthy();
    }
  });
});
