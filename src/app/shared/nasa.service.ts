import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { IApodModel } from './data.apod.model';
import { Globals } from 'common/globals';

@Injectable()
export class NasaService {

  api_key: string = Globals.NASA_API_KEY;

  constructor(private _http: HttpClient) { }

  getApod(): Observable<IApodModel> {

    return this._http
      .get('https://api.nasa.gov/planetary/apod?api_key=' + this.api_key)
      .pipe(
        map((request) => <IApodModel>request)
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )

  }

  getNeo(start_date: string, end_date: string): Observable<any> {

    return this._http
      .get('https://api.nasa.gov/neo/rest/v1/feed?start_date=' + start_date + '&end_date=' + end_date + '&api_key=' + this.api_key)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )

  }

  getNeoDetails(id: number): Observable<any> {

    return this._http
      .get('https://api.nasa.gov/neo/rest/v1/neo/' + id + '?api_key=' + this.api_key)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )

  }

}
