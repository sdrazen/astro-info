import {Injectable} from '@angular/core';
import {URLSearchParams, Jsonp, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
 
@Injectable()
export class WikipediaService {
  constructor(private jsonp: Jsonp) {}
  
//   search(terms: Observable<string>, debounceDuration = 400) {
//     return terms.debounceTime(debounceDuration)
//                 .distinctUntilChanged()
//                 .switchMap(term => this.rawSearch(term));
//   }
  
  rawSearch (wikipediaTerm: string): Observable<any> {
    var search = new URLSearchParams()
    search.set('action', 'opensearch');
    search.set('search', wikipediaTerm);
    search.set('format', 'json');
    return this.jsonp
                .get('https://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { search })
                .map((request) => request.json()[3])
                .catch(this._serverError);
  }

  private _serverError(err: any) {

      if(err instanceof Response) {
          return Observable.throw("Server error...");
      }
      return Observable.throw(err);

  }

}
