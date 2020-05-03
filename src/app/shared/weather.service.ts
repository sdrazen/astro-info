import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class WeatherService {

  api_key: string = 'PxWpcAA5uQrAL3k14SCYCU7pTvAIx03v'; // My original api_key
  // api_key: string = 'M1WSwPglWwVHjqvdeFuIZwUkEMBlqolS';

  constructor(private _http: Http) {}
  
  getLocation (lat: string, lng: string, languageIdentifier: string): Observable<any> {

    return this._http
                .get('https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + this.api_key + '&q=' + lat + '%2C%20' + lng + '&language=' + languageIdentifier)
                .map((request) => request.json())
                .catch(this._serverError);

  }

  getCurrentConditions (locationKey: string, languageIdentifier: string): Observable<any> {

    return this._http
                .get('https://dataservice.accuweather.com/currentconditions/v1/' + locationKey + '?apikey=' + this.api_key + "&details=true&language=" + languageIdentifier)
                .map((request) => request.json())
                .catch(this._serverError);

  }  

  getDailyForecast (locationKey: string, languageIdentifier: string): Observable<any> {

    return this._http
                .get('https://dataservice.accuweather.com/forecasts/v1/daily/5day/' + locationKey + '?apikey=' + this.api_key + "&details=true&metric=true&language=" + languageIdentifier)
                .map((request) => request.json())
                .catch(this._serverError);

  }  

  getHourlyForecast (locationKey: string, languageIdentifier: string): Observable<any> {

    return this._http
                .get('https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/' + locationKey + '?apikey=' + this.api_key + "&details=true&metric=true&language=" + languageIdentifier)
                .map((request) => request.json())
                .catch(this._serverError);

  }  

  private _serverError(err: any) {

      if(err instanceof Response) {
          return Observable.throw("Server error...");
      }
      return Observable.throw(err);

  }

}
