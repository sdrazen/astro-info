import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IssService } from './shared/iss.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-iss',
  templateUrl: './iss.component.html',
  styleUrls: ['./iss.component.css']
})
export class IssComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: any;

  // Variables for various error messages
  errorMessageIss: string = "";

  // Variables for iss service
  lat: number = 0;
  lng: number = 0;
  altitude: number = 0;
  velocity: number = 0;
  timestamp: number = 0;
  dateTime: string = "";
  refreshPeriod: number = 5000;
  refreshPeriodInSeconds: number = 5;
  currentIssPosition$: Observable<any>;
  intervalObservableSubscription$: Subscription;

  // Variables for Google Maps
  zoom: number = 2;
  draggable: boolean = false;
  iconUrl: string = "assets/img/iss.ico";

  // Variables for translations
  t_IssComponent_PanelTitle: string = "Current ISS position";
  t_IssComponent_MapTitle: string = "Current ISS position and data";
  t_IssComponent_Latitude: string = "Latitude";
  t_IssComponent_Longitude: string = "Longitude";
  t_IssComponent_Altitude: string = "Altitude (km)";
  t_IssComponent_Velocity: string = "Velocity (km/h)";
  t_IssComponent_DateTime: string = "Date/Time";
  t_IssComponent_DataRefreshPeriod: string = "Data refresh period (sec)";
  t_IssComponent_AlertTextPart1: string = "Data will be automatically updated every";
  t_IssComponent_AlertTextPart2: string = "seconds";

  constructor(private _firebaseAuthService: FirebaseAuthService, private _router: Router, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService, private _issService: IssService) { }

  ngOnInit() {

    //   var p = this._firebaseAuthService.listenForAuthStateChanges();

    //   p.then(user => {
    //     this.isLoggedIn = true;
    //     this.currentUser = user;

    //     // Initial observable subsription
    //     this._issService.getCurrentIssPosition()
    //         .subscribe(data => {
    //             this.currentIssPosition$ = data;
    //             this.lat = data.latitude;
    //             this.lng = data.longitude;
    //             this.altitude = Math.round(data.altitude);
    //             this.velocity = Math.round(data.velocity);
    //             this.timestamp = data.timestamp;
    //             this.dateTime = this.convertTimestampToDateTime(this.timestamp);
    //         }, (err) => this.errorMessageIss = err);

    //     // Use data from iss service periodically
    //     this.intervalObservableSubscription$ = IntervalObservable.create(this.refreshPeriod)
    //         .switchMap(() => {
    //             return this._issService.getCurrentIssPosition();
    //         })
    //         .subscribe(data => {
    //             this.currentIssPosition$ = data;
    //             this.lat = data.latitude;
    //             this.lng = data.longitude;
    //             this.altitude = Math.round(data.altitude);
    //             this.velocity = Math.round(data.velocity);
    //             this.timestamp = data.timestamp;
    //             this.dateTime = this.convertTimestampToDateTime(this.timestamp);
    //         }, (err) => this.errorMessageIss = err);

    //     // Translations
    //     this.translate();

    //   })
    //   .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

        this.isLoggedIn = true;
        // this.currentUser = user;

        // Initial observable subsription
        this._issService.getCurrentIssPosition()
            .subscribe(data => {
                this.currentIssPosition$ = data;
                this.lat = data.latitude;
                this.lng = data.longitude;
                this.altitude = Math.round(data.altitude);
                this.velocity = Math.round(data.velocity);
                this.timestamp = data.timestamp;
                this.dateTime = this.convertTimestampToDateTime(this.timestamp);
            }, (err) => this.errorMessageIss = err);

        // Use data from iss service periodically
        this.intervalObservableSubscription$ = IntervalObservable.create(this.refreshPeriod)
            .switchMap(() => {
                return this._issService.getCurrentIssPosition();
            })
            .subscribe(data => {
                this.currentIssPosition$ = data;
                this.lat = data.latitude;
                this.lng = data.longitude;
                this.altitude = Math.round(data.altitude);
                this.velocity = Math.round(data.velocity);
                this.timestamp = data.timestamp;
                this.dateTime = this.convertTimestampToDateTime(this.timestamp);
            }, (err) => this.errorMessageIss = err);

        // Translations
        this.translate();

  }

  convertTimestampToDateTime(timestamp: number): string {
      
      let d = new Date(timestamp * 1000);
      let yyyy = d.getFullYear();
      let mm = ('0' + (d.getMonth() + 1)).slice(-2);    // Months are zero based. Add leading 0.
	  let dd = ('0' + d.getDate()).slice(-2);			
	  let hh = ('0' + d.getHours()).slice(-2);
      let min = ('0' + d.getMinutes()).slice(-2);       
      let sec = ('0' + d.getSeconds()).slice(-2);       

      return yyyy.toString() + "-" + mm + "-" + dd + " " + hh + ":" + min + ":" + sec;

  }

  onRefreshPeriodInSecondsKeyUp() {

      if (parseInt(this.refreshPeriodInSeconds.toString()) > 0) {

            this.intervalObservableSubscription$.unsubscribe();
            this.refreshPeriod = parseInt(this.refreshPeriodInSeconds.toString()) * 1000

            // Use data from iss service periodically
            this.intervalObservableSubscription$ = IntervalObservable.create(this.refreshPeriod)
                .switchMap(() => {
                    return this._issService.getCurrentIssPosition();
                })
                .subscribe(data => {
                    this.currentIssPosition$ = data;
                    this.lat = data.latitude;
                    this.lng = data.longitude;
                    this.altitude = Math.round(data.altitude);
                    this.velocity = Math.round(data.velocity);
                    this.timestamp = data.timestamp;
                    this.dateTime = this.convertTimestampToDateTime(this.timestamp);
                }, (err) => this.errorMessageIss = err);
          
      }
    
  }  

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  // Translations
                  this.t_IssComponent_PanelTitle = this._translationsService.t_IssComponent_PanelTitle;
                  this.t_IssComponent_MapTitle = this._translationsService.t_IssComponent_MapTitle;
                  this.t_IssComponent_Latitude = this._translationsService.t_IssComponent_Latitude;
                  this.t_IssComponent_Longitude = this._translationsService.t_IssComponent_Longitude;
                  this.t_IssComponent_Altitude = this._translationsService.t_IssComponent_Altitude;
                  this.t_IssComponent_Velocity = this._translationsService.t_IssComponent_Velocity;
                  this.t_IssComponent_DateTime = this._translationsService.t_IssComponent_DateTime;
                  this.t_IssComponent_DataRefreshPeriod = this._translationsService.t_IssComponent_DataRefreshPeriod;
                  this.t_IssComponent_AlertTextPart1 = this._translationsService.t_IssComponent_AlertTextPart1;
                  this.t_IssComponent_AlertTextPart2 = this._translationsService.t_IssComponent_AlertTextPart2;
              });
      } else {
                  // Translations
                  this.t_IssComponent_PanelTitle = this._translationsService.t_IssComponent_PanelTitle;
                  this.t_IssComponent_MapTitle = this._translationsService.t_IssComponent_MapTitle;
                  this.t_IssComponent_Latitude = this._translationsService.t_IssComponent_Latitude;
                  this.t_IssComponent_Longitude = this._translationsService.t_IssComponent_Longitude;
                  this.t_IssComponent_Altitude = this._translationsService.t_IssComponent_Altitude;
                  this.t_IssComponent_Velocity = this._translationsService.t_IssComponent_Velocity;
                  this.t_IssComponent_DateTime = this._translationsService.t_IssComponent_DateTime;
                  this.t_IssComponent_DataRefreshPeriod = this._translationsService.t_IssComponent_DataRefreshPeriod;
                  this.t_IssComponent_AlertTextPart1 = this._translationsService.t_IssComponent_AlertTextPart1;
                  this.t_IssComponent_AlertTextPart2 = this._translationsService.t_IssComponent_AlertTextPart2;
      }

  }

}
