import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Globals } from 'common/globals';

@Injectable()
export class FlickrService {

  constructor(private _http: HttpClient) { }

  getPhotos(tags: string): Observable<any> {

    let api_key = Globals.FLICKR_API_KEY;
    let method = 'flickr.photos.search';
    let per_page = '21'
    let tag_mode = 'all' // any = OR, all = AND

    if (Globals.API_SOURCE == 0) {
      // Frontend
      return this._http
        .get('https://api.flickr.com/services/rest/?format=json&sort=random&method=' + method + '&tags=' + tags + '&per_page=' + per_page + '&tag_mode=' + tag_mode + '&api_key=' + api_key + '&nojsoncallback=1')
        .pipe(
          map((request) => request)
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

    if (Globals.API_SOURCE == 1) {
      // Backend
      return this._http
        .get(Globals.MONGODB_API_URL + '/flickr?tags=' + tags)
        .pipe(
          map((request) => request)
        ).pipe(
          catchError(err => {
            throw ("Error fetching data from server: " + err)
          })
        )
    }

  }

}
