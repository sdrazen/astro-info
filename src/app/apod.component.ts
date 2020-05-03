import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { NasaService } from './shared/nasa.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.css']
})

export class ApodComponent implements OnInit {

  isLoggedIn: boolean;
  apod: Observable<any>;
  
  // Variables for various error messages
  errorMessageApod: string = "";

  // Variables for translations
  t_ApodComponent_PanelTitle: string = "Astronomy Picture of the Day";
  t_ApodComponent_Title: string = "Title";
  t_ApodComponent_Explanation: string = "Explanation";
  t_ApodComponent_Date: string = "Date";
  t_ApodComponent_Copyright: string = "Copyright";

  constructor(private _firebaseAuthService: FirebaseAuthService, private _nasaService: NasaService, private _router: Router, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {
  
      // var p = this._firebaseAuthService.listenForAuthStateChanges();

      // p.then(user => {
      //   this.isLoggedIn = true;

      //   // Get data from Nasa service
      //   this._nasaService.getApod().subscribe(value => {this.apod = value; console.log(value)}, (err) => this.errorMessageApod = err);

      //   // Translations
      //   this.translate();

      // })
      // .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})
    
        this.isLoggedIn = true;

        // Get data from Nasa service
        this._nasaService.getApod().subscribe(value => {this.apod = value; console.log(value)}, (err) => this.errorMessageApod = err);

        // Translations
        this.translate();

    }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  this.t_ApodComponent_PanelTitle = this._translationsService.t_ApodComponent_PanelTitle;
                  this.t_ApodComponent_Title = this._translationsService.t_ApodComponent_Title;
                  this.t_ApodComponent_Explanation = this._translationsService.t_ApodComponent_Explanation;
                  this.t_ApodComponent_Date = this._translationsService.t_ApodComponent_Date;
                  this.t_ApodComponent_Copyright = this._translationsService.t_ApodComponent_Copyright;
              });
      } else {
                  this.t_ApodComponent_PanelTitle = this._translationsService.t_ApodComponent_PanelTitle;
                  this.t_ApodComponent_Title = this._translationsService.t_ApodComponent_Title;
                  this.t_ApodComponent_Explanation = this._translationsService.t_ApodComponent_Explanation;
                  this.t_ApodComponent_Date = this._translationsService.t_ApodComponent_Date;
                  this.t_ApodComponent_Copyright = this._translationsService.t_ApodComponent_Copyright;
      }

  }

}
