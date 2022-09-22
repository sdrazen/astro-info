import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { ITimezoneModel } from './data.timezone.model';
import { Globals } from 'common/globals';
@Injectable()
export class GoogleService {

  constructor(private _http: HttpClient) { }

  getTimeZone(lat: string, lng: string, timestamp: number): Observable<ITimezoneModel> {

    let api_key = Globals.GOOGLE_MAPS_API_KEY;

    if (Globals.API_SOURCE == 0) {
      // Frontend
      return this._http
        .get('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=' + timestamp.toString() + '&key=' + api_key)
        .pipe(
          map((request) => <ITimezoneModel>request)
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

    if (Globals.API_SOURCE == 1) {
      // Backend
      return this._http
        .get(Globals.MONGODB_API_URL + '/timezone?lat=' + lat + '&lng=' + lng + '&timestamp=' + timestamp.toString())
        .pipe(
          map((request) => <ITimezoneModel>request)
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

  }

}