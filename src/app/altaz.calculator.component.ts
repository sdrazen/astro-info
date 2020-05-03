import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { CalculationsService } from './shared/calculations.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IUserSettingsModel } from './shared/user.settings.model';

@Component({
  selector: 'app-altazcalculator',
  templateUrl: './altaz.calculator.component.html',
  styleUrls: ['./altaz.calculator.component.css']
})
export class AltAzCalculatorComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: any;

  @Input() rightAscension: string = "";
  @Input() declination: string = "";
  @Input() catalogueEntry: string = "";
  @Input() familiarName: string = "";
  @Output() public backButtonClicked = new EventEmitter();
  
  // Variables for user settings
  lat: number = 0;
  lng: number = 0;
  ra: string = "";
  dec: string = "";
  timeUt: string = "";
  timeUtYYYY: string = "";
  timeUtMM: string = "";
  timeUtDD: string = "";
  timeUtHH: string = "";
  timeUtMIN: string = "";

  // Variables for Google Maps
  zoom: number = 10;
  draggable: boolean = true;
  iconUrl: string = "assets/img/user.png";
  showSettingsUpdatedAlert: boolean = false;

  // Variables for translations
  t_AltAzCalculatorComponent_PanelTitle: string = "Alt-Az calculator";
  t_AltAzCalculatorComponent_MapTitle: string = "Define parameters to get object's alt-az position";
  t_AltAzCalculatorComponent_Latitude: string = "Latitude";
  t_AltAzCalculatorComponent_Longitude: string = "Longitude";
  t_AltAzCalculatorComponent_RA: string = "RA (hh mm ss)";
  t_AltAzCalculatorComponent_DEC: string = "DEC (deg mm ss)";
  t_AltAzCalculatorComponent_TimeUT: string = "UT (yyyy-mm-dd hh:mm)";
  t_AltAzCalculatorComponent_ObjectsPosition: string = "Object's position on the sky for chosen location and time";
  t_AltAzCalculatorComponent_Altitude: string = "Altitude";
  t_AltAzCalculatorComponent_Azimuth: string = "Azimuth";
  t_AltAzCalculatorComponent_Calculate: string = "Calculate";
  t_AltAzCalculatorComponent_Back: string = "Back";
  t_AltAzCalculatorComponent_AlertText: string = "Data is automatically updated by changing any parameter (RA, DEC, UT or geolocation)";

  // CaclulationsService current position
  altAz: Array<number> = [];
  altDMS: Array<number> = [];
  azDMS: Array<number> = [];

  constructor(private _firebaseAuthService: FirebaseAuthService, private _router: Router, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService, private _calculationsService: CalculationsService) { }

  ngOnInit() {

    //   var p = this._firebaseAuthService.listenForAuthStateChanges();

    //   p.then(user => {
    //     this.isLoggedIn = true;
    //     this.currentUser = user;

    //     let now = new Date();
    //     let utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
    //     let dd = utc_now.getDate();
    //     let mm = utc_now.getMonth() + 1;
    //     let yyyy = utc_now.getFullYear();
    //     let hh = utc_now.getHours();
    //     let min = utc_now.getMinutes();

    //     // Use user settings from service
    //     this.lat = this._userSettingsService.lat;
    //     this.lng = this._userSettingsService.lng;
    //     this.ra = this.rightAscension ? this.rightAscension : "00h 00' 00s";
    //     this.dec = this.declination ? this.declination : "00° 00' 00s";
    //     this.timeUt = yyyy.toString() + "-" + this.leadingZero(mm.toString()) + "-" + this.leadingZero(dd.toString()) + "T" + this.leadingZero(hh.toString()) + ":" + this.leadingZero(min.toString() + ":00");
    //     this.timeUtYYYY = this.leadingZero(yyyy.toString());
    //     this.timeUtMM = this.leadingZero(mm.toString());
    //     this.timeUtDD = this.leadingZero(dd.toString());
    //     this.timeUtHH = this.leadingZero(hh.toString());
    //     this.timeUtMIN = this.leadingZero(min.toString());

    //     // Calculate object's position
    //     this.getObjectsPosition();

    //     // Translations
    //     this.translate();

    //     // Update panel title and object position title
    //     this.t_AltAzCalculatorComponent_PanelTitle = this.t_AltAzCalculatorComponent_PanelTitle + (this.catalogueEntry ? ": " + this.catalogueEntry : (this.familiarName ? ": " + this.familiarName : ""));
    //     this.t_AltAzCalculatorComponent_ObjectsPosition = (this.catalogueEntry ? this.catalogueEntry + " - " : (this.familiarName ? this.familiarName + " - " : "")) + this.t_AltAzCalculatorComponent_ObjectsPosition;

    //   })
    //   .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

        this.isLoggedIn = true;
        // this.currentUser = user;

        let now = new Date();
        let utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        let dd = utc_now.getDate();
        let mm = utc_now.getMonth() + 1;
        let yyyy = utc_now.getFullYear();
        let hh = utc_now.getHours();
        let min = utc_now.getMinutes();

        // Use user settings from service
        this.lat = this._userSettingsService.lat;
        this.lng = this._userSettingsService.lng;
        this.ra = this.rightAscension ? this.rightAscension : "00h 00' 00s";
        this.dec = this.declination ? this.declination : "00° 00' 00s";
        this.timeUt = yyyy.toString() + "-" + this.leadingZero(mm.toString()) + "-" + this.leadingZero(dd.toString()) + "T" + this.leadingZero(hh.toString()) + ":" + this.leadingZero(min.toString() + ":00");
        this.timeUtYYYY = this.leadingZero(yyyy.toString());
        this.timeUtMM = this.leadingZero(mm.toString());
        this.timeUtDD = this.leadingZero(dd.toString());
        this.timeUtHH = this.leadingZero(hh.toString());
        this.timeUtMIN = this.leadingZero(min.toString());

        // Calculate object's position
        this.getObjectsPosition();

        // Translations
        this.translate();

        // Update panel title and object position title
        this.t_AltAzCalculatorComponent_PanelTitle = this.t_AltAzCalculatorComponent_PanelTitle + (this.catalogueEntry ? ": " + this.catalogueEntry : (this.familiarName ? ": " + this.familiarName : ""));
        this.t_AltAzCalculatorComponent_ObjectsPosition = (this.catalogueEntry ? this.catalogueEntry + " - " : (this.familiarName ? this.familiarName + " - " : "")) + this.t_AltAzCalculatorComponent_ObjectsPosition;

  }

  onMapClick($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.calculateTimeUt();
    this.getObjectsPosition();
  }

  onMarkerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.calculateTimeUt();
    this.getObjectsPosition();
  }

  leadingZero(value: string): string {
      return parseInt(value) < 10 ? "0" + value : value
  }

  onKeyUp() {
      this.calculateTimeUt();
      this.getObjectsPosition();
  }

  onCalculateClick() {
      this.calculateTimeUt();
      this.getObjectsPosition();
  }

  onBackClick() {
      this.backButtonClicked.emit();
  }

  getObjectsPosition() {

        let RA: Array<string> = this.ra.replace("h", "").replace("'", "").replace("s", "").split(" ");
        let RA_H: number = parseInt(RA[0]);
        let RA_M: number = parseInt(RA[1]);
        let RA_S: number = parseInt(RA[2]);
        let DEC: Array<string> = this.dec.replace("°", "").replace("'", "").replace("s", "").split(" ");
        let DEC_D: number = parseInt(DEC[0]);
        let DEC_M: number = parseInt(DEC[1]);
        let DEC_S: number = parseInt(DEC[2]);
        let LAT: number = this.lat;
        let LON: number = this.lng;
        let time_ut = new Date(this.timeUt);
        let dd = time_ut.getDate();
        let mm = time_ut.getMonth() + 1;
        let yyyy = time_ut.getFullYear();
        let hh = time_ut.getHours();
        let min = time_ut.getMinutes();

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

  yearMinus() {
      this.timeUtYYYY = (parseInt(this.timeUtYYYY) - 1).toString();
      this.calculateTimeUt();
      this.getObjectsPosition();
  }

  yearPlus() {
      this.timeUtYYYY = (parseInt(this.timeUtYYYY) + 1).toString();
      this.calculateTimeUt();
      this.getObjectsPosition();
  }

  monthMinus() {
      if (parseInt(this.timeUtMM) > 1) {
            this.timeUtMM = this.leadingZero((parseInt(this.timeUtMM) - 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  monthPlus() {
      if (parseInt(this.timeUtMM) < 12) {
            this.timeUtMM = this.leadingZero((parseInt(this.timeUtMM) + 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  dayMinus() {
      if (parseInt(this.timeUtDD) > 1) {
            this.timeUtDD = this.leadingZero((parseInt(this.timeUtDD) - 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  dayPlus() {
      if (parseInt(this.timeUtDD) < 31) {
            this.timeUtDD = this.leadingZero((parseInt(this.timeUtDD) + 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  hourMinus() {
      if (parseInt(this.timeUtHH) > 1) {
            this.timeUtHH = this.leadingZero((parseInt(this.timeUtHH) - 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  hourPlus() {
      if (parseInt(this.timeUtHH) < 23) {
            this.timeUtHH = this.leadingZero((parseInt(this.timeUtHH) + 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  minuteMinus() {
      if (parseInt(this.timeUtMIN) > 1) {
            this.timeUtMIN = this.leadingZero((parseInt(this.timeUtMIN) - 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  minutePlus() {
      if (parseInt(this.timeUtMIN) < 59) {
            this.timeUtMIN = this.leadingZero((parseInt(this.timeUtMIN) + 1).toString());
            this.calculateTimeUt();
            this.getObjectsPosition();
      }
  }

  calculateTimeUt() {
      this.timeUt = this.timeUtYYYY + "-" + this.leadingZero(parseInt(this.timeUtMM.toString()).toString()) + "-" + this.leadingZero(parseInt(this.timeUtDD.toString()).toString()) + "T" + this.leadingZero(parseInt(this.timeUtHH.toString()).toString()) + ":" + this.leadingZero(parseInt(this.timeUtMIN.toString()).toString() + ":00");
  }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  this.t_AltAzCalculatorComponent_PanelTitle = this._translationsService.t_AltAzCalculatorComponent_PanelTitle;
                  this.t_AltAzCalculatorComponent_MapTitle = this._translationsService.t_AltAzCalculatorComponent_MapTitle;
                  this.t_AltAzCalculatorComponent_Latitude = this._translationsService.t_AltAzCalculatorComponent_Latitude;
                  this.t_AltAzCalculatorComponent_Longitude = this._translationsService.t_AltAzCalculatorComponent_Longitude;
                  this.t_AltAzCalculatorComponent_RA = this._translationsService.t_AltAzCalculatorComponent_RA;
                  this.t_AltAzCalculatorComponent_DEC = this._translationsService.t_AltAzCalculatorComponent_DEC;
                  this.t_AltAzCalculatorComponent_TimeUT = this._translationsService.t_AltAzCalculatorComponent_TimeUT;
                  this.t_AltAzCalculatorComponent_ObjectsPosition = this._translationsService.t_AltAzCalculatorComponent_ObjectsPosition;
                  this.t_AltAzCalculatorComponent_Altitude = this._translationsService.t_AltAzCalculatorComponent_Altitude;
                  this.t_AltAzCalculatorComponent_Azimuth = this._translationsService.t_AltAzCalculatorComponent_Azimuth;
                  this.t_AltAzCalculatorComponent_Calculate = this._translationsService.t_AltAzCalculatorComponent_Calculate;
                  this.t_AltAzCalculatorComponent_Back = this._translationsService.t_AltAzCalculatorComponent_Back;
                  this.t_AltAzCalculatorComponent_AlertText = this._translationsService.t_AltAzCalculatorComponent_AlertText;
              });
      } else {
                  this.t_AltAzCalculatorComponent_PanelTitle = this._translationsService.t_AltAzCalculatorComponent_PanelTitle;
                  this.t_AltAzCalculatorComponent_MapTitle = this._translationsService.t_AltAzCalculatorComponent_MapTitle;
                  this.t_AltAzCalculatorComponent_Latitude = this._translationsService.t_AltAzCalculatorComponent_Latitude;
                  this.t_AltAzCalculatorComponent_Longitude = this._translationsService.t_AltAzCalculatorComponent_Longitude;
                  this.t_AltAzCalculatorComponent_RA = this._translationsService.t_AltAzCalculatorComponent_RA;
                  this.t_AltAzCalculatorComponent_DEC = this._translationsService.t_AltAzCalculatorComponent_DEC;
                  this.t_AltAzCalculatorComponent_TimeUT = this._translationsService.t_AltAzCalculatorComponent_TimeUT;
                  this.t_AltAzCalculatorComponent_ObjectsPosition = this._translationsService.t_AltAzCalculatorComponent_ObjectsPosition;
                  this.t_AltAzCalculatorComponent_Altitude = this._translationsService.t_AltAzCalculatorComponent_Altitude;
                  this.t_AltAzCalculatorComponent_Azimuth = this._translationsService.t_AltAzCalculatorComponent_Azimuth;
                  this.t_AltAzCalculatorComponent_Calculate = this._translationsService.t_AltAzCalculatorComponent_Calculate;
                  this.t_AltAzCalculatorComponent_Back = this._translationsService.t_AltAzCalculatorComponent_Back;
                  this.t_AltAzCalculatorComponent_AlertText = this._translationsService.t_AltAzCalculatorComponent_AlertText;
      }

  }

}
