import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { Router } from '@angular/router';
declare var firebase: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    isLoggedIn: boolean;
    errorMessage: string = '';

    // Variables for translations
    languageId: number = 0;
    t_LoginComponent_Title: string = "Get started with AstroInfo";
    t_LoginComponent_Subtitle: string = "...and access information about deep sky objects from various resources";

    constructor(private _firebaseAuthService: FirebaseAuthService, private _router: Router, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

    ngOnInit() {

        var p = this._firebaseAuthService.listenForAuthStateChanges();

        p.then(user => {
            this.isLoggedIn = true;
            this.errorMessage = '';

            // Use user settings from service
            this.languageId = this._userSettingsService.languageId;

            // Translations
            this.translate();
        })
        .catch(value => {
            this.isLoggedIn = false;

            // Use user settings from service
            this.languageId = this._userSettingsService.languageId;

            // Translations
            this.translate();
        })
    }

    userGoogleSignIn() {
        if (this.isLoggedIn == false) {
            var p = this._firebaseAuthService.userGoogleSignIn()

            p.then(value => {
                this.isLoggedIn = true;
                this._router.navigate (['welcome']);
                this.errorMessage = '';
            })
            .catch(error => {this.isLoggedIn = false; this.errorMessage = error});
        }
    }

    userFacebookSignIn() {
        if (this.isLoggedIn == false) {
            var p = this._firebaseAuthService.userFacebookSignIn()

            p.then(value => {
                this.isLoggedIn = true;
                this._router.navigate (['welcome']);
                this.errorMessage = '';
            })
            .catch(error => {this.isLoggedIn = false; this.errorMessage = error});
        }
    }

    userGithubSignIn() {
        if (this.isLoggedIn == false) {
            var p = this._firebaseAuthService.userGithubSignIn()

            p.then(value => {
                this.isLoggedIn = true;
                this._router.navigate (['welcome']);
                this.errorMessage = '';
            })
            .catch(error => {this.isLoggedIn = false; this.errorMessage = error});
        }
    }

    userSignOut() {
        if (this.isLoggedIn == true) {
            this._firebaseAuthService.userSignOut();
            this.isLoggedIn = false;
        }
    }

    translate() {
        if (this._translationsService.translationsSetToVariables === false) {
            this._translationsService.setTranslationsForLanguage(this.languageId)
                .then(() => {
                    this.t_LoginComponent_Title = this._translationsService.t_LoginComponent_Title;
                    this.t_LoginComponent_Subtitle = this._translationsService.t_LoginComponent_Subtitle;
                });
        } else {
                    this.t_LoginComponent_Title = this._translationsService.t_LoginComponent_Title;
                    this.t_LoginComponent_Subtitle = this._translationsService.t_LoginComponent_Subtitle;
        }

    }

}