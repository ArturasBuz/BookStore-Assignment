import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BookDTO } from '@openapi';

@Component({
  selector: 'mxs-book-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule, MatIconModule],
  templateUrl: './details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookDTO,
    public dialogRef: MatDialogRef<DetailsComponent>,
    private translate: TranslateService
  ) {}

  getSaleStatusText(isOnSale: boolean): string {
    return isOnSale ? this.translate.instant('status.yes') : this.translate.instant('status.no');
  }
}
