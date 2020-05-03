import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class IssService {

  constructor(private _http: Http) {}
  
  getCurrentIssPosition(): Observable<any> {

    return this._http
                .get('https://api.wheretheiss.at/v1/satellites/25544')
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