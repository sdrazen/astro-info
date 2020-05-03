import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class NasaService {

  api_key: string = "BE2zFFfjKg71NIoVQ8nUN5p1LBL7tEJwPelittw3";

  constructor(private _http: Http) {}
  
  getApod(): Observable<any> {

    return this._http
                .get('https://api.nasa.gov/planetary/apod?api_key=' + this.api_key)
                .map((request) => request.json())
                .catch(this._serverError);

  }

  getNeo(start_date: string, end_date: string): Observable<any> {

    return this._http
                .get('https://api.nasa.gov/neo/rest/v1/feed?start_date=' + start_date + '&end_date=' + end_date + '&api_key=' + this.api_key)
                .map((request) => request.json())
                .catch(this._serverError);

  }

  getNeoDetails(id: number): Observable<any> {

    return this._http
                .get('https://api.nasa.gov/neo/rest/v1/neo/' + id + '?api_key=' + this.api_key)
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
