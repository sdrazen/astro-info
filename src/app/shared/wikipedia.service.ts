import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Globals } from 'common/globals';

@Injectable()
export class WikipediaService {
  constructor(private http: HttpClient) { }

  rawSearch(wikipediaTerm: string): Observable<string[]> {

    if (Globals.API_SOURCE == 0) {
      // Frontend
      return this.http.get(`https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=${wikipediaTerm}&namespace=`)
        .pipe(
          map((request) => request[3])
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

    if (Globals.API_SOURCE == 1) {
      // Backend
      return this.http.get(Globals.MONGODB_API_URL + '/wikipedia?term=' + wikipediaTerm)
        .pipe(
          map((request) => request[3])
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

  }

}
