import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BookDTO } from '@openapi';

@Component({
  selector: 'mxs-book-edit-dialog',
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
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent {
  editForm: FormGroup;
  originalData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookDTO,
    public dialogRef: MatDialogRef<EditComponent>,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.originalData = {
      title: data.title,
      price: data.price,
      pageCount: data.pageCount,
      onSale: data.onSale || false,
    };

    this.editForm = this.fb.group({
      title: [data.title, Validators.required],
      price: [data.price, [Validators.required, Validators.min(0.01)]],
      pageCount: [data.pageCount, [Validators.required, Validators.min(1)]],
      onSale: [data.onSale || false],
    });

    this.editForm.valueChanges.subscribe(() => {
      console.log('Form changed:', this.hasFormChanged());
    });
  }

  hasFormChanged(): boolean {
    const currentValues = this.editForm.value;
    return (
      currentValues.title !== this.originalData.title ||
      currentValues.price !== this.originalData.price ||
      currentValues.pageCount !== this.originalData.pageCount ||
      currentValues.onSale !== this.originalData.onSale
    );
  }

  isSaveDisabled(): boolean {
    return !this.editForm.valid || !this.hasFormChanged();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid && this.hasFormChanged()) {
      const updatedBook: BookDTO = {
        ...this.data,
        title: this.editForm.value.title,
        price: Number(this.editForm.value.price),
        pageCount: Number(this.editForm.value.pageCount),
        onSale: this.editForm.value.onSale,
        lastUpdated: new Date().toISOString(),
      };

      this.dialogRef.close(updatedBook);
    }
  }
}
