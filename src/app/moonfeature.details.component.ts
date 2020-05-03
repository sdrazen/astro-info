import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDataMoonfeatureListModel } from './shared/data.moonfeaturelist.model';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { FirebaseDataService } from './shared/firebase.data.service';
import { WikipediaService } from './shared/wikipedia.service'
import { FlickrService } from './shared/flickr.service'
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-moonfeature-details',
  templateUrl: './moonfeature.details.component.html',
  styleUrls: ['./moonfeature.details.component.css']
})

export class MoonfeatureDetailsComponent implements OnInit {

  isLoggedIn: boolean;
  wikipediaTermName: string = '';
  wikipediaItems: Observable<Array<string>>;
  flickrTags: string = '';
  flickrItems: Observable<Array<any>>;

  // Variables for various error messages
  errorMessageFlickr: string = "";
  errorMessageWikipedia: string = "";

  @Input() selectedMoonfeature: IDataMoonfeatureListModel;
  @Output() public backButtonClicked = new EventEmitter();

  // Variables for translations
  t_MoonfeatureDetailsComponent_PanelTitle: string =  "Moon's feature details";
  t_MoonfeatureDetailsComponent_Back: string = "Back";

  constructor(private _firebaseAuthService: FirebaseAuthService,
              private _firebaseDataService: FirebaseDataService,
              private _router: Router,
              private _wikipediaService: WikipediaService,
              private _flickrService: FlickrService,
              private _userSettingsService: UserSettingsService,
              private _translationsService: TranslationsService) { }

  ngOnInit() {

    //   var p = this._firebaseAuthService.listenForAuthStateChanges();

    //   p.then(user => {
    //     this.isLoggedIn = true;

    //         // Translations
    //         this.translate();

    //         // Update panel title
    //         this.t_MoonfeatureDetailsComponent_PanelTitle = this.t_MoonfeatureDetailsComponent_PanelTitle + ((this.selectedMoonfeature.name ? ": " + this.selectedMoonfeature.name : ""));

    //         // Wikipedia term
    //         this.wikipediaTermName = this.selectedMoonfeature.name;

    //         // Wikipedia search
    //         this._wikipediaService.rawSearch(this.wikipediaTermName).subscribe(items => this.wikipediaItems = items, (err) => this.errorMessageWikipedia = err);

    //         // Flickr tags
    //         this.flickrTags = this.selectedMoonfeature.name;

    //         // Flickr search
    //         this._flickrService.getPhotos(this.flickrTags).subscribe(items => this.flickrItems = items.photos.photo, (err) => this.errorMessageFlickr = err);

    //   })
    //   .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

        this.isLoggedIn = true;

            // Translations
            this.translate();

            // Update panel title
            this.t_MoonfeatureDetailsComponent_PanelTitle = this.t_MoonfeatureDetailsComponent_PanelTitle + ((this.selectedMoonfeature.name ? ": " + this.selectedMoonfeature.name : ""));

            // Wikipedia term
            this.wikipediaTermName = this.selectedMoonfeature.name;

            // Wikipedia search
            this._wikipediaService.rawSearch(this.wikipediaTermName).subscribe(items => this.wikipediaItems = items, (err) => this.errorMessageWikipedia = err);

            // Flickr tags
            this.flickrTags = this.selectedMoonfeature.name;

            // Flickr search
            this._flickrService.getPhotos(this.flickrTags).subscribe(items => this.flickrItems = items.photos.photo, (err) => this.errorMessageFlickr = err);

  }

  onBackClick() {
      this.backButtonClicked.emit();
  }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  this.t_MoonfeatureDetailsComponent_PanelTitle = this._translationsService.t_MoonfeatureDetailsComponent_PanelTitle;
                  this.t_MoonfeatureDetailsComponent_Back = this._translationsService.t_MoonfeatureDetailsComponent_Back;
              });
      } else {
                  this.t_MoonfeatureDetailsComponent_PanelTitle = this._translationsService.t_MoonfeatureDetailsComponent_PanelTitle;
                  this.t_MoonfeatureDetailsComponent_Back = this._translationsService.t_MoonfeatureDetailsComponent_Back;
      }

  }

}