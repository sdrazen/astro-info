import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { WeatherService } from './shared/weather.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IUserSettingsModel } from './shared/user.settings.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/Rx';
declare var firebase: any;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: any;

  // Variables for Google Maps
  zoom: number = 10;
  // lat: number = 45.814440;
  // lng: number = 15.977980;
  draggable: boolean = true;

  // Variables for AccuWeather
  location: Observable<any>;
  locationKey: string;
  // Current conditions
  currentConditions: Observable<any>;
  // Daily forecasts
  dailyForecasts: Observable<any>;
  // Hourly forecasts
  hourlyForecasts: Observable<any>;

  // Variables for various error messages
  errorMessageWeatherService: string = "";

  // Variables for user settings
  lat: number = 0;
  lng: number = 0;
  timeZoneRawOffset: number = 0;
  languageId: number = 0;
  itemsPerPage: number = 0;
  pagesPerPageset: number = 0;
  userSettings: IUserSettingsModel = {lat: 0, lng: 0, timeZoneRawOffset: 0, languageId: 0, itemsPerPage: 0, pagesPerPageset: 0};

  // Variables for charts
  barChartType:string = 'bar';

  barChartLabelsDaily:Array<any> = [];
  barChartDataDaily:Array<any> = [{data: [], label: ""}, {data: [], label: ""}];

  barChartLabelsHourly:Array<any> = [];
  barChartDataHourly:Array<any> = [{data: [], label: ""}, {data: [], label: ""}];

  // Variables for translations
  t_WeatherComponent_PanelTitle: string = "Weather conditions and forecasts";
  t_WeatherComponent_MapTitle: string = "Click on map or drag marker to get weather conditions and forecasts for chosen place";
  t_WeatherComponent_Sun: string = "Sun";
  t_WeatherComponent_Mon: string = "Mon";
  t_WeatherComponent_Tue: string = "Tue";
  t_WeatherComponent_Wed: string = "Wed";
  t_WeatherComponent_Thu: string = "Thu";
  t_WeatherComponent_Fri: string = "Fri";
  t_WeatherComponent_Sat: string = "Sat";
  t_WeatherComponent_Wind: string = "Wind";
  t_WeatherComponent_Visibility: string = "Visibility";
  t_WeatherComponent_CloudCover: string = "Cloud cover";
  t_WeatherComponent_RainProbability: string = "Rain prob.";
  t_WeatherComponent_SnowProbability: string = "Snow prob.";
  t_WeatherComponent_IceProbability: string = "Ice prob.";
  t_WeatherComponent_Sunrise: string = "Sun rise";
  t_WeatherComponent_Sunset: string = "Sun set";
  t_WeatherComponent_Moonrise: string = "Moon rise";
  t_WeatherComponent_Moonset: string = "Moon set";
  t_WeatherComponent_MoonAge: string = "Moon age";
  t_WeatherComponent_Rain: string = "Rain";
  t_WeatherComponent_Clouds: string = "Clouds";

  constructor(private _firebaseAuthService: FirebaseAuthService, private _router: Router, private _weatherService: WeatherService, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

      var p = this._firebaseAuthService.listenForAuthStateChanges();

      p.then(user => {

        this.isLoggedIn = true;
        this.currentUser = user;

        // Use user settings from service
        this.lat = this._userSettingsService.lat;
        this.lng = this._userSettingsService.lng;
        this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
        this.languageId = this._userSettingsService.languageId;
        this.itemsPerPage = this._userSettingsService.itemsPerPage;
        this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

        // Get weather details for chose place
        this.getWeatherDetails();

        // Translations
        this.translate();

        // Update chart's label and fill it's data with 100ms delay because of issues with chart.js
        setTimeout(() => {
            this.barChartDataDaily[0].label = this.t_WeatherComponent_CloudCover + " (%)";
            this.barChartDataDaily[1].label = this.t_WeatherComponent_RainProbability + " (%)";
            this.barChartDataHourly[0].label = this.t_WeatherComponent_CloudCover + " (%)";
            this.barChartDataHourly[1].label = this.t_WeatherComponent_RainProbability + " (%)";
        }, 1000);

      })
      .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

  }

  onMapClick($event: any) {

    // Set lat and lng for clicked place
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;

    // Get weather details for chose place
    this.getWeatherDetails();

  }

  onMarkerDragEnd($event: any) {

    // Set lat and lng for clicked place
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;

    // Get weather details for chose place
    this.getWeatherDetails();

  }

    getWeatherDetails(): void {

    // Get weather details for chosen place
    this._weatherService.getLocation(this.lat.toString(), this.lng.toString(), this._translationsService.languageidentifier)
      .do(location => this.location = location)
      .switchMap(location => {
        if (location !== null && location !== undefined) {
          // Location found, get current conditions
          this.locationKey = location.Key;
          return this._weatherService.getCurrentConditions(this.locationKey, this._translationsService.languageidentifier);
        } else {
          // Location not found, don' try to get current conditions for place that does not exist
          return Observable.of(null);
        }
      })
      .switchMap(currentConditions => {
        if (currentConditions !== null && currentConditions !== undefined) {
          // Everything ok, set current conditions for that place and get daily forecasts
          this.currentConditions = currentConditions;
          return this._weatherService.getDailyForecast(this.locationKey, this._translationsService.languageidentifier);
        } else {
          // Reset current conditions and dont' try to get daily forecasts
          this.currentConditions = null;
          return Observable.of(null);
        }
      })
      .switchMap(dailyForecasts => {
        if (dailyForecasts !== null && dailyForecasts !== undefined) {
          // Everything ok, set daily forecasts for that place and get hourly forecasts
          this.dailyForecasts = dailyForecasts;
          // Get labels and data for cloud cover and rain probability weather graphs
          let labels: Array<Array<string>> = [];
          let arr: Array<string> = [];
          setTimeout(() => {
              dailyForecasts.DailyForecasts.forEach(el => {
                arr.push(this.getDayOfWeek(el.Date) + ' / ' + this.convertDate(el.Date));
                arr.push("");
                arr.push(this.t_WeatherComponent_Sunrise + ": " + this.convertTime(el.Sun.Rise));
                arr.push(this.t_WeatherComponent_Sunset + ": " + this.convertTime(el.Sun.Set));
                arr.push(this.t_WeatherComponent_Moonrise + ": " + this.convertTime(el.Moon.Rise));
                arr.push(this.t_WeatherComponent_Moonset + ": " + this.convertTime(el.Moon.Set));
                arr.push(this.t_WeatherComponent_MoonAge + ": " + el.Moon.Age);
                arr.push("");
                labels.push(arr);
                arr = [];
              })
              this.barChartLabelsDaily = labels;
              this.barChartDataDaily[0].data = dailyForecasts.DailyForecasts.map(el => this.convertInt(el.Night.CloudCover));
              this.barChartDataDaily[1].data = dailyForecasts.DailyForecasts.map(el => this.convertInt(el.Night.RainProbability));
          }, 1000);
          // Return
          return this._weatherService.getHourlyForecast(this.locationKey, this._translationsService.languageidentifier);
        } else {
          // Reset daily forecasts and don't try to get hourly forecasts
          this.dailyForecasts = null;
          return Observable.of(null);
        }
      })
      .subscribe(hourlyForecasts => {
        if (hourlyForecasts !== null && hourlyForecasts !== undefined) {
          // Everything ok, set hourly forecasts for that place
          this.hourlyForecasts = hourlyForecasts;
          // Get labels and data for cloud cover and rain probability weather graphs
          let labels: Array<string> = [];
          setTimeout(() => {
              hourlyForecasts.forEach(el => {
                // labels.push(this.getDayOfWeek(el.DateTime) + ' / ' + this.convertTime(el.DateTime));
                labels.push(this.getDayOfWeek(el.DateTime) + " " + this.convertHours(el.DateTime) + "h");
              })
              this.barChartLabelsHourly = labels;
              this.barChartDataHourly[0].data = hourlyForecasts.map(el => this.convertInt(el.CloudCover));
              this.barChartDataHourly[1].data = hourlyForecasts.map(el => this.convertInt(el.RainProbability));
          }, 1000);
          // Reset any observable errors if there were any, so alert is not displayed any more
          this.errorMessageWeatherService = "";
        } else {
          // Reset hourly forecasts
          this.hourlyForecasts = null;
        }
      }, (err) => this.errorMessageWeatherService = err)

    }

    convertInt(value: string): number {
      if (!value){return 0};
      return Math.round(parseFloat(value));
    }

    convertTime(value: string): string {
      if (!value){return ""};
      var s = value.substring(11, 16);
      return s;
    }

    convertHours(value: string): string {
      if (!value){return ""};
      var s = value.substring(11, 13);
      return s;
    }

    convertDate(value: string): string {
      if (!value){return ""};
      var s = value.substring(8, 10) + "." + value.substring(5, 7) + ".";
      return s;
    }

    getIconPath(icon: number): string {
          return "/assets/accuweather/img/" + (icon < 10 ? "0" : "") + icon + "-s.png";
    }

    getDayOfWeek(value: string): string {

      if (!value){return ""};

      var d = new Date(value.slice(0, 19));
      var weekday = new Array(7);

      weekday[0] = this.t_WeatherComponent_Sun;
      weekday[1] = this.t_WeatherComponent_Mon;
      weekday[2] = this.t_WeatherComponent_Tue;
      weekday[3] = this.t_WeatherComponent_Wed;
      weekday[4] = this.t_WeatherComponent_Thu;
      weekday[5] = this.t_WeatherComponent_Fri;
      weekday[6] = this.t_WeatherComponent_Sat;

      var s = weekday[d.getDay()];

      return s;
    }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  this.t_WeatherComponent_PanelTitle = this._translationsService.t_WeatherComponent_PanelTitle;
                  this.t_WeatherComponent_MapTitle = this._translationsService.t_WeatherComponent_MapTitle;
                  this.t_WeatherComponent_Sun = this._translationsService.t_WeatherComponent_Sun;
                  this.t_WeatherComponent_Mon = this._translationsService.t_WeatherComponent_Mon;
                  this.t_WeatherComponent_Tue = this._translationsService.t_WeatherComponent_Tue;
                  this.t_WeatherComponent_Wed = this._translationsService.t_WeatherComponent_Wed;
                  this.t_WeatherComponent_Thu = this._translationsService.t_WeatherComponent_Thu;
                  this.t_WeatherComponent_Fri = this._translationsService.t_WeatherComponent_Fri;
                  this.t_WeatherComponent_Sat = this._translationsService.t_WeatherComponent_Sat;
                  this.t_WeatherComponent_Wind = this._translationsService.t_WeatherComponent_Wind;
                  this.t_WeatherComponent_Visibility = this._translationsService.t_WeatherComponent_Visibility;
                  this.t_WeatherComponent_CloudCover = this._translationsService.t_WeatherComponent_CloudCover;
                  this.t_WeatherComponent_RainProbability = this._translationsService.t_WeatherComponent_RainProbability;
                  this.t_WeatherComponent_SnowProbability = this._translationsService.t_WeatherComponent_SnowProbability;
                  this.t_WeatherComponent_IceProbability = this._translationsService.t_WeatherComponent_IceProbability;
                  this.t_WeatherComponent_Sunrise = this._translationsService.t_WeatherComponent_Sunrise;
                  this.t_WeatherComponent_Sunset = this._translationsService.t_WeatherComponent_Sunset;
                  this.t_WeatherComponent_Moonrise = this._translationsService.t_WeatherComponent_Moonrise;
                  this.t_WeatherComponent_Moonset = this._translationsService.t_WeatherComponent_Moonset;
                  this.t_WeatherComponent_MoonAge = this._translationsService.t_WeatherComponent_MoonAge;
                  this.t_WeatherComponent_Rain = this._translationsService.t_WeatherComponent_Rain;
                  this.t_WeatherComponent_Clouds = this._translationsService.t_WeatherComponent_Clouds;
              });
      } else {
                  this.t_WeatherComponent_PanelTitle = this._translationsService.t_WeatherComponent_PanelTitle;
                  this.t_WeatherComponent_MapTitle = this._translationsService.t_WeatherComponent_MapTitle;
                  this.t_WeatherComponent_Sun = this._translationsService.t_WeatherComponent_Sun;
                  this.t_WeatherComponent_Mon = this._translationsService.t_WeatherComponent_Mon;
                  this.t_WeatherComponent_Tue = this._translationsService.t_WeatherComponent_Tue;
                  this.t_WeatherComponent_Wed = this._translationsService.t_WeatherComponent_Wed;
                  this.t_WeatherComponent_Thu = this._translationsService.t_WeatherComponent_Thu;
                  this.t_WeatherComponent_Fri = this._translationsService.t_WeatherComponent_Fri;
                  this.t_WeatherComponent_Sat = this._translationsService.t_WeatherComponent_Sat;
                  this.t_WeatherComponent_Wind = this._translationsService.t_WeatherComponent_Wind;
                  this.t_WeatherComponent_Visibility = this._translationsService.t_WeatherComponent_Visibility;
                  this.t_WeatherComponent_CloudCover = this._translationsService.t_WeatherComponent_CloudCover;
                  this.t_WeatherComponent_RainProbability = this._translationsService.t_WeatherComponent_RainProbability;
                  this.t_WeatherComponent_SnowProbability = this._translationsService.t_WeatherComponent_SnowProbability;
                  this.t_WeatherComponent_IceProbability = this._translationsService.t_WeatherComponent_IceProbability;
                  this.t_WeatherComponent_Sunrise = this._translationsService.t_WeatherComponent_Sunrise;
                  this.t_WeatherComponent_Sunset = this._translationsService.t_WeatherComponent_Sunset;
                  this.t_WeatherComponent_Moonrise = this._translationsService.t_WeatherComponent_Moonrise;
                  this.t_WeatherComponent_Moonset = this._translationsService.t_WeatherComponent_Moonset;
                  this.t_WeatherComponent_MoonAge = this._translationsService.t_WeatherComponent_MoonAge;
                  this.t_WeatherComponent_Rain = this._translationsService.t_WeatherComponent_Rain;
                  this.t_WeatherComponent_Clouds = this._translationsService.t_WeatherComponent_Clouds;
      }

  }

}
