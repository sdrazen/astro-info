import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { FirebaseDataService } from './shared/firebase.data.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IDataSolarEclipseListModel } from './shared/data.solareclipselist.model';
import { ISearchCriteriaSolarEclipsesModel } from './shared/searchcriteriasolareclipses.model'
import { IUserSettingsModel } from './shared/user.settings.model';
import { Router } from '@angular/router';

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
  itemsPerPage: number = 0;
  pagesPerPageset: number = 0;
  userSettings: IUserSettingsModel = {lat: 0, lng: 0, timeZoneRawOffset: 0, languageId: 0, itemsPerPage: 0, pagesPerPageset: 0};

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
    t_SolarEclipsesComponent_PanelTitle: string =  "Solar eclipses 2001 - 2100";
    t_SolarEclipsesComponent_Filter: string =  "Filter";
    t_SolarEclipsesComponent_Search: string =  "Search";
    t_SolarEclipsesComponent_Date: string =  "Date";
    t_SolarEclipsesComponent_GreatestEclipseTd: string =  "Time";
    t_SolarEclipsesComponent_Deltat: string =  "Delta t";
    t_SolarEclipsesComponent_EclipseType: string =  "Type";
    t_SolarEclipsesComponent_Latitude: string =  "Lat.";
    t_SolarEclipsesComponent_Longitude: string =  "Lon.";
    t_SolarEclipsesComponent_SunAltitude: string =  "Sun alt.";
    t_SolarEclipsesComponent_PathWidth: string =  "Path width";
    t_SolarEclipsesComponent_Duration: string =  "Duration";
    t_SolarEclipsesComponent_TypeFilterText: "Type filter text...";
    t_SolarEclipsesComponent_TypeSearchText: "Type search text...";
    t_SolarEclipsesComponent_DisplayingEclipses: string =  "Displaying eclipses";
    t_SolarEclipsesComponent_DisplayingEclipsesOf: string =  "of";
    t_SolarEclipsesComponent_Loading: string = "Loading data...";

  constructor(private _firebaseAuthService: FirebaseAuthService, private _firebaseDataService: FirebaseDataService, private _router: Router, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {
  
      // var p = this._firebaseAuthService.listenForAuthStateChanges();

      // p.then(user => {
      //   this.isLoggedIn = true;

      //   // Use user settings from service
      //   this.lat = this._userSettingsService.lat;
      //   this.lng = this._userSettingsService.lng;
      //   this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
      //   this.languageId = this._userSettingsService.languageId;
      //   this.itemsPerPage = this._userSettingsService.itemsPerPage;
      //   this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

      //   // Calculate initial pages Array
      //   this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);

      //   // Get data from Data service
      //   this.solarEclipses = [];
      //   this._firebaseDataService.getAllSolarEclipses()
      //     .then(() => {
      //         this.showSpinner = false;
      //         this.showMain = true;
      //         this._firebaseDataService.filteredSolarEclipses = [];
      //         this._firebaseDataService.isInitialGetSolarEclipses = true;
      //         this.countOfSolarEclipses = this._firebaseDataService.allSolarEclipses.length;
      //         this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses)
      //           .then(value => this.solarEclipses = value);
      //       });

      //   // Translations
      //   this.translate();

      // })
      // .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

        this.isLoggedIn = true;

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
        this._firebaseDataService.getAllSolarEclipses()
          .then(() => {
              this.showSpinner = false;
              this.showMain = true;
              this._firebaseDataService.filteredSolarEclipses = [];
              this._firebaseDataService.isInitialGetSolarEclipses = true;
              this.countOfSolarEclipses = this._firebaseDataService.allSolarEclipses.length;
              this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses)
                .then(value => this.solarEclipses = value);
            });

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
      this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses).then(value => this.solarEclipses = value);
  }

  onPreviousClick() {
    if (this.pageSet > 1) {
      this.pageSet--;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses).then(value => this.solarEclipses = value);
    }
  }

  onPageClick(currentPageOnPageset: number) {
    if (this.pageSet > 0) {
        this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + currentPageOnPageset;
        this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses).then(value => this.solarEclipses = value);
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
      this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses).then(value => this.solarEclipses = value);
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
        this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses).then(value => this.solarEclipses = value);
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
    
      this._firebaseDataService.getSolarEclipsesBySearchCriteria(searchCriteria, this.itemsPerPage, this._firebaseDataService.allSolarEclipses)
          .then(value => {
              this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);
              this.pageIndex = 1;
              this.pageSet = 1;
              this.solarEclipses = [];
              this.countOfSolarEclipses = this._firebaseDataService.filteredSolarEclipses.length;
              this._firebaseDataService.getSolarEclipses(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allSolarEclipses, this._firebaseDataService.filteredSolarEclipses)
                .then(value => this.solarEclipses = value);
      });

  }

  getArrayOfNumbers(lowerBound: number, upperBound: number) : Array<number> {
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