import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class FlickrService {

  constructor(private _http: Http) {}
  
  getPhotos (tags: string): Observable<any> {

    let api_key = 'a3d7ab8d127095d544d1ab29021a37e1';
    let method = 'flickr.photos.search';
    let per_page = '21'
    let tag_mode = 'all' // any = OR, all = AND

    return this._http
                .get('https://api.flickr.com/services/rest/?format=json&sort=random&method=' + method + '&tags=' + tags + '&per_page=' + per_page + '&tag_mode=' + tag_mode + '&api_key=' + api_key + '&nojsoncallback=1')
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
