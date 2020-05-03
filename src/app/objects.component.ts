import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { FirebaseDataService } from './shared/firebase.data.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IDataObjectListModel } from './shared/data.objectlist.model';
import { IUserSettingsModel } from './shared/user.settings.model';
import { ISearchCriteriaModel } from './shared/searchcriteria.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.css']
})

export class ObjectsComponent implements OnInit {

  isLoggedIn: boolean;
  objects: IDataObjectListModel[];
  selectedObject: IDataObjectListModel;
  panelTitle: string = "Choose object";
  pageIndex: number = 1;
  pageSet: number = 1;
  countOfObjects: number = 0;
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

  // Variables for calculator inside ObjectsComponent
  showCalculator: boolean = false;
  calculatorRa: string = "";
  calculatorDec: string = "";
  calculatorCatalogueEntry: string = "";
  calculatorFamiliarName: string = "";

  // Variables for details inside ObjectsComponent
  showDetails: boolean = false;

  // Variables for additional search criteria
  searchCriteria: ISearchCriteriaModel = 
    {
      searchText: "",
      useAdditionalCriteria: false,
      criteriaType: "",
      criteriaConstellation: "",
      criteriaMagnitudeMax: "",
      criteriaSizeMin: "",
      criteriaAltMin: "",
      criteriaAltMax: "",
      criteriaAzMin: "",
      criteriaAzMax: "",
      criteriaTimeUt: "",
      criteriaLat: 0,
      criteriaLng: 0
    }
  useCriteria: boolean = false;
  criteriaType: string = "";
  criteriaConstellation: string = "";
  criteriaMagnitudeMax: string = "";
  criteriaSizeMin: string = "";
  criteriaAltMin: string = "";
  criteriaAltMax: string = "";
  criteriaAzMin: string = "";
  criteriaAzMax: string = "";
  criteriaTimeUt: string = "";
  criteriaTimeUtYYYY: string = "";
  criteriaTimeUtMM: string = "";
  criteriaTimeUtDD: string = "";
  criteriaTimeUtHH: string = "";
  criteriaTimeUtMIN: string = "";
  criteriaLat: number = 0;
  criteriaLng: number = 0;
  objectTypes: Array<string> = [];
  constellations: Array<string> = [];

  // Variables for translations
    t_ObjectsComponent_PanelTitle: string =  "Objects list";
    t_ObjectsComponent_Filter: string =  "Filter";
    t_ObjectsComponent_Search: string =  "Search";
    t_ObjectsComponent_CatalogueEntry: string =  "Catalogue entry";
    t_ObjectsComponent_FamiliarName: string =  "Familiar name";
    t_ObjectsComponent_AlternativeEntries: string =  "Alternative entries";
    t_ObjectsComponent_Type: string =  "Type";
    t_ObjectsComponent_Constellation: string =  "Constellation";
    t_ObjectsComponent_RightAscension: string =  "Right ascension";
    t_ObjectsComponent_Declination: string =  "Declination";
    t_ObjectsComponent_Magnitude: string =  "Magnitude";
    t_ObjectsComponent_Size: string =  "Size";
    t_ObjectsComponent_SurfaceBrightness: string =  "Surface brightness";
    t_ObjectsComponent_DisplayingObjects: string =  "Displaying objects";
    t_ObjectsComponent_DisplayingObjectsOf: string =  "of";
    t_ObjectsComponent_Choose: string =  "Choose";
    t_ObjectsComponent_Loading: string =  "Loading data...";
    t_ObjectsComponent_AdditionalSearchCriteria: string = "Additional search criteria";
    t_ObjectsComponent_Magn: string = "Magn.";
    t_ObjectsComponent_SizeShortened: string = "Size";
    t_ObjectsComponent_AltitudeDegrees: string = "Altitude (degrees)";
    t_ObjectsComponent_AzimuthDegrees: string = "Azimuth (degrees)";
    t_ObjectsComponent_TimeUT: string = "UT (yyyy-mm-dd hh:mm)";
    t_ObjectsComponent_Latitude: string = "Latitude";
    t_ObjectsComponent_Longitude: string = "Longitude";
    t_ObjectsComponent_Use: string = "Use";
    t_ObjectsComponent_Ignore: string = "Ignore";
    t_ObjectsComponent_TypeFilterText: "Type filter text...";
    t_ObjectsComponent_TypeSearchText: "Type search text...";
    t_ObjectsComponent_UseAdditionalCriteria: string = "Use additional search criteria...";

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

      //   let now = new Date();
      //   let utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
      //   let dd = utc_now.getDate();
      //   let mm = utc_now.getMonth() + 1;
      //   let yyyy = utc_now.getFullYear();
      //   let hh = utc_now.getHours();
      //   let min = utc_now.getMinutes();

      //   // Use user settings from service
      //   this.criteriaLat = this._userSettingsService.lat;
      //   this.criteriaLng = this._userSettingsService.lng;
      //   this.criteriaTimeUt = yyyy.toString() + "-" + this.leadingZero(mm.toString()) + "-" + this.leadingZero(dd.toString()) + "T" + this.leadingZero(hh.toString()) + ":" + this.leadingZero(min.toString() + ":00");
      //   this.criteriaTimeUtYYYY = this.leadingZero(yyyy.toString());
      //   this.criteriaTimeUtMM = this.leadingZero(mm.toString());
      //   this.criteriaTimeUtDD = this.leadingZero(dd.toString());
      //   this.criteriaTimeUtHH = this.leadingZero(hh.toString());
      //   this.criteriaTimeUtMIN = this.leadingZero(min.toString());

      //   // Calculate initial pages Array
      //   this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);

      //   // Get data from Data service
      //   this.objects = [];
      //   this._firebaseDataService.getAllObjects("catalogueentry")
      //     .then(() => {
      //         this.showSpinner = false;
      //         this.showMain = true;
      //         this._firebaseDataService.filteredObjects = [];
      //         this._firebaseDataService.isInitialGet = true;
      //         this.countOfObjects = this._firebaseDataService.allObjects.length;
      //         this.objectTypes = this._firebaseDataService.allObjectTypes.sort();
      //         this.constellations = this._firebaseDataService.allConstellations.sort();
      //         this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects)
      //           .then(value => this.objects = value);
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

        let now = new Date();
        let utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        let dd = utc_now.getDate();
        let mm = utc_now.getMonth() + 1;
        let yyyy = utc_now.getFullYear();
        let hh = utc_now.getHours();
        let min = utc_now.getMinutes();

        // Use user settings from service
        this.criteriaLat = this._userSettingsService.lat;
        this.criteriaLng = this._userSettingsService.lng;
        this.criteriaTimeUt = yyyy.toString() + "-" + this.leadingZero(mm.toString()) + "-" + this.leadingZero(dd.toString()) + "T" + this.leadingZero(hh.toString()) + ":" + this.leadingZero(min.toString() + ":00");
        this.criteriaTimeUtYYYY = this.leadingZero(yyyy.toString());
        this.criteriaTimeUtMM = this.leadingZero(mm.toString());
        this.criteriaTimeUtDD = this.leadingZero(dd.toString());
        this.criteriaTimeUtHH = this.leadingZero(hh.toString());
        this.criteriaTimeUtMIN = this.leadingZero(min.toString());

        // Calculate initial pages Array
        this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);

        // Get data from Data service
        this.objects = [];
        this._firebaseDataService.getAllObjects("catalogueentry")
          .then(() => {
              this.showSpinner = false;
              this.showMain = true;
              this._firebaseDataService.filteredObjects = [];
              this._firebaseDataService.isInitialGet = true;
              this.countOfObjects = this._firebaseDataService.allObjects.length;
              this.objectTypes = this._firebaseDataService.allObjectTypes.sort();
              this.constellations = this._firebaseDataService.allConstellations.sort();
              this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects)
                .then(value => this.objects = value);
            });

        // Translations
        this.translate();

  }

  onObjectSelect(object: IDataObjectListModel) {
    this.selectedObject = object;
    this.showDetails = true;
    this.showCalculator = false;
    this.showMain = false;
  }

  onCalculatorClick(object: IDataObjectListModel) {
    this.calculatorRa = object.rightascension;
    this.calculatorDec = object.declination;
    this.calculatorCatalogueEntry = object.catalogueentry;
    this.calculatorFamiliarName = object.familiarname;
    this.showCalculator = true;
    this.showDetails = false;
    this.showMain = false;
  }

  backButtonCalcClicked() {
    this.calculatorRa = "";
    this.calculatorDec = "";
    this.showCalculator = false;
    this.showDetails = false;
    this.showMain = true;
  }

  backButtonDetailsClicked() {
    this.showDetails = false;
    this.showCalculator = false;
    this.showMain = true;
  }

  onFirstClick() {
      this.pageSet = 1;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects).then(value => this.objects = value);
  }

  onPreviousClick() {
    if (this.pageSet > 1) {
      this.pageSet--;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects).then(value => this.objects = value);
    }
  }

  onPageClick(currentPageOnPageset: number) {
    if (this.pageSet > 0) {
        this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + currentPageOnPageset;
        this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects).then(value => this.objects = value);
    }
  }

  onNextClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfObjects / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfObjects % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    if (this.pageSet < result) {
      this.pageSet++;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects).then(value => this.objects = value);
    }
  }

  onLastClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfObjects / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfObjects % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    this.pageSet = result;
    if (this.pageSet > 0) {
        this.pageIndex = countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement;
        this.pages = this.getArrayOfNumbers(this.pageSet * this.pagesPerPageset - this.pagesPerPageset + 1, this.pageSet * this.pagesPerPageset);
        this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects).then(value => this.objects = value);
    }
  }

  onSearchClick(searchText: string) {

    let searchCriteria: ISearchCriteriaModel = 
      {
        searchText: "",
        useAdditionalCriteria: false,
        criteriaType: "",
        criteriaConstellation: "",
        criteriaMagnitudeMax: "",
        criteriaSizeMin: "",
        criteriaAltMin: "",
        criteriaAltMax: "",
        criteriaAzMin: "",
        criteriaAzMax: "",
        criteriaTimeUt: "",
        criteriaLat: 0,
        criteriaLng: 0
      }

      searchCriteria.searchText = this.searchText;
      searchCriteria.useAdditionalCriteria = this.useCriteria;
      searchCriteria.criteriaType = this.criteriaType;
      searchCriteria.criteriaConstellation = this.criteriaConstellation;
      searchCriteria.criteriaMagnitudeMax = this.criteriaMagnitudeMax;
      searchCriteria.criteriaSizeMin = this.criteriaSizeMin;
      searchCriteria.criteriaAltMin = this.criteriaAltMin;
      searchCriteria.criteriaAltMax = this.criteriaAltMax;
      searchCriteria.criteriaAzMin = this.criteriaAzMin;
      searchCriteria.criteriaAzMax = this.criteriaAzMax;
      searchCriteria.criteriaTimeUt = this.criteriaTimeUt;
      searchCriteria.criteriaLat = this.criteriaLat;
      searchCriteria.criteriaLng = this.criteriaLng;
    
      this._firebaseDataService.getObjectsBySearchCriteria(searchCriteria, this.itemsPerPage, this._firebaseDataService.allObjects)
          .then(value => {
              this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);
              this.pageIndex = 1;
              this.pageSet = 1;
              this.objects = [];
              this.countOfObjects = this._firebaseDataService.filteredObjects.length;
              this._firebaseDataService.getObjects(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allObjects, this._firebaseDataService.filteredObjects)
                .then(value => this.objects = value);
      });

  }

  getArrayOfNumbers(lowerBound: number, upperBound: number) : Array<number> {
      let arr: Array<number> = [];
      for (let i = lowerBound; i <= upperBound; i++) {
        arr.push(i);
      }
      return arr;
  }

  toggleUseCriteria() {
    this.useCriteria = !this.useCriteria;
  }

  setObjectType(objectType: string) {
    this.criteriaType = objectType;
  }

  setConstellation(constellation: string) {
    this.criteriaConstellation = constellation;
  }

  yearMinus() {
      this.criteriaTimeUtYYYY = (parseInt(this.criteriaTimeUtYYYY) - 1).toString();
      this.calculateTimeUt();
  }

  yearPlus() {
      this.criteriaTimeUtYYYY = (parseInt(this.criteriaTimeUtYYYY) + 1).toString();
      this.calculateTimeUt();
  }

  monthMinus() {
      if (parseInt(this.criteriaTimeUtMM) > 1) {
            this.criteriaTimeUtMM = this.leadingZero((parseInt(this.criteriaTimeUtMM) - 1).toString());
            this.calculateTimeUt();
      }
  }

  monthPlus() {
      if (parseInt(this.criteriaTimeUtMM) < 12) {
            this.criteriaTimeUtMM = this.leadingZero((parseInt(this.criteriaTimeUtMM) + 1).toString());
            this.calculateTimeUt();
      }
  }

  dayMinus() {
      if (parseInt(this.criteriaTimeUtDD) > 1) {
            this.criteriaTimeUtDD = this.leadingZero((parseInt(this.criteriaTimeUtDD) - 1).toString());
            this.calculateTimeUt();
     }
  }

  dayPlus() {
      if (parseInt(this.criteriaTimeUtDD) < 31) {
            this.criteriaTimeUtDD = this.leadingZero((parseInt(this.criteriaTimeUtDD) + 1).toString());
            this.calculateTimeUt();
      }
  }

  hourMinus() {
      if (parseInt(this.criteriaTimeUtHH) > 1) {
            this.criteriaTimeUtHH = this.leadingZero((parseInt(this.criteriaTimeUtHH) - 1).toString());
            this.calculateTimeUt();
      }
  }

  hourPlus() {
      if (parseInt(this.criteriaTimeUtHH) < 23) {
            this.criteriaTimeUtHH = this.leadingZero((parseInt(this.criteriaTimeUtHH) + 1).toString());
            this.calculateTimeUt();
      }
  }

  minuteMinus() {
      if (parseInt(this.criteriaTimeUtMIN) > 1) {
            this.criteriaTimeUtMIN = this.leadingZero((parseInt(this.criteriaTimeUtMIN) - 1).toString());
            this.calculateTimeUt();
      }
  }

  minutePlus() {
      if (parseInt(this.criteriaTimeUtMIN) < 59) {
            this.criteriaTimeUtMIN = this.leadingZero((parseInt(this.criteriaTimeUtMIN) + 1).toString());
            this.calculateTimeUt();
      }
  }

  calculateTimeUt() {
      this.criteriaTimeUt = this.criteriaTimeUtYYYY + "-" + this.leadingZero(parseInt(this.criteriaTimeUtMM.toString()).toString()) + "-" + this.leadingZero(parseInt(this.criteriaTimeUtDD.toString()).toString()) + "T" + this.leadingZero(parseInt(this.criteriaTimeUtHH.toString()).toString()) + ":" + this.leadingZero(parseInt(this.criteriaTimeUtMIN.toString()).toString() + ":00");
  }

  leadingZero(value: string): string {
      return parseInt(value) < 10 ? "0" + value : value
  }

  replaceDotInCriteriaLat() {
    this.criteriaLat = parseFloat(this.criteriaLat.toString().replace(",", "."));
  }

  replaceDotInCriteriaLng() {
    this.criteriaLng = parseFloat(this.criteriaLng.toString().replace(",", "."));
  }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                    this.t_ObjectsComponent_PanelTitle = this._translationsService.t_ObjectsComponent_PanelTitle;
                    this.t_ObjectsComponent_Filter = this._translationsService.t_ObjectsComponent_Filter;
                    this.t_ObjectsComponent_Search = this._translationsService.t_ObjectsComponent_Search;
                    this.t_ObjectsComponent_CatalogueEntry = this._translationsService.t_ObjectsComponent_CatalogueEntry;
                    this.t_ObjectsComponent_FamiliarName = this._translationsService.t_ObjectsComponent_FamiliarName;
                    this.t_ObjectsComponent_AlternativeEntries = this._translationsService.t_ObjectsComponent_AlternativeEntries;
                    this.t_ObjectsComponent_Type = this._translationsService.t_ObjectsComponent_Type;
                    this.t_ObjectsComponent_Constellation = this._translationsService.t_ObjectsComponent_Constellation;
                    this.t_ObjectsComponent_RightAscension = this._translationsService.t_ObjectsComponent_RightAscension;
                    this.t_ObjectsComponent_Declination = this._translationsService.t_ObjectsComponent_Declination;
                    this.t_ObjectsComponent_Magnitude = this._translationsService.t_ObjectsComponent_Magnitude;
                    this.t_ObjectsComponent_Size = this._translationsService.t_ObjectsComponent_Size;
                    this.t_ObjectsComponent_SurfaceBrightness = this._translationsService.t_ObjectsComponent_SurfaceBrightness;
                    this.t_ObjectsComponent_DisplayingObjects = this._translationsService.t_ObjectsComponent_DisplayingObjects;
                    this.t_ObjectsComponent_DisplayingObjectsOf = this._translationsService.t_ObjectsComponent_DisplayingObjectsOf;
                    this.t_ObjectsComponent_Choose = this._translationsService.t_ObjectsComponent_Choose;
                    this.t_ObjectsComponent_Loading = this._translationsService.t_ObjectsComponent_Loading;
                    this.t_ObjectsComponent_AdditionalSearchCriteria = this._translationsService.t_ObjectsComponent_AdditionalSearchCriteria;
                    this.t_ObjectsComponent_Magn = this._translationsService.t_ObjectsComponent_Magn;
                    this.t_ObjectsComponent_SizeShortened = this._translationsService.t_ObjectsComponent_SizeShortened;
                    this.t_ObjectsComponent_AltitudeDegrees = this._translationsService.t_ObjectsComponent_AltitudeDegrees;
                    this.t_ObjectsComponent_AzimuthDegrees = this._translationsService.t_ObjectsComponent_AzimuthDegrees;
                    this.t_ObjectsComponent_TimeUT = this._translationsService.t_ObjectsComponent_TimeUT;
                    this.t_ObjectsComponent_Latitude = this._translationsService.t_ObjectsComponent_Latitude;
                    this.t_ObjectsComponent_Longitude = this._translationsService.t_ObjectsComponent_Longitude;
                    this.t_ObjectsComponent_Use = this._translationsService.t_ObjectsComponent_Use;
                    this.t_ObjectsComponent_Ignore = this._translationsService.t_ObjectsComponent_Ignore;
                    this.t_ObjectsComponent_TypeFilterText = this._translationsService.t_ObjectsComponent_TypeFilterText;
                    this.t_ObjectsComponent_TypeSearchText = this._translationsService.t_ObjectsComponent_TypeSearchText;
                    this.t_ObjectsComponent_UseAdditionalCriteria = this._translationsService.t_ObjectsComponent_UseAdditionalCriteria;
              });
      } else {
                    this.t_ObjectsComponent_PanelTitle = this._translationsService.t_ObjectsComponent_PanelTitle;
                    this.t_ObjectsComponent_Filter = this._translationsService.t_ObjectsComponent_Filter;
                    this.t_ObjectsComponent_Search = this._translationsService.t_ObjectsComponent_Search;
                    this.t_ObjectsComponent_CatalogueEntry = this._translationsService.t_ObjectsComponent_CatalogueEntry;
                    this.t_ObjectsComponent_FamiliarName = this._translationsService.t_ObjectsComponent_FamiliarName;
                    this.t_ObjectsComponent_AlternativeEntries = this._translationsService.t_ObjectsComponent_AlternativeEntries;
                    this.t_ObjectsComponent_Type = this._translationsService.t_ObjectsComponent_Type;
                    this.t_ObjectsComponent_Constellation = this._translationsService.t_ObjectsComponent_Constellation;
                    this.t_ObjectsComponent_RightAscension = this._translationsService.t_ObjectsComponent_RightAscension;
                    this.t_ObjectsComponent_Declination = this._translationsService.t_ObjectsComponent_Declination;
                    this.t_ObjectsComponent_Magnitude = this._translationsService.t_ObjectsComponent_Magnitude;
                    this.t_ObjectsComponent_Size = this._translationsService.t_ObjectsComponent_Size;
                    this.t_ObjectsComponent_SurfaceBrightness = this._translationsService.t_ObjectsComponent_SurfaceBrightness;
                    this.t_ObjectsComponent_DisplayingObjects = this._translationsService.t_ObjectsComponent_DisplayingObjects;
                    this.t_ObjectsComponent_DisplayingObjectsOf = this._translationsService.t_ObjectsComponent_DisplayingObjectsOf;
                    this.t_ObjectsComponent_Choose = this._translationsService.t_ObjectsComponent_Choose;
                    this.t_ObjectsComponent_Loading = this._translationsService.t_ObjectsComponent_Loading;
                    this.t_ObjectsComponent_AdditionalSearchCriteria = this._translationsService.t_ObjectsComponent_AdditionalSearchCriteria;
                    this.t_ObjectsComponent_Magn = this._translationsService.t_ObjectsComponent_Magn;
                    this.t_ObjectsComponent_SizeShortened = this._translationsService.t_ObjectsComponent_SizeShortened;
                    this.t_ObjectsComponent_AltitudeDegrees = this._translationsService.t_ObjectsComponent_AltitudeDegrees;
                    this.t_ObjectsComponent_AzimuthDegrees = this._translationsService.t_ObjectsComponent_AzimuthDegrees;
                    this.t_ObjectsComponent_TimeUT = this._translationsService.t_ObjectsComponent_TimeUT;
                    this.t_ObjectsComponent_Latitude = this._translationsService.t_ObjectsComponent_Latitude;
                    this.t_ObjectsComponent_Longitude = this._translationsService.t_ObjectsComponent_Longitude;
                    this.t_ObjectsComponent_Use = this._translationsService.t_ObjectsComponent_Use;
                    this.t_ObjectsComponent_Ignore = this._translationsService.t_ObjectsComponent_Ignore;
                    this.t_ObjectsComponent_TypeFilterText = this._translationsService.t_ObjectsComponent_TypeFilterText;
                    this.t_ObjectsComponent_TypeSearchText = this._translationsService.t_ObjectsComponent_TypeSearchText;
                    this.t_ObjectsComponent_UseAdditionalCriteria = this._translationsService.t_ObjectsComponent_UseAdditionalCriteria;
      }

  }

}
