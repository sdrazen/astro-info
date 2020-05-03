import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class GoogleService {

  constructor(private _http: Http) {}
  
  getTimeZone(lat: string, lng: string, timestamp: number): Observable<any> {

    let api_key = 'AIzaSyBjpf1yPAcUToRRFLx9tTTXkiH-VLGSvps';

    return this._http
                .get('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=' + timestamp.toString() + '&key=' + api_key)
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