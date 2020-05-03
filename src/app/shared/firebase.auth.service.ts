import { Injectable } from '@angular/core';
declare var firebase: any;

@Injectable()
export class FirebaseAuthService {

    isLoggedIn: boolean = false;

    constructor() { }

    listenForAuthStateChanges(): Promise<any> {

        let p = new Promise((resolve, reject) => {

            firebase.auth().onAuthStateChanged((user) => {
                if (user != null) {
                    this.isLoggedIn = true;
                    resolve(user);
                } else {
                    this.isLoggedIn = false;
                    reject(false);
                }
            })
        });

    return p

    }

    userGoogleSignIn(): Promise<any> {

        let p = new Promise(function(resolve, reject) {

            var provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(u => {resolve(true)})
                .catch(e => {
                        reject (e.message);
                });           
            });

        return p

    }

    userFacebookSignIn(): Promise<any> {

        let p = new Promise(function(resolve, reject) {

            var provider = new firebase.auth.FacebookAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(u => {resolve(true)})
                .catch(e => {
                        reject (e.message);
                });           
            });

        return p

    }

    userGithubSignIn(): Promise<any> {

        let p = new Promise(function(resolve, reject) {

            var provider = new firebase.auth.GithubAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(u => {resolve(true)})
                .catch(e => {
                        reject (e.message);
                });           
            });

        return p

    }

    userSignOut() {
        firebase.auth().signOut();
    }

}