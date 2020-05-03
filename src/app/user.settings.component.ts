import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { GoogleService } from './shared/google.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IUserSettingsModel } from './shared/user.settings.model';

@Component({
  selector: 'app-usersettings',
  templateUrl: './user.settings.component.html',
  styleUrls: ['./user.settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: any;

  // Variables for user settings
  lat: number = 0;
  lng: number = 0;
  timeZoneRawOffset: number = 0;
  languageId: number = 0;
  itemsPerPage: number = 0;
  pagesPerPageset: number = 0;
  userSettings: IUserSettingsModel = {lat: 0, lng: 0, timeZoneRawOffset: 0, languageId: 0, itemsPerPage: 0, pagesPerPageset: 0};

  // Variables for Google Maps
  zoom: number = 10;
  draggable: boolean = true;
  iconUrl: string = "assets/img/user.png";
  showSettingsUpdatedAlert: boolean = false;

  // Variables for various error messages
  errorMessageGoogleTimeZone: string = "";

  // Variables for Google Time Zone
  timestamp: number = Math.round(new Date().getTime()/1000.0);
  timeZone: Observable<any>;

  // Language list
  languageList: Array<any> = [];

  // Current language title
  languageTitle: string = "";

  // Variables for translations
  t_SettingsComponent_PanelTitle: string = "Application settings";
  t_SettingsComponent_MapTitle: string = "Click on map or drag marker to update Your location";
  t_SettingsComponent_Latitude: string = "Latitude";
  t_SettingsComponent_Longitude: string = "Longitude";
  t_SettingsComponent_DaylightSavingsOffset: string = "Daylight savings offset (hours)";
  t_SettingsComponent_RawOffset: string = "Raw offset (hours)";
  t_SettingsComponent_TimeZoneId: string = "Time zone ID";
  t_SettingsComponent_TimeZoneName: string = "Time zone name";
  t_SettingsComponent_OtherSettingsTitle: string = "Select Your other preferred application settings";
  t_SettingsComponent_PreferredLanguage: string = "Your preferred language";
  t_SettingsComponent_ItemsPerPage: string = "Items per page in objects list";
  t_SettingsComponent_PagesPerPageset: string = "Pages per pageset in objects list";
  t_SettingsComponent_SaveAlert: string = "Your settings are updated and saved!";
  t_SettingsComponent_Save: string = "Save";
  t_SettingsComponent_Choose: string = "Choose";

  constructor(private _firebaseAuthService: FirebaseAuthService, private _router: Router, private _googleService: GoogleService, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService, private _appComponent: AppComponent) { }

  ngOnInit() {

      // var p = this._firebaseAuthService.listenForAuthStateChanges();

      // p.then(user => {
      //   this.isLoggedIn = true;
      //   this.currentUser = user;

      //   // Use user settings from service
      //   this.lat = this._userSettingsService.lat;
      //   this.lng = this._userSettingsService.lng;
      //   this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
      //   this.languageId = this._userSettingsService.languageId;
      //   this.itemsPerPage = this._userSettingsService.itemsPerPage;
      //   this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

      //   // Get time zone from Google Time Zone API
      //   this.timestamp = Math.round(new Date().getTime()/1000.0);
      //   this._googleService.getTimeZone(this.lat.toString(), this.lng.toString(), this.timestamp).subscribe(timeZone => {this.timeZone = timeZone; this.timeZoneRawOffset = timeZone.rawOffset/3600;}, (err) => this.errorMessageGoogleTimeZone = err);

      //   // Translations
      //   this.translate(false);

      // })
      // .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

        this.isLoggedIn = true;
        // this.currentUser = user;

        // Use user settings from service
        this.lat = this._userSettingsService.lat;
        this.lng = this._userSettingsService.lng;
        this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
        this.languageId = this._userSettingsService.languageId;
        this.itemsPerPage = this._userSettingsService.itemsPerPage;
        this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

        // Get time zone from Google Time Zone API
        this.timestamp = Math.round(new Date().getTime()/1000.0);
        this._googleService.getTimeZone(this.lat.toString(), this.lng.toString(), this.timestamp).subscribe(timeZone => {this.timeZone = timeZone; this.timeZoneRawOffset = timeZone.rawOffset/3600;}, (err) => this.errorMessageGoogleTimeZone = err);

        // Translations
        this.translate(false);

  }

  onMapClick($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    // Get time zone from Google Time Zone API
    this.timestamp = Math.round(new Date().getTime()/1000.0);
    this._googleService.getTimeZone(this.lat.toString(), this.lng.toString(), this.timestamp).subscribe(timeZone => {this.timeZone = timeZone; this.timeZoneRawOffset = timeZone.rawOffset/3600;}, (err) => this.errorMessageGoogleTimeZone = err);
  }

  onMarkerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    // Get time zone from Google Time Zone API
    this.timestamp = Math.round(new Date().getTime()/1000.0);
    this._googleService.getTimeZone(this.lat.toString(), this.lng.toString(), this.timestamp).subscribe(timeZone => {this.timeZone = timeZone; this.timeZoneRawOffset = timeZone.rawOffset/3600;}, (err) => this.errorMessageGoogleTimeZone = err);
  }

  onSettingsSaveClick() {
    // Prepare object to save through user settings service
    this.userSettings.lat = parseFloat(this.lat.toString());
    this.userSettings.lng = parseFloat(this.lng.toString());
    this.userSettings.timeZoneRawOffset = parseInt(this.timeZoneRawOffset.toString());
    this.userSettings.languageId = parseInt(this.languageId.toString());
    this.userSettings.itemsPerPage = parseInt(this.itemsPerPage.toString());
    this.userSettings.pagesPerPageset = parseInt(this.pagesPerPageset.toString());
    // Save settings
    this._userSettingsService.setUserSettings(this.userSettings);
    // Show update message to the user
    this.showSettingsUpdateAlert();
    // Set translations again because user may have changed his preferred langauge
    this.translate(true);
  }

  showSettingsUpdateAlert() {
    this.showSettingsUpdatedAlert = true;
    setTimeout(() => {
      this.showSettingsUpdatedAlert = false;
    }, 4000);
    
  }

  changeLanguage(languageId: number, languageTitle: string): void {
    this.languageId = languageId;
    this.languageTitle = languageTitle;
  }

  getFlagPath(languageTitle: string): string {
        return "/assets/flags/" + languageTitle + ".png";
  }

  translate(forceTranslation: boolean) {

      if (this._translationsService.translationsSetToVariables === false || forceTranslation === true) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  // Language list
                  this.languageList = this._translationsService.languageList;
                  // Current language title
                  this.languageTitle = this._translationsService.languagetitle;
                  // Translations
                  this.t_SettingsComponent_PanelTitle = this._translationsService.t_SettingsComponent_PanelTitle;
                  this.t_SettingsComponent_MapTitle = this._translationsService.t_SettingsComponent_MapTitle;
                  this.t_SettingsComponent_Latitude = this._translationsService.t_SettingsComponent_Latitude;
                  this.t_SettingsComponent_Longitude = this._translationsService.t_SettingsComponent_Longitude;
                  this.t_SettingsComponent_DaylightSavingsOffset = this._translationsService.t_SettingsComponent_DaylightSavingsOffset;
                  this.t_SettingsComponent_RawOffset = this._translationsService.t_SettingsComponent_RawOffset;
                  this.t_SettingsComponent_TimeZoneId = this._translationsService.t_SettingsComponent_TimeZoneId;
                  this.t_SettingsComponent_TimeZoneName = this._translationsService.t_SettingsComponent_TimeZoneName;
                  this.t_SettingsComponent_OtherSettingsTitle = this._translationsService.t_SettingsComponent_OtherSettingsTitle;
                  this.t_SettingsComponent_PreferredLanguage = this._translationsService.t_SettingsComponent_PreferredLanguage;
                  this.t_SettingsComponent_ItemsPerPage = this._translationsService.t_SettingsComponent_ItemsPerPage;
                  this.t_SettingsComponent_PagesPerPageset = this._translationsService.t_SettingsComponent_PagesPerPageset;
                  this.t_SettingsComponent_SaveAlert = this._translationsService.t_SettingsComponent_SaveAlert;
                  this.t_SettingsComponent_Save = this._translationsService.t_SettingsComponent_Save;
                  this.t_SettingsComponent_Choose = this._translationsService.t_SettingsComponent_Choose;
                  // If user just saved new user settings (forceTranslation = true), then take care of AppComponent's menus, show changes right away if user changed language
                  if (forceTranslation === true) {
                      this._appComponent.languageId = this._userSettingsService.languageId;
                      this._appComponent.t_AppComponent_Home = this._translationsService.t_AppComponent_Home;
                      this._appComponent.t_AppComponent_Objects = this._translationsService.t_AppComponent_Objects;
                      this._appComponent.t_AppComponent_Data = this._translationsService.t_AppComponent_Data;
                      this._appComponent.t_AppComponent_DeepSky = this._translationsService.t_AppComponent_DeepSky;
                      this._appComponent.t_AppComponent_Calculator = this._translationsService.t_AppComponent_Calculator;
                      this._appComponent.t_AppComponent_Apod = this._translationsService.t_AppComponent_Apod;
                      this._appComponent.t_AppComponent_Neo = this._translationsService.t_AppComponent_Neo;
                      this._appComponent.t_AppComponent_SolarEclipses = this._translationsService.t_AppComponent_SolarEclipses;
                      this._appComponent.t_AppComponent_LunarEclipses = this._translationsService.t_AppComponent_LunarEclipses;
                      this._appComponent.t_AppComponent_SunAndMoon = this._translationsService.t_AppComponent_SunAndMoon;
                      this._appComponent.t_AppComponent_Iss = this._translationsService.t_AppComponent_Iss;
                      this._appComponent.t_AppComponent_Moonfeatures = this._translationsService.t_AppComponent_Moonfeatures;
                      this._appComponent.t_AppComponent_Stores = this._translationsService.t_AppComponent_Stores;
                      this._appComponent.t_AppComponent_Locations = this._translationsService.t_AppComponent_Locations;
                      this._appComponent.t_AppComponent_Weather = this._translationsService.t_AppComponent_Weather;
                      this._appComponent.t_AppComponent_Settings = this._translationsService.t_AppComponent_Settings;
                      this._appComponent.t_AppComponent_About = this._translationsService.t_AppComponent_About;
                      this._appComponent.t_AppComponent_Others = this._translationsService.t_AppComponent_Others;
                      this._appComponent.t_AppComponent_Logout = this._translationsService.t_AppComponent_Logout;
                  }
              });
      } else {
                  // Language list
                  this.languageList = this._translationsService.languageList;
                  // Current language title
                  this.languageTitle = this._translationsService.languagetitle;
                  // Translations
                  this.t_SettingsComponent_PanelTitle = this._translationsService.t_SettingsComponent_PanelTitle;
                  this.t_SettingsComponent_MapTitle = this._translationsService.t_SettingsComponent_MapTitle;
                  this.t_SettingsComponent_Latitude = this._translationsService.t_SettingsComponent_Latitude;
                  this.t_SettingsComponent_Longitude = this._translationsService.t_SettingsComponent_Longitude;
                  this.t_SettingsComponent_DaylightSavingsOffset = this._translationsService.t_SettingsComponent_DaylightSavingsOffset;
                  this.t_SettingsComponent_RawOffset = this._translationsService.t_SettingsComponent_RawOffset;
                  this.t_SettingsComponent_TimeZoneId = this._translationsService.t_SettingsComponent_TimeZoneId;
                  this.t_SettingsComponent_TimeZoneName = this._translationsService.t_SettingsComponent_TimeZoneName;
                  this.t_SettingsComponent_OtherSettingsTitle = this._translationsService.t_SettingsComponent_OtherSettingsTitle;
                  this.t_SettingsComponent_PreferredLanguage = this._translationsService.t_SettingsComponent_PreferredLanguage;
                  this.t_SettingsComponent_ItemsPerPage = this._translationsService.t_SettingsComponent_ItemsPerPage;
                  this.t_SettingsComponent_PagesPerPageset = this._translationsService.t_SettingsComponent_PagesPerPageset;
                  this.t_SettingsComponent_SaveAlert = this._translationsService.t_SettingsComponent_SaveAlert;
                  this.t_SettingsComponent_Save = this._translationsService.t_SettingsComponent_Save;
                  this.t_SettingsComponent_Choose = this._translationsService.t_SettingsComponent_Choose;
      }

  }

}
