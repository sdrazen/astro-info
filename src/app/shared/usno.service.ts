import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

@Injectable()
export class UsnoService {

  constructor(private _http: HttpClient) { }

  getNextMoonPhases(date: string, nump: number): Observable<any> {

    // date = m/d/yyyy

    return this._http
      .get('http://api.usno.navy.mil/moon/phase?date=' + date + '&nump=' + nump.toString())
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )

  }

  getAllMoonPhases(year: string): Observable<any> {

    return this._http
      .get('http://api.usno.navy.mil/moon/phase?year=' + year)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )

  }

  getSunAndMoonData(date: string, coords: string, tz: string): Observable<any> {

    // date = m/d/yyyy
    // coords = comma delimited latiitude and longitude
    // tz = timezone

    return this._http
      .get('http://api.usno.navy.mil/rstt/oneday?date=' + date + '&coords=' + coords + '&tz=' + tz)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )

  }

  getSolarEclipses(year: string): Observable<any> {

    return this._http
      .get('http://api.usno.navy.mil/eclipses/solar?year=' + year)
      .pipe(
        map((request) => request)
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )

  }

}
