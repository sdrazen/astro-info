import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { IIssModel } from './data.iss.model';
import { Globals } from 'common/globals';

@Injectable()
export class IssService {

  constructor(private _http: HttpClient) { }

  getCurrentIssPosition(): Observable<IIssModel> {

    if (Globals.API_SOURCE == 0) {
      // Frontend
      return this._http
        .get('https://api.wheretheiss.at/v1/satellites/25544')
        .pipe(
          map((request) => <IIssModel>request)
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

    if (Globals.API_SOURCE == 1) {
      // Backend
      return this._http
        .get(Globals.MONGODB_API_URL + '/iss')
        .pipe(
          map((request) => <IIssModel>request)
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

  }

}