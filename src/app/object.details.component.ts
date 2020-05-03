import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDataObjectListModel } from './shared/data.objectlist.model';
import { IObjectPositionModel } from './shared/object.position.model';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { FirebaseDataService } from './shared/firebase.data.service';
import { WikipediaService } from './shared/wikipedia.service'
import { FlickrService } from './shared/flickr.service'
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { CalculationsService } from './shared/calculations.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-object-details',
  templateUrl: './object.details.component.html',
  styleUrls: ['./object.details.component.css']
})

export class ObjectDetailsComponent implements OnInit {

  isLoggedIn: boolean;
  panelTitle: string = "Object details";
  wikipediaTermCatalogueEntry: string = '';
  wikipediaTermFamiliarName: string = '';
  wikipediaTermAlternativeEntries: string = '';
  wikipediaItems: Observable<Array<string>>;
  flickrTags: string = '';
  flickrItems: Observable<Array<any>>;

  // Variables for various error messages
  errorMessageFlickr: string = "";
  errorMessageWikipedia: string = "";

  @Input() selectedObject: IDataObjectListModel;
  @Output() public backButtonClicked = new EventEmitter();

  // Variables for charts
  lineChartType:string = 'line';
  lineChartLabels:Array<any> = [];

  lineChartData:Array<any> = [{data: [], label: ""}];
  lineChartOptions:any = {
    min: -90,
    max: 90
  };

  lineChartLabelsTemp:Array<any> = [];
  lineChartDataTemp:Array<any> = [{data: [], label: ""}];

  // Variables for translations
  t_ObjectDetailsComponent_PanelTitle: string =  "Object details";
  t_ObjectDetailsComponent_ObjectsCurrentPosition: string = "Object's current position on the sky at Your location";
  t_ObjectDetailsComponent_Altitude: string = "Altitude";
  t_ObjectDetailsComponent_Azimuth: string = "Azimuth";
  t_ObjectDetailsComponent_TimeUt: string = "Time (UT)";
  t_ObjectDetailsComponent_ObjectsNextPositions: string = "Object's next positions on the sky at Your location";
  t_ObjectDetailsComponent_Back: string = "Back";

  // CaclulationsService current position
  altAz: Array<number> = [];
  altDMS: Array<number> = [];
  azDMS: Array<number> = [];

  // CaclulationsService position in next 12 hours
  nextHoursPositions: Array<IObjectPositionModel>;

  constructor(private _firebaseAuthService: FirebaseAuthService,
              private _firebaseDataService: FirebaseDataService,
              private _router: Router,
              private _wikipediaService: WikipediaService,
              private _flickrService: FlickrService,
              private _userSettingsService: UserSettingsService,
              private _translationsService: TranslationsService,
              private _calculationsService: CalculationsService) { }

  ngOnInit() {

    //   var p = this._firebaseAuthService.listenForAuthStateChanges();

    //   p.then(user => {
    //     this.isLoggedIn = true;

    //         // Translations
    //         this.translate();

    //         // Update panel title, object current position title and object next positions title
    //         this.t_ObjectDetailsComponent_PanelTitle = this.t_ObjectDetailsComponent_PanelTitle + ((this.selectedObject.catalogueentry ? ": " + this.selectedObject.catalogueentry : (this.selectedObject.familiarname ? ": " + this.selectedObject.familiarname : "")));
    //         this.t_ObjectDetailsComponent_ObjectsCurrentPosition = ((this.selectedObject.catalogueentry ? this.selectedObject.catalogueentry + " - " : (this.selectedObject.familiarname ? this.selectedObject.familiarname + " - " : ""))) + this.t_ObjectDetailsComponent_ObjectsCurrentPosition
    //         this.t_ObjectDetailsComponent_ObjectsNextPositions = ((this.selectedObject.catalogueentry ? this.selectedObject.catalogueentry + " - " : (this.selectedObject.familiarname ? this.selectedObject.familiarname + " - " : ""))) + this.t_ObjectDetailsComponent_ObjectsNextPositions

    //         // Wikipedia term
    //         this.wikipediaTermCatalogueEntry = this.selectedObject.catalogueentry;
    //         this.wikipediaTermFamiliarName = this.selectedObject.familiarname;
    //         this.wikipediaTermAlternativeEntries = this.selectedObject.alternativeentries;

    //         // Wikipedia search
    //         let obsCatalogueEntry$ = this._wikipediaService.rawSearch(this.wikipediaTermCatalogueEntry);
    //         let obsFamiliarName$ = this._wikipediaService.rawSearch(this.wikipediaTermFamiliarName);
    //         let obsAlternativeEntries$ = this._wikipediaService.rawSearch(this.wikipediaTermAlternativeEntries);
    //         let combined$ = Observable.forkJoin(obsCatalogueEntry$, obsFamiliarName$, obsAlternativeEntries$);

    //         combined$.subscribe(
    //             (items) => {
    //                 this.wikipediaItems = (items[0] !== undefined ? items[0] : []);
    //                 this.wikipediaItems = (items[1] !== undefined ? this.wikipediaItems.concat(items[1]) : this.wikipediaItems);
    //                 this.wikipediaItems = (items[2] !== undefined ? this.wikipediaItems.concat(items[2]) : this.wikipediaItems);
    //             },
    //             (err) => this.errorMessageWikipedia = err
    //         )

    //         // Flickr tags
    //         this.flickrTags = this.selectedObject.catalogueentry + ',' + this.selectedObject.familiarname;

    //         // Flickr search
    //         this._flickrService.getPhotos(this.flickrTags).subscribe(items => this.flickrItems = items.photos.photo, (err) => this.errorMessageFlickr = err);

    //         // Object's current position on the sky for user's location
    //         this.getObjectsCurrentPosition();

    //         // Object's next 12 hour positions on the sky for user's location
    //         this.getObjectsNextPositions(12);

    //         // Update chart's label and fill it's data with 100ms delay because of issues with chart.js
    //         setTimeout(() => {
    //             this.lineChartData[0].label = this.t_ObjectDetailsComponent_Altitude;
    //             this.lineChartLabels = this.lineChartLabelsTemp;
    //             this.lineChartData[0].data = this.lineChartDataTemp[0].data;
    //         }, 100);

    //   })
    //   .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

        this.isLoggedIn = true;

            // Translations
            this.translate();

            // Update panel title, object current position title and object next positions title
            this.t_ObjectDetailsComponent_PanelTitle = this.t_ObjectDetailsComponent_PanelTitle + ((this.selectedObject.catalogueentry ? ": " + this.selectedObject.catalogueentry : (this.selectedObject.familiarname ? ": " + this.selectedObject.familiarname : "")));
            this.t_ObjectDetailsComponent_ObjectsCurrentPosition = ((this.selectedObject.catalogueentry ? this.selectedObject.catalogueentry + " - " : (this.selectedObject.familiarname ? this.selectedObject.familiarname + " - " : ""))) + this.t_ObjectDetailsComponent_ObjectsCurrentPosition
            this.t_ObjectDetailsComponent_ObjectsNextPositions = ((this.selectedObject.catalogueentry ? this.selectedObject.catalogueentry + " - " : (this.selectedObject.familiarname ? this.selectedObject.familiarname + " - " : ""))) + this.t_ObjectDetailsComponent_ObjectsNextPositions

            // Wikipedia term
            this.wikipediaTermCatalogueEntry = this.selectedObject.catalogueentry;
            this.wikipediaTermFamiliarName = this.selectedObject.familiarname;
            this.wikipediaTermAlternativeEntries = this.selectedObject.alternativeentries;

            // Wikipedia search
            let obsCatalogueEntry$ = this._wikipediaService.rawSearch(this.wikipediaTermCatalogueEntry);
            let obsFamiliarName$ = this._wikipediaService.rawSearch(this.wikipediaTermFamiliarName);
            let obsAlternativeEntries$ = this._wikipediaService.rawSearch(this.wikipediaTermAlternativeEntries);
            let combined$ = Observable.forkJoin(obsCatalogueEntry$, obsFamiliarName$, obsAlternativeEntries$);

            combined$.subscribe(
                (items) => {
                    this.wikipediaItems = (items[0] !== undefined ? items[0] : []);
                    this.wikipediaItems = (items[1] !== undefined ? this.wikipediaItems.concat(items[1]) : this.wikipediaItems);
                    this.wikipediaItems = (items[2] !== undefined ? this.wikipediaItems.concat(items[2]) : this.wikipediaItems);
                },
                (err) => this.errorMessageWikipedia = err
            )

            // Flickr tags
            this.flickrTags = this.selectedObject.catalogueentry + ',' + this.selectedObject.familiarname;

            // Flickr search
            this._flickrService.getPhotos(this.flickrTags).subscribe(items => this.flickrItems = items.photos.photo, (err) => this.errorMessageFlickr = err);

            // Object's current position on the sky for user's location
            this.getObjectsCurrentPosition();

            // Object's next 12 hour positions on the sky for user's location
            this.getObjectsNextPositions(12);

            // Update chart's label and fill it's data with 100ms delay because of issues with chart.js
            setTimeout(() => {
                this.lineChartData[0].label = this.t_ObjectDetailsComponent_Altitude;
                this.lineChartLabels = this.lineChartLabelsTemp;
                this.lineChartData[0].data = this.lineChartDataTemp[0].data;
            }, 100);

  }

  onBackClick() {
      this.backButtonClicked.emit();
  }

  getObjectsCurrentPosition() {

        let RA: Array<string> = this.selectedObject.rightascension.replace("h", "").replace("'", "").replace("s", "").split(" ");
        let RA_H: number = parseInt(RA[0]);
        let RA_M: number = parseInt(RA[1]);
        let RA_S: number = parseInt(RA[2]);
        let DEC: Array<string> = this.selectedObject.declination.replace("°", "").replace("'", "").replace("s", "").split(" ");
        let DEC_D: number = parseInt(DEC[0]);
        let DEC_M: number = parseInt(DEC[1]);
        let DEC_S: number = parseInt(DEC[2]);
        let LAT: number = this._userSettingsService.lat;
        let LON: number = this._userSettingsService.lng;
        let now = new Date();
        let utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        let dd = utc_now.getDate();
        let mm = utc_now.getMonth() + 1;
        let yyyy = utc_now.getFullYear();
        let hh = utc_now.getHours();
        let min = utc_now.getMinutes();

        this.altAz = this._calculationsService.getAltAz(
            this._calculationsService.convertToHours(RA_H, RA_M, RA_S), 
            this._calculationsService.convertToDegreesDecimal(DEC_D, DEC_M, DEC_S), 
            LAT, 
            LON, 
            yyyy, 
            mm, 
            dd, 
            hh, 
            min
        );
        this.altDMS = this._calculationsService.convertDegreesDecimalToDegreesMinutesSeconds(this.altAz[0]);
        this.azDMS = this._calculationsService.convertDegreesDecimalToDegreesMinutesSeconds(this.altAz[1]);

  }

  getObjectsNextPositions(iterations: number) {

        let RA: Array<string> = this.selectedObject.rightascension.replace("h", "").replace("'", "").replace("s", "").split(" ");
        let RA_H: number = parseInt(RA[0]);
        let RA_M: number = parseInt(RA[1]);
        let RA_S: number = parseInt(RA[2]);
        let DEC: Array<string> = this.selectedObject.declination.replace("°", "").replace("'", "").replace("s", "").split(" ");
        let DEC_D: number = parseInt(DEC[0]);
        let DEC_M: number = parseInt(DEC[1]);
        let DEC_S: number = parseInt(DEC[2]);
        let LAT: number = this._userSettingsService.lat;
        let LON: number = this._userSettingsService.lng;
        let now = new Date();
        let utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        let dd = utc_now.getDate();
        let mm = utc_now.getMonth() + 1;
        let yyyy = utc_now.getFullYear();
        let hh = utc_now.getHours();
        let min = 0;

        let obj: IObjectPositionModel;
        let altAz: Array<number> = [];
        let alt: Array<number> = [];
        let az: Array<number> = [];
        let altDMS: string = "";
        let azDMS: string = "";

        this.nextHoursPositions = [];

        for (let i = 1; i <= iterations; i++) {

            altAz = this._calculationsService.getAltAz(
                this._calculationsService.convertToHours(RA_H, RA_M, RA_S), 
                this._calculationsService.convertToDegreesDecimal(DEC_D, DEC_M, DEC_S), 
                LAT, 
                LON, 
                yyyy, 
                mm, 
                (hh + i >= 24) ? dd + 1 : dd, 
                hh + i >= 24 ? hh + i - 24 : hh + i, 
                min
            );
            alt = this._calculationsService.convertDegreesDecimalToDegreesMinutesSeconds(altAz[0]);
            az = this._calculationsService.convertDegreesDecimalToDegreesMinutesSeconds(altAz[1]);
            altDMS = alt[0].toString() + "° " + alt[1].toString() + "' " + alt[2].toString() + "s";
            azDMS = az[0].toString() + "° " + az[1].toString() + "' " + az[2].toString() + "s";

            obj = {id: 0, hours: 0, altitude: "0", azimuth: "0"};
            obj.id = i;
            obj.hours = (hh + i >= 24 ? hh + i - 24 : hh + i);
            obj.altitude = altDMS;
            obj.azimuth = azDMS;

            this.nextHoursPositions.push(obj);
            this.lineChartLabelsTemp.push(obj.hours < 10 ? '0' + obj.hours.toString() + "h" : obj.hours.toString() + "h");
            this.lineChartDataTemp[0].data.push(alt[0].toString());

        }

  }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  this.t_ObjectDetailsComponent_PanelTitle = this._translationsService.t_ObjectDetailsComponent_PanelTitle;
                  this.t_ObjectDetailsComponent_ObjectsCurrentPosition = this._translationsService.t_ObjectDetailsComponent_ObjectsCurrentPosition;
                  this.t_ObjectDetailsComponent_Altitude = this._translationsService.t_ObjectDetailsComponent_Altitude;
                  this.t_ObjectDetailsComponent_Azimuth = this._translationsService.t_ObjectDetailsComponent_Azimuth;
                  this.t_ObjectDetailsComponent_TimeUt = this._translationsService.t_ObjectDetailsComponent_TimeUt;
                  this.t_ObjectDetailsComponent_ObjectsNextPositions = this._translationsService.t_ObjectDetailsComponent_ObjectsNextPositions;
                  this.t_ObjectDetailsComponent_Back = this._translationsService.t_ObjectDetailsComponent_Back;
              });
      } else {
                  this.t_ObjectDetailsComponent_PanelTitle = this._translationsService.t_ObjectDetailsComponent_PanelTitle;
                  this.t_ObjectDetailsComponent_ObjectsCurrentPosition = this._translationsService.t_ObjectDetailsComponent_ObjectsCurrentPosition;
                  this.t_ObjectDetailsComponent_Altitude = this._translationsService.t_ObjectDetailsComponent_Altitude;
                  this.t_ObjectDetailsComponent_Azimuth = this._translationsService.t_ObjectDetailsComponent_Azimuth;
                  this.t_ObjectDetailsComponent_TimeUt = this._translationsService.t_ObjectDetailsComponent_TimeUt;
                  this.t_ObjectDetailsComponent_ObjectsNextPositions = this._translationsService.t_ObjectDetailsComponent_ObjectsNextPositions;
                  this.t_ObjectDetailsComponent_Back = this._translationsService.t_ObjectDetailsComponent_Back;
      }

  }

}