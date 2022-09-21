import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError, map, catchError } from 'rxjs';
import { Globals } from 'common/globals';

@Injectable()
export class WeatherService {

  api_key: string = Globals.WEATHER_API_KEY;

  constructor(private _http: HttpClient) { }

  getLocation(lat: string, lng: string, languageIdentifier: string): Observable<any> {

    return this._http
      .get('https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + this.api_key + '&q=' + lat + '%2C%20' + lng + '&language=' + languageIdentifier)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(this._serverError)
      )

  }

  getCurrentConditions(locationKey: string, languageIdentifier: string): Observable<any> {

    return this._http
      .get('https://dataservice.accuweather.com/currentconditions/v1/' + locationKey + '?apikey=' + this.api_key + "&details=true&language=" + languageIdentifier)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(this._serverError)
      )

  }

  getDailyForecast(locationKey: string, languageIdentifier: string): Observable<any> {

    return this._http
      .get('https://dataservice.accuweather.com/forecasts/v1/daily/5day/' + locationKey + '?apikey=' + this.api_key + "&details=true&metric=true&language=" + languageIdentifier)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(this._serverError)
      )

  }

  getHourlyForecast(locationKey: string, languageIdentifier: string): Observable<any> {

    return this._http
      .get('https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/' + locationKey + '?apikey=' + this.api_key + "&details=true&metric=true&language=" + languageIdentifier)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(this._serverError)
      )

  }

  private _serverError(err: any) {

    if (err instanceof HttpResponse) {
      return throwError(() => new Error("Server error..."));
    }
    return throwError(() => new Error(err));

  }

}
