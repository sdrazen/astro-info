import { Component, OnInit } from '@angular/core';
import { BackendService } from './shared/backend.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IDataSolarEclipseListModel } from './shared/data.solareclipselist.model';
import { ISearchCriteriaSolarEclipsesModel } from './shared/searchcriteriasolareclipses.model'
import { IUserSettingsModel } from './shared/user.settings.model';

@Component({
  selector: 'app-solareclipses',
  templateUrl: './solareclipses.component.html',
  styleUrls: ['./solareclipses.component.css']
})

export class SolarEclipsesComponent implements OnInit {

  isLoggedIn: boolean;
  solarEclipses: IDataSolarEclipseListModel[];
  selectedSolarEclipse: IDataSolarEclipseListModel;
  pageIndex: number = 1;
  pageSet: number = 1;
  countOfSolarEclipses: number = 0;
  searchText: string = '';
  pages: Array<number> = [];

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

  // Variable which will help determine which components to show and which of them not to show
  showSpinner: boolean = true;
  showMain: boolean = false;

  // Variables for additional search criteria
  searchCriteria: ISearchCriteriaSolarEclipsesModel =
    {
      searchText: "",
      useAdditionalCriteria: false
    }
  useCriteria: boolean = false;

  // Variables for translations
  t_SolarEclipsesComponent_PanelTitle: string = "Solar eclipses 2001 - 2100";
  t_SolarEclipsesComponent_Filter: string = "Filter";
  t_SolarEclipsesComponent_Search: string = "Search";
  t_SolarEclipsesComponent_Date: string = "Date";
  t_SolarEclipsesComponent_GreatestEclipseTd: string = "Time";
  t_SolarEclipsesComponent_Deltat: string = "Delta t";
  t_SolarEclipsesComponent_EclipseType: string = "Type";
  t_SolarEclipsesComponent_Latitude: string = "Lat.";
  t_SolarEclipsesComponent_Longitude: string = "Lon.";
  t_SolarEclipsesComponent_SunAltitude: string = "Sun alt.";
  t_SolarEclipsesComponent_PathWidth: string = "Path width";
  t_SolarEclipsesComponent_Duration: string = "Duration";
  t_SolarEclipsesComponent_TypeFilterText: "Type filter text...";
  t_SolarEclipsesComponent_TypeSearchText: "Type search text...";
  t_SolarEclipsesComponent_DisplayingEclipses: string = "Displaying eclipses";
  t_SolarEclipsesComponent_DisplayingEclipsesOf: string = "of";
  t_SolarEclipsesComponent_Loading: string = "Loading data...";

  constructor(private _backendService: BackendService, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // Use user settings from service
    this.lat = this._userSettingsService.lat;
    this.lng = this._userSettingsService.lng;
    this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
    this.languageId = this._userSettingsService.languageId;
    this.itemsPerPage = this._userSettingsService.itemsPerPage;
    this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

    // Calculate initial pages Array
    this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);

    // Get data from Data service
    this.solarEclipses = [];
    this._backendService.getAllSolarEclipses()
      .then(() => {
        this.showSpinner = false;
        this.showMain = true;
        this._backendService.filteredSolarEclipses = [];
        this._backendService.isInitialGetSolarEclipses = true;
        this.countOfSolarEclipses = this._backendService.allSolarEclipses.length;
        this._backendService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allSolarEclipses, this._backendService.filteredSolarEclipses)
          .then(value => this.solarEclipses = value);
      })
      .catch(error => console.log(error));

    // Translations
    this.translate();

  }

  onSolarEclipseSelect(solarEclipse: IDataSolarEclipseListModel) {
    this.selectedSolarEclipse = solarEclipse;
    this.showMain = false;
  }

  onFirstClick() {
    this.pageSet = 1;
    this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
    this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
    this._backendService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allSolarEclipses, this._backendService.filteredSolarEclipses).then(value => this.solarEclipses = value);
  }

  onPreviousClick() {
    if (this.pageSet > 1) {
      this.pageSet--;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._backendService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allSolarEclipses, this._backendService.filteredSolarEclipses).then(value => this.solarEclipses = value);
    }
  }

  onPageClick(currentPageOnPageset: number) {
    if (this.pageSet > 0) {
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + currentPageOnPageset;
      this._backendService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allSolarEclipses, this._backendService.filteredSolarEclipses).then(value => this.solarEclipses = value);
    }
  }

  onNextClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfSolarEclipses / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfSolarEclipses % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    if (this.pageSet < result) {
      this.pageSet++;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._backendService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allSolarEclipses, this._backendService.filteredSolarEclipses).then(value => this.solarEclipses = value);
    }
  }

  onLastClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfSolarEclipses / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfSolarEclipses % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    this.pageSet = result;
    if (this.pageSet > 0) {
      this.pageIndex = countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement;
      this.pages = this.getArrayOfNumbers(this.pageSet * this.pagesPerPageset - this.pagesPerPageset + 1, this.pageSet * this.pagesPerPageset);
      this._backendService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allSolarEclipses, this._backendService.filteredSolarEclipses).then(value => this.solarEclipses = value);
    }
  }

  onSearchClick(searchText: string) {

    let searchCriteria: ISearchCriteriaSolarEclipsesModel =
    {
      searchText: "",
      useAdditionalCriteria: false
    }

    searchCriteria.searchText = this.searchText;
    searchCriteria.useAdditionalCriteria = this.useCriteria;

    this._backendService.getSolarEclipsesBySearchCriteria(searchCriteria, this.itemsPerPage, this._backendService.allSolarEclipses)
      .then(value => {
        this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);
        this.pageIndex = 1;
        this.pageSet = 1;
        this.solarEclipses = [];
        this.countOfSolarEclipses = this._backendService.filteredSolarEclipses.length;
        this._backendService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allSolarEclipses, this._backendService.filteredSolarEclipses)
          .then(value => this.solarEclipses = value);
      });

  }

  getArrayOfNumbers(lowerBound: number, upperBound: number): Array<number> {
    let arr: Array<number> = [];
    for (let i = lowerBound; i <= upperBound; i++) {
      arr.push(i);
    }
    return arr;
  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          this.t_SolarEclipsesComponent_PanelTitle = this._translationsService.t_SolarEclipsesComponent_PanelTitle;
          this.t_SolarEclipsesComponent_Filter = this._translationsService.t_SolarEclipsesComponent_Filter;
          this.t_SolarEclipsesComponent_Search = this._translationsService.t_SolarEclipsesComponent_Search;
          this.t_SolarEclipsesComponent_Date = this._translationsService.t_SolarEclipsesComponent_Date;
          this.t_SolarEclipsesComponent_GreatestEclipseTd = this._translationsService.t_SolarEclipsesComponent_GreatestEclipseTd;
          this.t_SolarEclipsesComponent_Deltat = this._translationsService.t_SolarEclipsesComponent_Deltat;
          this.t_SolarEclipsesComponent_EclipseType = this._translationsService.t_SolarEclipsesComponent_EclipseType;
          this.t_SolarEclipsesComponent_Latitude = this._translationsService.t_SolarEclipsesComponent_Latitude;
          this.t_SolarEclipsesComponent_Longitude = this._translationsService.t_SolarEclipsesComponent_Longitude;
          this.t_SolarEclipsesComponent_SunAltitude = this._translationsService.t_SolarEclipsesComponent_SunAltitude;
          this.t_SolarEclipsesComponent_PathWidth = this._translationsService.t_SolarEclipsesComponent_PathWidth;
          this.t_SolarEclipsesComponent_Duration = this._translationsService.t_SolarEclipsesComponent_Duration;
          this.t_SolarEclipsesComponent_TypeFilterText = this._translationsService.t_SolarEclipsesComponent_TypeFilterText;
          this.t_SolarEclipsesComponent_TypeSearchText = this._translationsService.t_SolarEclipsesComponent_TypeSearchText;
          this.t_SolarEclipsesComponent_DisplayingEclipses = this._translationsService.t_SolarEclipsesComponent_DisplayingEclipses;
          this.t_SolarEclipsesComponent_DisplayingEclipsesOf = this._translationsService.t_SolarEclipsesComponent_DisplayingEclipsesOf;
          this.t_SolarEclipsesComponent_Loading = this._translationsService.t_SolarEclipsesComponent_Loading;
        });
    } else {
      this.t_SolarEclipsesComponent_PanelTitle = this._translationsService.t_SolarEclipsesComponent_PanelTitle;
      this.t_SolarEclipsesComponent_Filter = this._translationsService.t_SolarEclipsesComponent_Filter;
      this.t_SolarEclipsesComponent_Search = this._translationsService.t_SolarEclipsesComponent_Search;
      this.t_SolarEclipsesComponent_Date = this._translationsService.t_SolarEclipsesComponent_Date;
      this.t_SolarEclipsesComponent_GreatestEclipseTd = this._translationsService.t_SolarEclipsesComponent_GreatestEclipseTd;
      this.t_SolarEclipsesComponent_Deltat = this._translationsService.t_SolarEclipsesComponent_Deltat;
      this.t_SolarEclipsesComponent_EclipseType = this._translationsService.t_SolarEclipsesComponent_EclipseType;
      this.t_SolarEclipsesComponent_Latitude = this._translationsService.t_SolarEclipsesComponent_Latitude;
      this.t_SolarEclipsesComponent_Longitude = this._translationsService.t_SolarEclipsesComponent_Longitude;
      this.t_SolarEclipsesComponent_SunAltitude = this._translationsService.t_SolarEclipsesComponent_SunAltitude;
      this.t_SolarEclipsesComponent_PathWidth = this._translationsService.t_SolarEclipsesComponent_PathWidth;
      this.t_SolarEclipsesComponent_Duration = this._translationsService.t_SolarEclipsesComponent_Duration;
      this.t_SolarEclipsesComponent_TypeFilterText = this._translationsService.t_SolarEclipsesComponent_TypeFilterText;
      this.t_SolarEclipsesComponent_TypeSearchText = this._translationsService.t_SolarEclipsesComponent_TypeSearchText;
      this.t_SolarEclipsesComponent_DisplayingEclipses = this._translationsService.t_SolarEclipsesComponent_DisplayingEclipses;
      this.t_SolarEclipsesComponent_DisplayingEclipsesOf = this._translationsService.t_SolarEclipsesComponent_DisplayingEclipsesOf;
      this.t_SolarEclipsesComponent_Loading = this._translationsService.t_SolarEclipsesComponent_Loading;
    }

  }

}
