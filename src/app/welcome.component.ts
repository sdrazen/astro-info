import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: any;
  userSettingsDefined: boolean = false;

  // Variables for user settings
  lat: number = 0;
  lng: number = 0;
  timeZoneRawOffset: number = 0;
  languageId: number = 0;
  itemsPerPage: number = 0;
  pagesPerPageset: number = 0;

  // Variables for translations
  t_WelcomeComponent_PanelTitle: string = "Welcome";
  t_WelcomeComponent_Title: string = "Welcome to AstroInfo web application!";
  t_WelcomeComponent_YouAreLoggedInWith: string = "You are logged in with";
  t_WelcomeComponent_YouAreLoggedInAs: string = "as";
  t_WelcomeComponent_YourGeolocation: string = "Your geolocation";
  t_WelcomeComponent_Click: string = "click";
  t_WelcomeComponent_Settings: string = "Settings";
  t_WelcomeComponent_ToChange: string = "to change";
  t_WelcomeComponent_SettingsAdvise: string = "Before using this application it is advisable to first define Your";
  t_WelcomeComponent_SettingsAdviseAddendum: string = "for the application";

  constructor(private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // var p = this._firebaseAuthService.listenForAuthStateChanges();

    // p.then(user => {
    //   this.isLoggedIn = true;
    //   this.currentUser = user;

    //   // Use user settings from UserSettingsService
    //   this.lat = this._userSettingsService.lat;
    //   this.lng = this._userSettingsService.lng;
    //   this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
    //   this.languageId = this._userSettingsService.languageId;
    //   this.itemsPerPage = this._userSettingsService.itemsPerPage;
    //   this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

    //   // Are user settings defined?
    //   this.userSettingsDefined = this._userSettingsService.userSettingsDefined;

    //   // Translations
    //   this.translate();

    // })
    // .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

    this.isLoggedIn = true;
    // this.currentUser = user;

    // Use user settings from UserSettingsService
    this.lat = this._userSettingsService.lat;
    this.lng = this._userSettingsService.lng;
    this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
    this.languageId = this._userSettingsService.languageId;
    this.itemsPerPage = this._userSettingsService.itemsPerPage;
    this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

    // Are user settings defined?
    this.userSettingsDefined = this._userSettingsService.userSettingsDefined;

    // Translations
    this.translate();

  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          this.t_WelcomeComponent_PanelTitle = this._translationsService.t_WelcomeComponent_PanelTitle;
          this.t_WelcomeComponent_Title = this._translationsService.t_WelcomeComponent_Title;
          this.t_WelcomeComponent_YouAreLoggedInWith = this._translationsService.t_WelcomeComponent_YouAreLoggedInWith;
          this.t_WelcomeComponent_YouAreLoggedInAs = this._translationsService.t_WelcomeComponent_YouAreLoggedInAs;
          this.t_WelcomeComponent_YourGeolocation = this._translationsService.t_WelcomeComponent_YourGeolocation;
          this.t_WelcomeComponent_Click = this._translationsService.t_WelcomeComponent_Click;
          this.t_WelcomeComponent_Settings = this._translationsService.t_WelcomeComponent_Settings;
          this.t_WelcomeComponent_ToChange = this._translationsService.t_WelcomeComponent_ToChange;
          this.t_WelcomeComponent_SettingsAdvise = this._translationsService.t_WelcomeComponent_SettingsAdvise;
          this.t_WelcomeComponent_SettingsAdviseAddendum = this._translationsService.t_WelcomeComponent_SettingsAdviseAddendum;
        });
    } else {
      this.t_WelcomeComponent_PanelTitle = this._translationsService.t_WelcomeComponent_PanelTitle;
      this.t_WelcomeComponent_Title = this._translationsService.t_WelcomeComponent_Title;
      this.t_WelcomeComponent_YouAreLoggedInWith = this._translationsService.t_WelcomeComponent_YouAreLoggedInWith;
      this.t_WelcomeComponent_YouAreLoggedInAs = this._translationsService.t_WelcomeComponent_YouAreLoggedInAs;
      this.t_WelcomeComponent_YourGeolocation = this._translationsService.t_WelcomeComponent_YourGeolocation;
      this.t_WelcomeComponent_Click = this._translationsService.t_WelcomeComponent_Click;
      this.t_WelcomeComponent_Settings = this._translationsService.t_WelcomeComponent_Settings;
      this.t_WelcomeComponent_ToChange = this._translationsService.t_WelcomeComponent_ToChange;
      this.t_WelcomeComponent_SettingsAdvise = this._translationsService.t_WelcomeComponent_SettingsAdvise;
      this.t_WelcomeComponent_SettingsAdviseAddendum = this._translationsService.t_WelcomeComponent_SettingsAdviseAddendum;
    }

  }

}
