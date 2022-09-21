import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { Globals } from 'common/globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Variables for translations
  languageId: number = 0;
  t_AppComponent_Home: string = "Home";
  t_AppComponent_Objects: string = "Objects";
  t_AppComponent_Data: string = "Data";
  t_AppComponent_DeepSky: string = "Deep-sky";
  t_AppComponent_Calculator: string = "Calculator";
  t_AppComponent_Apod: string = "APOD";
  t_AppComponent_Neo: string = "NEO";
  t_AppComponent_SolarEclipses: string = "Solar eclipses";
  t_AppComponent_LunarEclipses: string = "Lunar eclipses";
  t_AppComponent_SunAndMoon: string = "Sun & Moon";
  t_AppComponent_Iss: string = "ISS";
  t_AppComponent_Moonfeatures: string = "Moon";
  t_AppComponent_Stores: string = "Stores";
  t_AppComponent_Locations: string = "Locations";
  t_AppComponent_Weather: string = "Weather";
  t_AppComponent_Settings: string = "Settings";
  t_AppComponent_About: string = "About";
  t_AppComponent_Others: string = "Others";
  t_AppComponent_Logout: string = "Logout";
  t_AppComponent_DataSource: string = "Data source";

  // Variables for data source
  dataSource: number = 0;
  dataSourceTitle: string = "";
  dataSourceLocation: string = "";
  dataSourceCalledFrom: string = "";

  constructor(private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // Go to user settings service and run this method which will initialize all data needed
    // There is no need to do this call in other components as all variables are set
    // by the service and the only component where those variable could be changed is
    // the UserSettingsComponent and at that point we will set all variables again...
    // So, in other components we can just use variables from service as "global" variables
    // And here we have to call this method only once, there is no point to call it
    // every time user returns to welcome page...
    if (this._userSettingsService.userSettingsSetToVariables === false) {
      this._userSettingsService.getUserSettings();
    }

    // Use user settings from service
    this.languageId = this._userSettingsService.languageId;

    // Translations
    this.translate();

    // Data source
    this.dataSource = this._userSettingsService.dataSource;

    // Set global variable
    Globals.DATA_SOURCE = this.dataSource;

    // Get additional data (titles) about the data source
    this.dataSourceTitle = this._userSettingsService.getDataSourceTitle();
    this.dataSourceLocation = this._userSettingsService.getDataSourceLocation();
    this.dataSourceCalledFrom = this._userSettingsService.getDataSourceCalledFrom();

  }

  onLogOff() {
    // if (this._firebaseAuthService.isLoggedIn == true) {
    //   this._firebaseAuthService.userSignOut();
    //   // this._router.navigate (['/']);
    // }
  }

  isUserLoggedIn(): boolean {
    // return this._firebaseAuthService.isLoggedIn;
    return true;
  }

  translate() {
    this._translationsService.setTranslationsForLanguage(this.languageId)
      .then(() => {
        this.t_AppComponent_Home = this._translationsService.t_AppComponent_Home;
        this.t_AppComponent_Objects = this._translationsService.t_AppComponent_Objects;
        this.t_AppComponent_Data = this._translationsService.t_AppComponent_Data;
        this.t_AppComponent_DeepSky = this._translationsService.t_AppComponent_DeepSky;
        this.t_AppComponent_Calculator = this._translationsService.t_AppComponent_Calculator;
        this.t_AppComponent_Apod = this._translationsService.t_AppComponent_Apod;
        this.t_AppComponent_Neo = this._translationsService.t_AppComponent_Neo;
        this.t_AppComponent_SolarEclipses = this._translationsService.t_AppComponent_SolarEclipses;
        this.t_AppComponent_LunarEclipses = this._translationsService.t_AppComponent_LunarEclipses;
        this.t_AppComponent_SunAndMoon = this._translationsService.t_AppComponent_SunAndMoon;
        this.t_AppComponent_Iss = this._translationsService.t_AppComponent_Iss;
        this.t_AppComponent_Weather = this._translationsService.t_AppComponent_Weather;
        this.t_AppComponent_Moonfeatures = this._translationsService.t_AppComponent_Moonfeatures;
        this.t_AppComponent_Stores = this._translationsService.t_AppComponent_Stores;
        this.t_AppComponent_Locations = this._translationsService.t_AppComponent_Locations;
        this.t_AppComponent_Settings = this._translationsService.t_AppComponent_Settings;
        this.t_AppComponent_About = this._translationsService.t_AppComponent_About;
        this.t_AppComponent_Others = this._translationsService.t_AppComponent_Others;
        this.t_AppComponent_Logout = this._translationsService.t_AppComponent_Logout;
        this.t_AppComponent_DataSource = this._translationsService.t_AppComponent_DataSource;
      });
  }

}
