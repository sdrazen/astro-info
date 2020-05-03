import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { FirebaseDataService } from './shared/firebase.data.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IDataMoonfeatureListModel } from './shared/data.moonfeaturelist.model';
import { IUserSettingsModel } from './shared/user.settings.model';
import { ISearchCriteriaMoonfeaturesModel } from './shared/searchcriteriamoonfeatures.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-moonfeatures',
  templateUrl: './moonfeatures.component.html',
  styleUrls: ['./moonfeatures.component.css']
})

export class MoonfeaturesComponent implements OnInit {

  isLoggedIn: boolean;
  moonfeatures: IDataMoonfeatureListModel[];
  selectedMoonfeature: IDataMoonfeatureListModel;
  pageIndex: number = 1;
  pageSet: number = 1;
  countOfMoonfeatures: number = 0;
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

  // Variables for details inside MoonfeaturesComponent
  showDetails: boolean = false;

  // Variables for additional search criteria
  searchCriteria: ISearchCriteriaMoonfeaturesModel = 
    {
      searchText: "",
      useAdditionalCriteria: false,
      criteriaDiameterMin: "",
      criteriaDiameterMax: "",
      criteriaApprovalStatusText: "",
      criteriaFeatureTypeText: ""
    }
  useCriteria: boolean = false;
  criteriaDiameterMin: string = "";
  criteriaDiameterMax: string = "";
  criteriaApprovalStatusText: string = "";
  criteriaFeatureTypeText: string = "";
  moonfeatureTypes: Array<string> = [];
  moonfeatureApprovalStatusTexts: Array<string> = [];

  // Variables for translations
    t_MoonfeaturesComponent_PanelTitle: string =  "Moon's features list";
    t_MoonfeaturesComponent_Filter: string =  "Filter";
    t_MoonfeaturesComponent_Search: string =  "Search";
    t_MoonfeaturesComponent_Name: string =  "Name";
    t_MoonfeaturesComponent_Diameter: string =  "Diameter (km)";
    t_MoonfeaturesComponent_CenterLatitude: string =  "Center latitude";
    t_MoonfeaturesComponent_CenterLongitude: string =  "Center longitude";
    t_MoonfeaturesComponent_Continent: string =  "Continent";
    t_MoonfeaturesComponent_Ethnicity: string =  "Ethnicity";
    t_MoonfeaturesComponent_ApprovalStatus: string =  "Approval status";
    t_MoonfeaturesComponent_ApprovalDate: string =  "Approval date";
    t_MoonfeaturesComponent_FeatureType: string =  "Feature type";
    t_MoonfeaturesComponent_Origin: string =  "Origin";
    t_MoonfeaturesComponent_LastUpdated: string =  "Last updated";
    t_MoonfeaturesComponent_DisplayingFeatures: string =  "Displaying features";
    t_MoonfeaturesComponent_DisplayingFeaturesOf: string =  "of";
    t_MoonfeaturesComponent_Choose: string =  "Choose";
    t_MoonfeaturesComponent_Loading: string =  "Loading data...";
    t_MoonfeaturesComponent_AdditionalSearchCriteria: string = "Additional search criteria";
    t_MoonfeaturesComponent_Use: string = "Use";
    t_MoonfeaturesComponent_Ignore: string = "Ignore";
    t_MoonfeaturesComponent_TypeFilterText: "Type filter text...";
    t_MoonfeaturesComponent_TypeSearchText: "Type search text...";
    t_MoonfeaturesComponent_UseAdditionalCriteria: string = "Use additional search criteria...";

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
      //   this.moonfeatures = [];
      //   this._firebaseDataService.getAllMoonfeatures("name")
      //     .then(() => {
      //         this.showSpinner = false;
      //         this.showMain = true;
      //         this._firebaseDataService.filteredMoonfeatures = [];
      //         this._firebaseDataService.isInitialGetMoonfeatures = true;
      //         this.countOfMoonfeatures = this._firebaseDataService.allMoonfeatures.length;
      //         this.moonfeatureTypes = this._firebaseDataService.allMoonfeatureTypes.sort();
      //         this.moonfeatureApprovalStatusTexts = this._firebaseDataService.allMoonfeatureApprovalStatusTexts.sort();
      //         this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures)
      //           .then(value => this.moonfeatures = value);
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
        this.moonfeatures = [];
        this._firebaseDataService.getAllMoonfeatures("name")
          .then(() => {
              this.showSpinner = false;
              this.showMain = true;
              this._firebaseDataService.filteredMoonfeatures = [];
              this._firebaseDataService.isInitialGetMoonfeatures = true;
              this.countOfMoonfeatures = this._firebaseDataService.allMoonfeatures.length;
              this.moonfeatureTypes = this._firebaseDataService.allMoonfeatureTypes.sort();
              this.moonfeatureApprovalStatusTexts = this._firebaseDataService.allMoonfeatureApprovalStatusTexts.sort();
              this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures)
                .then(value => this.moonfeatures = value);
            });

        // Translations
        this.translate();

  }

  onMoonfeatureSelect(moonFeature: IDataMoonfeatureListModel) {
    this.selectedMoonfeature = moonFeature;
    this.showDetails = true;
    this.showMain = false;
  }

  backButtonDetailsClicked() {
    this.showDetails = false;
    this.showMain = true;
  }

  onFirstClick() {
      this.pageSet = 1;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures).then(value => this.moonfeatures = value);
  }

  onPreviousClick() {
    if (this.pageSet > 1) {
      this.pageSet--;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures).then(value => this.moonfeatures = value);
    }
  }

  onPageClick(currentPageOnPageset: number) {
    if (this.pageSet > 0) {
        this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + currentPageOnPageset;
        this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures).then(value => this.moonfeatures = value);
    }
  }

  onNextClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfMoonfeatures / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfMoonfeatures % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    if (this.pageSet < result) {
      this.pageSet++;
      this.pageIndex = ((this.pageSet - 1) * this.pagesPerPageset) + 1;
      this.pages = this.getArrayOfNumbers(this.pageIndex, this.pageIndex + this.pagesPerPageset - 1);
      this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures).then(value => this.moonfeatures = value);
    }
  }

  onLastClick() {
    let countOfObjectDividedByItemsPerPage = Math.floor(this.countOfMoonfeatures / this.itemsPerPage);
    let countOfObjectDividedByItemsPerPageIncrement = (this.countOfMoonfeatures % this.itemsPerPage) > 0 ? 1 : 0;
    let resultDividedByPagesPerPageset = Math.floor((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) / this.pagesPerPageset);
    let resultDividedByPagesPerPagesetIncrement = ((countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement) % this.pagesPerPageset) > 0 ? 1 : 0;
    let result = resultDividedByPagesPerPageset + resultDividedByPagesPerPagesetIncrement;
    this.pageSet = result;
    if (this.pageSet > 0) {
        this.pageIndex = countOfObjectDividedByItemsPerPage + countOfObjectDividedByItemsPerPageIncrement;
        this.pages = this.getArrayOfNumbers(this.pageSet * this.pagesPerPageset - this.pagesPerPageset + 1, this.pageSet * this.pagesPerPageset);
        this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures).then(value => this.moonfeatures = value);
    }
  }

  onSearchClick(searchText: string) {

    let searchCriteria: ISearchCriteriaMoonfeaturesModel = 
      {
        searchText: "",
        useAdditionalCriteria: false,
        criteriaDiameterMin: "",
        criteriaDiameterMax: "",
        criteriaApprovalStatusText: "",
        criteriaFeatureTypeText: ""
      }

      searchCriteria.searchText = this.searchText;
      searchCriteria.useAdditionalCriteria = this.useCriteria;
      searchCriteria.criteriaDiameterMin = this.criteriaDiameterMin;
      searchCriteria.criteriaDiameterMax = this.criteriaDiameterMax;
      searchCriteria.criteriaApprovalStatusText = this.criteriaApprovalStatusText;
      searchCriteria.criteriaFeatureTypeText = this.criteriaFeatureTypeText;
    
      this._firebaseDataService.getMoonfeaturesBySearchCriteria(searchCriteria, this.itemsPerPage, this._firebaseDataService.allMoonfeatures)
          .then(value => {
              this.pages = this.getArrayOfNumbers(1, this.pagesPerPageset);
              this.pageIndex = 1;
              this.pageSet = 1;
              this.moonfeatures = [];
              this.countOfMoonfeatures = this._firebaseDataService.filteredMoonfeatures.length;
              this._firebaseDataService.getMoonfeatures(this.pageIndex, this.itemsPerPage, this._firebaseDataService.allMoonfeatures, this._firebaseDataService.filteredMoonfeatures)
                .then(value => this.moonfeatures = value);
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

  setMoonfeatureType(moonfeatureType: string) {
    this.criteriaFeatureTypeText = moonfeatureType;
  }

  setMoonfeatureApprovalStatusText(moonfeatureApprovalStatusText: string) {
    this.criteriaApprovalStatusText = moonfeatureApprovalStatusText;
  }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                    this.t_MoonfeaturesComponent_PanelTitle = this._translationsService.t_MoonfeaturesComponent_PanelTitle;
                    this.t_MoonfeaturesComponent_Filter = this._translationsService.t_MoonfeaturesComponent_Filter;
                    this.t_MoonfeaturesComponent_Search = this._translationsService.t_MoonfeaturesComponent_Search;
                    this.t_MoonfeaturesComponent_Name = this._translationsService.t_MoonfeaturesComponent_Name;
                    this.t_MoonfeaturesComponent_Diameter = this._translationsService.t_MoonfeaturesComponent_Diameter;
                    this.t_MoonfeaturesComponent_CenterLatitude = this._translationsService.t_MoonfeaturesComponent_CenterLatitude;
                    this.t_MoonfeaturesComponent_CenterLongitude = this._translationsService.t_MoonfeaturesComponent_CenterLongitude;
                    this.t_MoonfeaturesComponent_Continent = this._translationsService.t_MoonfeaturesComponent_Continent;
                    this.t_MoonfeaturesComponent_Ethnicity = this._translationsService.t_MoonfeaturesComponent_Ethnicity;
                    this.t_MoonfeaturesComponent_ApprovalStatus = this._translationsService.t_MoonfeaturesComponent_ApprovalStatus;
                    this.t_MoonfeaturesComponent_ApprovalDate = this._translationsService.t_MoonfeaturesComponent_ApprovalDate;
                    this.t_MoonfeaturesComponent_FeatureType = this._translationsService.t_MoonfeaturesComponent_FeatureType;
                    this.t_MoonfeaturesComponent_Origin = this._translationsService.t_MoonfeaturesComponent_Origin;
                    this.t_MoonfeaturesComponent_LastUpdated = this._translationsService.t_MoonfeaturesComponent_LastUpdated;
                    this.t_MoonfeaturesComponent_DisplayingFeatures = this._translationsService.t_MoonfeaturesComponent_DisplayingFeatures;
                    this.t_MoonfeaturesComponent_DisplayingFeaturesOf = this._translationsService.t_MoonfeaturesComponent_DisplayingFeaturesOf;
                    this.t_MoonfeaturesComponent_Choose = this._translationsService.t_MoonfeaturesComponent_Choose;
                    this.t_MoonfeaturesComponent_Loading = this._translationsService.t_MoonfeaturesComponent_Loading;
                    this.t_MoonfeaturesComponent_AdditionalSearchCriteria = this._translationsService.t_MoonfeaturesComponent_AdditionalSearchCriteria;
                    this.t_MoonfeaturesComponent_Use = this._translationsService.t_MoonfeaturesComponent_Use;
                    this.t_MoonfeaturesComponent_Ignore = this._translationsService.t_MoonfeaturesComponent_Ignore;
                    this.t_MoonfeaturesComponent_TypeFilterText = this._translationsService.t_MoonfeaturesComponent_TypeFilterText;
                    this.t_MoonfeaturesComponent_TypeSearchText = this._translationsService.t_MoonfeaturesComponent_TypeSearchText;
                    this.t_MoonfeaturesComponent_UseAdditionalCriteria = this._translationsService.t_MoonfeaturesComponent_UseAdditionalCriteria;
              });
      } else {
                    this.t_MoonfeaturesComponent_PanelTitle = this._translationsService.t_MoonfeaturesComponent_PanelTitle;
                    this.t_MoonfeaturesComponent_Filter = this._translationsService.t_MoonfeaturesComponent_Filter;
                    this.t_MoonfeaturesComponent_Search = this._translationsService.t_MoonfeaturesComponent_Search;
                    this.t_MoonfeaturesComponent_Name = this._translationsService.t_MoonfeaturesComponent_Name;
                    this.t_MoonfeaturesComponent_Diameter = this._translationsService.t_MoonfeaturesComponent_Diameter;
                    this.t_MoonfeaturesComponent_CenterLatitude = this._translationsService.t_MoonfeaturesComponent_CenterLatitude;
                    this.t_MoonfeaturesComponent_CenterLongitude = this._translationsService.t_MoonfeaturesComponent_CenterLongitude;
                    this.t_MoonfeaturesComponent_Continent = this._translationsService.t_MoonfeaturesComponent_Continent;
                    this.t_MoonfeaturesComponent_Ethnicity = this._translationsService.t_MoonfeaturesComponent_Ethnicity;
                    this.t_MoonfeaturesComponent_ApprovalStatus = this._translationsService.t_MoonfeaturesComponent_ApprovalStatus;
                    this.t_MoonfeaturesComponent_ApprovalDate = this._translationsService.t_MoonfeaturesComponent_ApprovalDate;
                    this.t_MoonfeaturesComponent_FeatureType = this._translationsService.t_MoonfeaturesComponent_FeatureType;
                    this.t_MoonfeaturesComponent_Origin = this._translationsService.t_MoonfeaturesComponent_Origin;
                    this.t_MoonfeaturesComponent_LastUpdated = this._translationsService.t_MoonfeaturesComponent_LastUpdated;
                    this.t_MoonfeaturesComponent_DisplayingFeatures = this._translationsService.t_MoonfeaturesComponent_DisplayingFeatures;
                    this.t_MoonfeaturesComponent_DisplayingFeaturesOf = this._translationsService.t_MoonfeaturesComponent_DisplayingFeaturesOf;
                    this.t_MoonfeaturesComponent_Choose = this._translationsService.t_MoonfeaturesComponent_Choose;
                    this.t_MoonfeaturesComponent_Loading = this._translationsService.t_MoonfeaturesComponent_Loading;
                    this.t_MoonfeaturesComponent_AdditionalSearchCriteria = this._translationsService.t_MoonfeaturesComponent_AdditionalSearchCriteria;
                    this.t_MoonfeaturesComponent_Use = this._translationsService.t_MoonfeaturesComponent_Use;
                    this.t_MoonfeaturesComponent_Ignore = this._translationsService.t_MoonfeaturesComponent_Ignore;
                    this.t_MoonfeaturesComponent_TypeFilterText = this._translationsService.t_MoonfeaturesComponent_TypeFilterText;
                    this.t_MoonfeaturesComponent_TypeSearchText = this._translationsService.t_MoonfeaturesComponent_TypeSearchText;
                    this.t_MoonfeaturesComponent_UseAdditionalCriteria = this._translationsService.t_MoonfeaturesComponent_UseAdditionalCriteria;
      }

  }

}
