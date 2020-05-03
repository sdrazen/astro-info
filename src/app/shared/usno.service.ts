import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class UsnoService {

  constructor(private _http: Http) {}
  
  getNextMoonPhases(date: string, nump: number): Observable<any> {

    // date = m/d/yyyy

    return this._http
                .get('http://api.usno.navy.mil/moon/phase?date=' + date + '&nump=' + nump.toString())
                .map((request) => request.json())
                .catch(this._serverError);

  }

  getAllMoonPhases(year: string): Observable<any> {

    return this._http
                .get('http://api.usno.navy.mil/moon/phase?year=' + year)
                .map((request) => request.json())
                .catch(this._serverError);

  }

  getSunAndMoonData(date: string, coords: string, tz: string): Observable<any> {

    // date = m/d/yyyy
    // coords = comma delimited latiitude and longitude
    // tz = timezone

    return this._http
                .get('http://api.usno.navy.mil/rstt/oneday?date=' + date + '&coords=' + coords + '&tz=' + tz)
                .map((request) => request.json())
                .catch(this._serverError);

  }

  getSolarEclipses(year: string) : Observable<any> {

    return this._http
                .get('http://api.usno.navy.mil/eclipses/solar?year=' + year)
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
