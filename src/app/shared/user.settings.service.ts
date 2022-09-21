import { Injectable } from '@angular/core';
import { Globals } from 'common/globals';
import { IUserSettingsModel } from '../shared/user.settings.model';

@Injectable()
export class UserSettingsService {

  // Variables for user settings
  lat: number = 0;
  lng: number = 0;
  timeZoneRawOffset: number = 0;
  languageId: number = 0;
  dataSource: number = 0;
  itemsPerPage: number = 0;
  pagesPerPageset: number = 0;
  userSettings: IUserSettingsModel = { lat: 0, lng: 0, timeZoneRawOffset: 0, languageId: 0, dataSource: 0, itemsPerPage: 0, pagesPerPageset: 0 };
  userSettingsDefined: boolean = false;
  userSettingsSetToVariables: boolean = false;

  // Variables for data source
  dataSourceList: Array<any> = [{ "datasource": 0, "datasourcetitle": "Firebase" }, { "datasource": 1, "datasourcetitle": "MongoDb" }];
  dataSourceTitle: string = "Firebase";
  dataSourceLocation: string = "";
  dataSourceCalledFrom: string = "";

  constructor() { }

  getUserSettings(): void {

    // Are user settings defined?
    if (localStorage.getItem('astro-info-usersettings') !== null && localStorage.getItem('astro-info-usersettings') !== undefined) {
      // Get user settings from localStorage if available
      this.userSettings = JSON.parse(localStorage.getItem('astro-info-usersettings'));
      this.lat = parseFloat((this.userSettings.lat).toString());
      this.lng = parseFloat((this.userSettings.lng).toString());
      this.timeZoneRawOffset = this.userSettings.timeZoneRawOffset == null ? 0 : parseInt((this.userSettings.timeZoneRawOffset).toString());
      this.languageId = parseInt((this.userSettings.languageId).toString());
      this.dataSource = parseInt((this.userSettings.dataSource).toString());
      this.itemsPerPage = parseInt((this.userSettings.itemsPerPage).toString());
      this.pagesPerPageset = parseInt((this.userSettings.pagesPerPageset).toString());
      this.userSettingsDefined = true;
      this.userSettingsSetToVariables = true;
    } else {
      // No user settings defined, set default values
      this.lat = 45.814440;
      this.lng = 15.977980;
      this.timeZoneRawOffset = 0;
      this.languageId = 0;
      this.dataSource = 0;
      this.itemsPerPage = 10;
      this.pagesPerPageset = 10;
      this.userSettingsDefined = false;
      this.userSettingsSetToVariables = true;
    }

    return;

  }

  setUserSettings(userSettings: IUserSettingsModel): void {

    // Set variables to new values
    this.lat = userSettings.lat;
    this.lng = userSettings.lng;
    this.timeZoneRawOffset = userSettings.timeZoneRawOffset;
    this.languageId = userSettings.languageId;
    this.dataSource = userSettings.dataSource;
    this.itemsPerPage = userSettings.itemsPerPage;
    this.pagesPerPageset = userSettings.pagesPerPageset;
    this.userSettings = userSettings;

    // Set user settings to localStorage
    localStorage.setItem('astro-info-usersettings', JSON.stringify(userSettings));

    // Set variable which tells that user settings are defined
    this.userSettingsDefined = true;

    // Set variable which tells that all user settings have been set to variables (real or default ones)
    this.userSettingsSetToVariables = true;

    return;

  }

  getDataSourceTitle(): string {

    // Get correct data source title
    let selectedDataSourceObj = this.dataSourceList.find(el => el.datasource == this.dataSource);
    this.dataSourceTitle = selectedDataSourceObj.datasourcetitle;

    return this.dataSourceTitle;

  }

  getDataSourceLocation(): string {

    // Get correct data source location for additional info in title
    let ret: string = "";

    if (Globals.DATA_SOURCE == 0) {
      // Firebase
      ret = `${Globals.FIREBASE_LOCATION}`;
    }

    if (Globals.DATA_SOURCE == 1) {
      // MongoDb
      ret = `${Globals.MONGODB_LOCATION}`;
    }

    this.dataSourceLocation = ret;

    return ret;

  }

  getDataSourceCalledFrom(): string {

    // Get correct data source location for additional info in title
    let ret: string = "";

    if (Globals.DATA_SOURCE == 0) {
      // Firebase
      ret = `${Globals.FIREBASE_CALLED_FROM}`;
    }

    if (Globals.DATA_SOURCE == 1) {
      // MongoDb
      ret = `${Globals.MONGODB_CALLED_FROM}`;
    }

    this.dataSourceCalledFrom = ret;

    return ret;

  }

}
