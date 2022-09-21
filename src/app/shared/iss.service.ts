import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { IIssModel } from './data.iss.model';

@Injectable()
export class IssService {

  constructor(private _http: HttpClient) { }

  getCurrentIssPosition(): Observable<IIssModel> {

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

}