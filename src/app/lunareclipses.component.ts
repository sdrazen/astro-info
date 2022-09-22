import { Component, OnInit } from '@angular/core';
import { BackendService } from './shared/backend.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IDataLunarEclipseListModel } from './shared/data.lunareclipselist.model';
import { ISearchCriteriaLunarEclipsesModel } from './shared/searchcriterialunareclipses.model'
import { IUserSettingsModel } from './shared/user.settings.model';

@Component({
  selector: 'app-lunareclipses',
  templateUrl: './lunareclipses.component.html',
  styleUrls: ['./lunareclipses.component.css']
})

export class LunarEclipsesComponent implements OnInit {

  isLoggedIn: boolean;
  lunarEclipses: IDataLunarEclipseListModel[];
  selectedLunarEclipse: IDataLunarEclipseListModel;
  pageIndex: number = 1;
  pageSet: number = 1;
  countOfLunarEclipses: number = 0;
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
  searchCriteria: ISearchCriteriaLunarEclipsesModel =
    {
      searchText: "",
      useAdditionalCriteria: false
    }
  useCriteria: boolean = false;

  // Variables for translations
  t_LunarEclipsesComponent_PanelTitle: string = "Lunar eclipses 2001 - 2100";
  t_LunarEclipsesComponent_Filter: string = "Filter";
  t_LunarEclipsesComponent_Search: string = "Search";
  t_LunarEclipsesComponent_Date: string = "Date";
  t_LunarEclipsesComponent_GreatestEclipseTd: string = "Time";
  t_LunarEclipsesComponent_Deltat: string = "Delta t";
  t_LunarEclipsesComponent_EclipseType: string = "Type";
  t_LunarEclipsesComponent_DurationPen: string = "Dur. pen.";
  t_LunarEclipsesComponent_DurationPar: string = "Dur. par.";
  t_LunarEclipsesComponent_DurationTotal: string = "Dur. tot.";
  t_LunarEclipsesComponent_Latitude: string = "Lat.";
  t_LunarEclipsesComponent_Longitude: string = "Lon.";
  t_LunarEclipsesComponent_TypeFilterText: "Type filter text...";
  t_LunarEclipsesComponent_TypeSearchText: "Type search text...";
  t_LunarEclipsesComponent_DisplayingEclipses: string = "Displaying eclipses";
  t_LunarEclipsesComponent_DisplayingEclipsesOf: string = "of";
  t_LunarEclipsesComponent_Loading: string = "Loading data...";

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
    this.lunarEclipses = [];
    this._backendService.getAllLunarEclipses()
      .then(() => {
        this.showSpinner = false;
        this.showMain = true;
        this._backendService.filteredLunarEclipses = [];
        this._backendService.isInitialGetLunarEclipses = true;
        this.countOfLunarEclipses = this._backendService.allLunarEclipses.length;
        this._backendService.getLunarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allLunarEclipses, this._backendService.filteredLunarEclipses)
          .then(value => this.lunarEclipses = value);
      })
      .catch(error => console.log(error));

    // Translations
    this.translate();

  }

  onLunarEclipseSelect(lunarEclipse: IDataLunarEclipseListModel) {
    this.selectedLunarEclipse = lunarEclipse;
    this.showMain = false;
  }

  onFirstClick() {
    this.pageSet = 1;
    this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
    this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
    this._backendService.getLunarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allLunarEclipses, this._backendService.filteredLunarEclipses).then(value => this.lunarEclipses = value);
  }

  onPreviousClick() {
    if (this.pageSet > 1) {
      this.pageSet--;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._backendService.getLunarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allLunarEclipses, this._backendService.filteredLunarEclipses).then(value => this.lunarEclipses = value);
    }
  }

  onPageClick(currentPageOnPageset: number) {
    if (this.pageSet > 0) {
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + currentPageOnPageset;
      this._backendService.getLunarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allLunarEclipses, this._backendService.filteredLunarEclipses).then(value => this.lunarEclipses = value);
    }
  }

  onNextClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfLunarEclipses / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfLunarEclipses % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    if (this.pageSet < result) {
      this.pageSet++;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._backendService.getLunarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allLunarEclipses, this._backendService.filteredLunarEclipses).then(value => this.lunarEclipses = value);
    }
  }

  onLastClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfLunarEclipses / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfLunarEclipses % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    this.pageSet = result;
    if (this.pageSet > 0) {
      this.pageIndex = countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement;
      this.pages = this.getArrayOfNumbers(this.pageSet * this.pagesPerPageset - this.pagesPerPageset + 1, this.pageSet * this.pagesPerPageset);
      this._backendService.getLunarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allLunarEclipses, this._backendService.filteredLunarEclipses).then(value => this.lunarEclipses = value);
    }
  }

  onSearchClick(searchText: string) {

    let searchCriteria: ISearchCriteriaLunarEclipsesModel =
    {
      searchText: "",
      useAdditionalCriteria: false
    }

    searchCriteria.searchText = this.searchText;
    searchCriteria.useAdditionalCriteria = this.useCriteria;

    this._backendService.getLunarEclipsesBySearchCriteria(searchCriteria, this.itemsPerPage, this._backendService.allLunarEclipses)
      .then(value => {
        this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);
        this.pageIndex = 1;
        this.pageSet = 1;
        this.lunarEclipses = [];
        this.countOfLunarEclipses = this._backendService.filteredLunarEclipses.length;
        this._backendService.getLunarEclipses(this.pageIndex, this.itemsPerPage, this._backendService.allLunarEclipses, this._backendService.filteredLunarEclipses)
          .then(value => this.lunarEclipses = value);
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
          this.t_LunarEclipsesComponent_PanelTitle = this._translationsService.t_LunarEclipsesComponent_PanelTitle;
          this.t_LunarEclipsesComponent_Filter = this._translationsService.t_LunarEclipsesComponent_Filter;
          this.t_LunarEclipsesComponent_Search = this._translationsService.t_LunarEclipsesComponent_Search;
          this.t_LunarEclipsesComponent_Date = this._translationsService.t_LunarEclipsesComponent_Date;
          this.t_LunarEclipsesComponent_GreatestEclipseTd = this._translationsService.t_LunarEclipsesComponent_GreatestEclipseTd;
          this.t_LunarEclipsesComponent_Deltat = this._translationsService.t_LunarEclipsesComponent_Deltat;
          this.t_LunarEclipsesComponent_EclipseType = this._translationsService.t_LunarEclipsesComponent_EclipseType;
          this.t_LunarEclipsesComponent_DurationPen = this._translationsService.t_LunarEclipsesComponent_DurationPen;
          this.t_LunarEclipsesComponent_DurationPar = this._translationsService.t_LunarEclipsesComponent_DurationPar;
          this.t_LunarEclipsesComponent_DurationTotal = this._translationsService.t_LunarEclipsesComponent_DurationTotal;
          this.t_LunarEclipsesComponent_Latitude = this._translationsService.t_LunarEclipsesComponent_Latitude;
          this.t_LunarEclipsesComponent_Longitude = this._translationsService.t_LunarEclipsesComponent_Longitude;
          this.t_LunarEclipsesComponent_TypeFilterText = this._translationsService.t_LunarEclipsesComponent_TypeFilterText;
          this.t_LunarEclipsesComponent_TypeSearchText = this._translationsService.t_LunarEclipsesComponent_TypeSearchText;
          this.t_LunarEclipsesComponent_DisplayingEclipses = this._translationsService.t_LunarEclipsesComponent_DisplayingEclipses;
          this.t_LunarEclipsesComponent_DisplayingEclipsesOf = this._translationsService.t_LunarEclipsesComponent_DisplayingEclipsesOf;
          this.t_LunarEclipsesComponent_Loading = this._translationsService.t_LunarEclipsesComponent_Loading;
        });
    } else {
      this.t_LunarEclipsesComponent_PanelTitle = this._translationsService.t_LunarEclipsesComponent_PanelTitle;
      this.t_LunarEclipsesComponent_Filter = this._translationsService.t_LunarEclipsesComponent_Filter;
      this.t_LunarEclipsesComponent_Search = this._translationsService.t_LunarEclipsesComponent_Search;
      this.t_LunarEclipsesComponent_Date = this._translationsService.t_LunarEclipsesComponent_Date;
      this.t_LunarEclipsesComponent_GreatestEclipseTd = this._translationsService.t_LunarEclipsesComponent_GreatestEclipseTd;
      this.t_LunarEclipsesComponent_Deltat = this._translationsService.t_LunarEclipsesComponent_Deltat;
      this.t_LunarEclipsesComponent_EclipseType = this._translationsService.t_LunarEclipsesComponent_EclipseType;
      this.t_LunarEclipsesComponent_DurationPen = this._translationsService.t_LunarEclipsesComponent_DurationPen;
      this.t_LunarEclipsesComponent_DurationPar = this._translationsService.t_LunarEclipsesComponent_DurationPar;
      this.t_LunarEclipsesComponent_DurationTotal = this._translationsService.t_LunarEclipsesComponent_DurationTotal;
      this.t_LunarEclipsesComponent_Latitude = this._translationsService.t_LunarEclipsesComponent_Latitude;
      this.t_LunarEclipsesComponent_Longitude = this._translationsService.t_LunarEclipsesComponent_Longitude;
      this.t_LunarEclipsesComponent_TypeFilterText = this._translationsService.t_LunarEclipsesComponent_TypeFilterText;
      this.t_LunarEclipsesComponent_TypeSearchText = this._translationsService.t_LunarEclipsesComponent_TypeSearchText;
      this.t_LunarEclipsesComponent_DisplayingEclipses = this._translationsService.t_LunarEclipsesComponent_DisplayingEclipses;
      this.t_LunarEclipsesComponent_DisplayingEclipsesOf = this._translationsService.t_LunarEclipsesComponent_DisplayingEclipsesOf;
      this.t_LunarEclipsesComponent_Loading = this._translationsService.t_LunarEclipsesComponent_Loading;
    }

  }

}
