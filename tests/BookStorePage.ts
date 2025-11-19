import { Locator, Page } from '@playwright/test';

export class BookStorePage {
  readonly page: Page;

  // Main page elements
  readonly addBookButton: Locator;
  readonly showOffersToggle: Locator;
  readonly searchInput: Locator;
  readonly bookTable: Locator;

  // Create dialog elements
  readonly dialogTitle: Locator;
  readonly bookTitleInput: Locator;
  readonly bookPriceInput: Locator;
  readonly bookPageCountInput: Locator;
  readonly onSaleCheckbox: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeDialogButton: Locator;

  // Validation errors
  readonly titleError: Locator;
  readonly priceError: Locator;
  readonly pageCountError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main page locators
    this.addBookButton = page.locator('[data-test-id="button-create-book"]');
    this.showOffersToggle = page.locator('mat-slide-toggle');
    this.searchInput = page.locator('[data-test-id="input-search-book"]');
    this.bookTable = page.locator('table');

    // Create dialog locators
    this.dialogTitle = page.locator('h2', { hasText: 'Opret ny bog' });
    this.bookTitleInput = page.locator('input[formControlName="title"]');
    this.bookPriceInput = page.locator('input[formControlName="price"]');
    this.bookPageCountInput = page.locator('input[formControlName="pageCount"]');
    this.onSaleCheckbox = page.locator('mat-checkbox[formControlName="onSale"]');
    this.saveButton = page.locator('[data-test-id="button-create-book-save"]');
    this.cancelButton = page.locator('[data-test-id="button-create-book-cancel"]');
    this.closeDialogButton = page.locator('[data-test-id="button-create-book-close"]');

    // Error messages
    this.titleError = page.locator('mat-error', { hasText: 'Dette felt er påkrævet' });
    this.priceError = page.locator('mat-error', { hasText: 'Prisen skal være mindst 0.01' });
    this.pageCountError = page.locator('mat-error', { hasText: 'Skal have mindst 1 side' });
  }

  async navigate() {
    await this.page.goto('http://localhost:4200');
  }

  async openAddBookDialog() {
    await this.addBookButton.click();
    await this.dialogTitle.waitFor({ state: 'visible' });
  }

  async fillBookForm(title: string, price: string, pageCount: string, onSale: boolean = true) {
    if (title) await this.bookTitleInput.fill(title);
    if (price) await this.bookPriceInput.fill(price);
    if (pageCount) await this.bookPageCountInput.fill(pageCount);

    await this.setOnSaleCheckbox(onSale);
  }

  async setOnSaleCheckbox(checked: boolean): Promise<void> {
    const currentState = await this.isCheckboxChecked();
    if (currentState !== checked) {
      await this.onSaleCheckbox.click();
      // Wait for the state to be updated
      await this.page.waitForTimeout(100);
    }
  }

  async isCheckboxChecked(): Promise<boolean> {
    const isChecked = await this.onSaleCheckbox.getAttribute('aria-checked');
    return isChecked === 'true';
  }

  async saveBook() {
    await this.saveButton.click();
  }

  async cancelBook() {
    await this.cancelButton.click();
  }

  async closeDialog() {
    await this.closeDialogButton.click();
  }

  async getSuccessMessage() {
    return this.page.locator('mat-snack-bar-container', { hasText: 'Bogen "Test Book" oprettet succesfuldt!' });
  }

  async isBookInTable(title: string): Promise<boolean> {
    await this.bookTable.waitFor({ state: 'visible' });
    const bookRows = this.bookTable.locator('td');
    const count = await bookRows.count();

    for (let i = 0; i < count; i++) {
      const row = bookRows.nth(i);
      const rowText = await row.textContent();
      if (rowText?.includes(title)) {
        return true;
      }
    }
    return false;
  }

  async searchBooks(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async waitForDialogToClose() {
    await this.dialogTitle.waitFor({ state: 'hidden' });
  }

  async getTableRowCount(): Promise<number> {
    await this.bookTable.waitFor({ state: 'visible' });
    const bookRows = this.bookTable.locator('tbody tr');
    return await bookRows.count();
  }

  async getBookRowByTitle(title: string): Promise<Locator | null> {
    await this.bookTable.waitFor({ state: 'visible' });
    const bookRows = this.bookTable.locator('tbody tr');
    const count = await bookRows.count();

    for (let i = 0; i < count; i++) {
      const row = bookRows.nth(i);
      const rowText = await row.textContent();
      if (rowText?.includes(title)) {
        return row;
      }
    }
    return null;
  }

  async clickEditButtonForBook(title: string) {
    const row = await this.getBookRowByTitle(title);
    if (row) {
      await row.locator('[data-test-id="button-edit-book"]').click();
    }
  }

  async clickDeleteButtonForBook(title: string) {
    const row = await this.getBookRowByTitle(title);
    if (row) {
      await row.locator('[data-test-id="button-delete-book"]').click();
    }
  }

  async clickDetailsButtonForBook(title: string) {
    const row = await this.getBookRowByTitle(title);
    if (row) {
      await row.locator('[data-test-id="button-details-book"]').click();
    }
  }

  async toggleShowOffers() {
    await this.showOffersToggle.click();
    await this.page.waitForTimeout(300);
  }

  async isShowOffersChecked(): Promise<boolean> {
    const isChecked = await this.showOffersToggle.getAttribute('aria-checked');
    return isChecked === 'true';
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }
}
