import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Injectable()
export class PaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateTranslations();
    });

    this.updateTranslations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateTranslations(): void {
    this.translate
      .get([
        'paginator.itemsPerPage',
        'paginator.nextPage',
        'paginator.previousPage',
        'paginator.firstPage',
        'paginator.lastPage',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        this.itemsPerPageLabel = translations['paginator.itemsPerPage'];
        this.nextPageLabel = translations['paginator.nextPage'];
        this.previousPageLabel = translations['paginator.previousPage'];
        this.firstPageLabel = translations['paginator.firstPage'];
        this.lastPageLabel = translations['paginator.lastPage'];

        this.changes.next();
      });

    this.getRangeLabel = (page: number, pageSize: number, length: number): string => {
      const validatedLength = Math.max(length, 0);

      if (validatedLength === 0 || pageSize === 0) {
        return this.translate.instant('paginator.rangeEmpty', { total: validatedLength });
      }

      const startIndex = page * pageSize;
      const endIndex =
        startIndex < validatedLength ? Math.min(startIndex + pageSize, validatedLength) : startIndex + pageSize;

      return this.translate.instant('paginator.range', {
        start: startIndex + 1,
        end: endIndex,
        total: validatedLength,
      });
    };
  }
}
