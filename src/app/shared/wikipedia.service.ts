import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

@Injectable()
export class WikipediaService {
  constructor(private http: HttpClient) { }

  //   search(terms: Observable<string>, debounceDuration = 400) {
  //     return terms.debounceTime(debounceDuration)
  //                 .distinctUntilChanged()
  //                 .switchMap(term => this.rawSearch(term));
  //   }

  rawSearch(wikipediaTerm: string): Observable<string[]> {
    return this.http.get(`https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=${wikipediaTerm}&namespace=`)
      .pipe(
        map((request) => request[3])
      ).pipe(
        catchError(err => {
          throw ("Error fetching data from server: " + err)
        })
      )
  }

}
