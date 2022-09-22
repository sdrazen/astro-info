import { Component, OnInit } from '@angular/core';
import { NasaService } from './shared/nasa.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IApodModel } from './shared/data.apod.model';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.css']
})

export class ApodComponent implements OnInit {

  isLoggedIn: boolean;
  apod: IApodModel;

  // Variables for various error messages
  errorMessageApod: string = "";

  // Variables for translations
  t_ApodComponent_PanelTitle: string = "Astronomy Picture of the Day";
  t_ApodComponent_Title: string = "Title";
  t_ApodComponent_Explanation: string = "Explanation";
  t_ApodComponent_Date: string = "Date";
  t_ApodComponent_Copyright: string = "Copyright";

  constructor(private _nasaService: NasaService, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // Get data from Nasa service
    this._nasaService.getApod().subscribe(value => { this.apod = value; }, (err) => this.errorMessageApod = err);

    // Translations
    this.translate();

  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          this.t_ApodComponent_PanelTitle = this._translationsService.t_ApodComponent_PanelTitle;
          this.t_ApodComponent_Title = this._translationsService.t_ApodComponent_Title;
          this.t_ApodComponent_Explanation = this._translationsService.t_ApodComponent_Explanation;
          this.t_ApodComponent_Date = this._translationsService.t_ApodComponent_Date;
          this.t_ApodComponent_Copyright = this._translationsService.t_ApodComponent_Copyright;
        });
    } else {
      this.t_ApodComponent_PanelTitle = this._translationsService.t_ApodComponent_PanelTitle;
      this.t_ApodComponent_Title = this._translationsService.t_ApodComponent_Title;
      this.t_ApodComponent_Explanation = this._translationsService.t_ApodComponent_Explanation;
      this.t_ApodComponent_Date = this._translationsService.t_ApodComponent_Date;
      this.t_ApodComponent_Copyright = this._translationsService.t_ApodComponent_Copyright;
    }

  }

}
