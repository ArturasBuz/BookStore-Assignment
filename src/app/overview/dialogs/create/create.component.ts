import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { BookDTO } from '@openapi';

import { BookstoreBffService } from './../../../../../openapi/generated/api/bookstore-bff.service';

@Component({
  selector: 'mxs-book-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    TranslateModule,
    MatIconModule,
  ],
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent {
  createForm: FormGroup;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<CreateComponent>,
    private fb: FormBuilder,
    @Inject(BookstoreBffService) private bookstoreService: BookstoreBffService
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      pageCount: ['', [Validators.required, Validators.min(1)]],
      onSale: [true],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.createForm.valid) {
      const formData = this.createForm.value;
      const createdBook: BookDTO = {
        id: this.generateRandomId(),
        title: formData.title,
        price: Number(formData.price),
        pageCount: Number(formData.pageCount),
        onSale: formData.onSale,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: 'You',
      };

      this.dialogRef.close(createdBook);
    }
  }

  private generateRandomId(): string {
    return 'xyxqwe1-' + Math.random().toString(36).substr(2, 8) + '-' + Math.random().toString(36).substr(2, 6);
  }
}
