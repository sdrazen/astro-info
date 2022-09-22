import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { GoogleService } from './shared/google.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IUserSettingsModel } from './shared/user.settings.model';
import { ITimezoneModel } from './shared/data.timezone.model';
import { Globals } from 'common/globals';
import { BackendService } from './shared/backend.service';

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
  dataSource: number = 0;
  apiSource: number = 1;
  itemsPerPage: number = 0;
  pagesPerPageset: number = 0;
  userSettings: IUserSettingsModel = { lat: 0, lng: 0, timeZoneRawOffset: 0, languageId: 0, dataSource: 0, apiSource: 1, itemsPerPage: 0, pagesPerPageset: 0 };

  // Variables for Google Maps
  zoom: number = 10;
  draggable: boolean = true;
  iconUrl: string = "assets/img/user.png";
  showSettingsUpdatedAlert: boolean = false;

  // Variables for various error messages
  errorMessageGoogleTimeZone: string = "";

  // Variables for Google Time Zone
  timestamp: number = Math.round(new Date().getTime() / 1000.0);
  timeZone: ITimezoneModel;

  // Language list
  languageList: Array<any> = [];

  // Current language title
  languageTitle: string = "";

  // Data source list
  dataSourceList: Array<any> = [];

  // Current data source title
  dataSourceTitle: string = "";
  dataSourceLocation: string = "";
  dataSourceCalledFrom: string = "";

  // Api source list
  apiSourceList: Array<any> = [];

  // Current api source title
  apiSourceTitle: string = "";
  apiSourceCalledFrom: string = "";

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
  t_SettingsComponent_PreferredDataSource: string = "Your preferred data source";
  t_SettingsComponent_ItemsPerPage: string = "Items per page in objects list";
  t_SettingsComponent_PagesPerPageset: string = "Pages per pageset in objects list";
  t_SettingsComponent_SaveAlert: string = "Your settings are updated and saved!";
  t_SettingsComponent_Save: string = "Save";
  t_SettingsComponent_Choose: string = "Choose";
  t_SettingsComponent_From: string = "from";

  constructor(private _googleService: GoogleService, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService, private _appComponent: AppComponent, private _backendService: BackendService) { }

  ngOnInit() {

    // Use user settings from service
    this.lat = this._userSettingsService.lat;
    this.lng = this._userSettingsService.lng;
    this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
    this.languageId = this._userSettingsService.languageId;
    this.dataSource = this._userSettingsService.dataSource;
    this.apiSource = this._userSettingsService.apiSource;
    this.itemsPerPage = this._userSettingsService.itemsPerPage;
    this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

    // Set data source in Globals to correct value
    Globals.DATA_SOURCE = this.dataSource;

    // Get correct data source title
    this.dataSourceList = this._userSettingsService.dataSourceList;
    this.dataSourceTitle = this._userSettingsService.getDataSourceTitle();
    this.dataSourceLocation = this._userSettingsService.getDataSourceLocation();
    this.dataSourceCalledFrom = this._userSettingsService.getDataSourceCalledFrom();

    // Set api source in Globals to correct value
    Globals.API_SOURCE = this.apiSource;

    // Get correct api source title
    this.apiSourceList = this._userSettingsService.apiSourceList;
    this.apiSourceTitle = this._userSettingsService.getApiSourceTitle();
    this.apiSourceCalledFrom = this._userSettingsService.getApiSourceCalledFrom();

    // Get time zone from Google Time Zone API
    this.timestamp = Math.round(new Date().getTime() / 1000.0);
    this._googleService.getTimeZone(this.lat.toString(), this.lng.toString(), this.timestamp).subscribe(timeZone => { this.timeZone = timeZone; this.timeZoneRawOffset = timeZone.rawOffset / 3600; }, (err) => this.errorMessageGoogleTimeZone = err);

    // Translations
    this.translate(false);

  }

  onMapClick($event: google.maps.MapMouseEvent) {
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
    // Get time zone from Google Time Zone API
    this.timestamp = Math.round(new Date().getTime() / 1000.0);
    this._googleService.getTimeZone(this.lat.toString(), this.lng.toString(), this.timestamp).subscribe(timeZone => { this.timeZone = timeZone; this.timeZoneRawOffset = timeZone.rawOffset / 3600; }, (err) => this.errorMessageGoogleTimeZone = err);
  }

  onMarkerDragEnd($event: google.maps.MapMouseEvent) {
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
    // Get time zone from Google Time Zone API
    this.timestamp = Math.round(new Date().getTime() / 1000.0);
    this._googleService.getTimeZone(this.lat.toString(), this.lng.toString(), this.timestamp).subscribe(timeZone => { this.timeZone = timeZone; this.timeZoneRawOffset = timeZone.rawOffset / 3600; }, (err) => this.errorMessageGoogleTimeZone = err);
  }

  onSettingsSaveClick() {
    // Prepare object to save through user settings service
    this.userSettings.lat = parseFloat(this.lat.toString());
    this.userSettings.lng = parseFloat(this.lng.toString());
    this.userSettings.timeZoneRawOffset = parseInt(this.timeZoneRawOffset.toString());
    this.userSettings.languageId = parseInt(this.languageId.toString());
    this.userSettings.dataSource = parseInt(this.dataSource.toString());
    this.userSettings.apiSource = parseInt(this.apiSource.toString());
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

  changeDataSource(dataSource: number, dataSourceTitle: string): void {

    this.dataSource = dataSource;
    this.dataSourceTitle = dataSourceTitle;

    // Set global variable to correct value
    Globals.DATA_SOURCE = dataSource;

    // Get additional data (titles) about the data source
    this.dataSourceLocation = this._userSettingsService.getDataSourceLocation();
    this.dataSourceCalledFrom = this._userSettingsService.getDataSourceCalledFrom();

    // Let AppComponent know about the change so it can display the correct data source and additional info
    this._appComponent.dataSource = dataSource;
    this._appComponent.dataSourceTitle = dataSourceTitle;
    this._appComponent.dataSourceLocation = this.dataSourceLocation;
    this._appComponent.dataSourceCalledFrom = this.dataSourceCalledFrom;

    // Reset all data
    this._backendService.init();

  }

  changeApiSource(apiSource: number, apiSourceTitle: string): void {

    this.apiSource = apiSource;
    this.apiSourceTitle = apiSourceTitle;

    // Set global variable to correct value
    Globals.API_SOURCE = apiSource;

    // Get additional data (titles) about the data source
    this.apiSourceCalledFrom = this._userSettingsService.getApiSourceCalledFrom();

    // Let AppComponent know about the change so it can display the correct api source and additional info
    this._appComponent.apiSource = apiSource;
    this._appComponent.apiSourceTitle = apiSourceTitle;
    this._appComponent.apiSourceCalledFrom = this.apiSourceCalledFrom;

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
          this.t_SettingsComponent_PreferredDataSource = this._translationsService.t_SettingsComponent_PreferredDataSource;
          this.t_SettingsComponent_ItemsPerPage = this._translationsService.t_SettingsComponent_ItemsPerPage;
          this.t_SettingsComponent_PagesPerPageset = this._translationsService.t_SettingsComponent_PagesPerPageset;
          this.t_SettingsComponent_SaveAlert = this._translationsService.t_SettingsComponent_SaveAlert;
          this.t_SettingsComponent_Save = this._translationsService.t_SettingsComponent_Save;
          this.t_SettingsComponent_Choose = this._translationsService.t_SettingsComponent_Choose;
          this.t_SettingsComponent_From = this._translationsService.t_SettingsComponent_From;
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
            this._appComponent.t_AppComponent_DataSource = this._translationsService.t_AppComponent_DataSource;
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
      this.t_SettingsComponent_PreferredDataSource = this._translationsService.t_SettingsComponent_PreferredDataSource;
      this.t_SettingsComponent_ItemsPerPage = this._translationsService.t_SettingsComponent_ItemsPerPage;
      this.t_SettingsComponent_PagesPerPageset = this._translationsService.t_SettingsComponent_PagesPerPageset;
      this.t_SettingsComponent_SaveAlert = this._translationsService.t_SettingsComponent_SaveAlert;
      this.t_SettingsComponent_Save = this._translationsService.t_SettingsComponent_Save;
      this.t_SettingsComponent_Choose = this._translationsService.t_SettingsComponent_Choose;
      this.t_SettingsComponent_From = this._translationsService.t_SettingsComponent_From;
    }

  }

}
