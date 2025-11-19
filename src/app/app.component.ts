import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import defaultLanguage from '../assets/i18n/da.json';

@Component({
  selector: 'mxs-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  private translateService: TranslateService = inject(TranslateService);
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    // Kalbos konfigūracija
    this.translateService.setTranslation('da', defaultLanguage);
    this.translateService.setDefaultLang('da');

    // Material Symbols Outlined konfigūracija
    this.configureMaterialIcons();
  }

  private configureMaterialIcons(): void {
    // Nustatome Material Symbols Outlined kaip numatytąjį šriftą
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');

    // Registruojame šriftų aliasą
    this.iconRegistry.registerFontClassAlias('material-symbols-outlined');

    // Galima pridėti papildomų šriftų rinkinių jei reikia
    this.iconRegistry.registerFontClassAlias('material-symbols-filled', 'filled');
  }
}
