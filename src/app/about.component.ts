import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  isLoggedIn: boolean;

  // Variables for translations
  t_AboutComponent_PanelTitle: string = "About";
  t_AboutComponent_PanelContent: string = "This web application was born as result of combination of my two passions: astronomy as hobby and programming as professional occupation. It offers many useful information and calculations that can help amateur astronomers in planning their astronomy/astrophotograpy sessions. It also has some additional features and interesting data provided by external web services such as NASA which is updated on a daily basis. Some of application's features are: extensive information on numerous deep-sky objects, calculator which converts RA/DEC coordinates to ALT/AZ coordinates, modern user interface, easy user's geographical location definition and update by mouse click, daily new astonomy picture of the day, user definable data such as astronomy stores or locations suitable for astronomy/astrophotography, current ISS (International space station) real-time data and their visual presentation on a map and much more... Application currently supports three languages (English, Croatian and German) but it can be easily translated to other languages, too. I hope You'll find this web application useful and have a good time using it, at least as much as I enjoyed working on it!";
  t_AboutComponent_PleaseDonate: string = "Please donate (optional)";
  t_AboutComponent_Option: string = "Option";

  constructor(private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // Translations
    this.translate();

  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          this.t_AboutComponent_PanelTitle = this._translationsService.t_AboutComponent_PanelTitle;
          this.t_AboutComponent_PanelContent = this._translationsService.t_AboutComponent_PanelContent;
          this.t_AboutComponent_PleaseDonate = this._translationsService.t_AboutComponent_PleaseDonate;
          this.t_AboutComponent_Option = this._translationsService.t_AboutComponent_Option;
        });
    } else {
      this.t_AboutComponent_PanelTitle = this._translationsService.t_AboutComponent_PanelTitle;
      this.t_AboutComponent_PanelContent = this._translationsService.t_AboutComponent_PanelContent;
      this.t_AboutComponent_PleaseDonate = this._translationsService.t_AboutComponent_PleaseDonate;
      this.t_AboutComponent_Option = this._translationsService.t_AboutComponent_Option;
    }

  }

}
