import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './shared/firebase.auth.service';
import { FirebaseDataService } from './shared/firebase.data.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IDataLocationsListModel } from './shared/data.locationslist.model';
import { IDataLocationMarkerModel } from './shared/data.locationmarker.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: any;

  // Variables for user settings
  lat: number = 0;
  lng: number = 0;

  // Variables for Google Maps
  zoom: number = 7;
  draggable: boolean = false;
  iconUrl: string = "assets/img/photo.png";

  // Other variables for location handling
  showLocationsAddedAlert: boolean = false;
  showLocationsUpdatedAlert: boolean = false;
  showLocationsDeletedAlert: boolean = false;
  locations: IDataLocationsListModel[] = [];
  selectedLocation: IDataLocationsListModel;
  mode: dataHandlingMode = dataHandlingMode.get;

  newLocationLocationLat: number = 0;
  newLocationLocationLng: number = 0;
  newLocationLocationSqm: number = 0;
  newLocationLocationCountry: string = "";
  newLocationLocationComment: string = "";
  newLocationLocationAddedByEmail: string = "";

  updatedLocationLocationLat: number = 0;
  updatedLocationLocationLng: number = 0;
  updatedLocationLocationSqm: number = 0;
  updatedLocationLocationCountry: string = "";
  updatedLocationLocationComment: string = "";
  updatedLocationLocationAddedByEmail: string = "";

  // Variables for translations
  t_LocationsComponent_PanelTitle: string = "Locations suitable for astronomy or astrophotography";
  t_LocationsComponent_MapTitle: string = "Click marker to get data or button to add new location";
  t_LocationsComponent_MapTitle_GetMode: string = "Click on marker to get data or button to add new location";
  t_LocationsComponent_MapTitle_AddMode: string = "Click on map to set coordinates of new location";
  t_LocationsComponent_MapTitle_EditMode: string = "Change data and click on button to save them";
  t_LocationsComponent_Latitude: string = "Latitude";
  t_LocationsComponent_Longitude: string = "Longitude";
  t_LocationsComponent_Sqm: string = "SQM";
  t_LocationsComponent_Country: string = "Country";
  t_LocationsComponent_Comment: string = "Comment";
  t_LocationsComponent_AddNewLocation: string = "Add new location...";
  t_LocationsComponent_Save: string = "Save";
  t_LocationsComponent_Cancel: string = "Cancel";
  t_LocationsComponent_Edit: string = "Edit";
  t_LocationsComponent_Delete: string = "Delete";
  t_LocationsComponent_AddedAlert: string = "New location was successfully added to database... Thank You!";
  t_LocationsComponent_UpdatedAlert: string = "Data for this location was successfully updated in database... Thank You!";
  t_LocationsComponent_DeletedAlert: string = "Location was successfully deleted from database... Thank You!";

  constructor(private _firebaseAuthService: FirebaseAuthService, private _firebaseDataService: FirebaseDataService, private _router: Router, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

      // var p = this._firebaseAuthService.listenForAuthStateChanges();

      // p.then(user => {
      //   this.isLoggedIn = true;
      //   this.currentUser = user;

      //   // Use user settings from service
      //   this.lat = this._userSettingsService.lat;
      //   this.lng = this._userSettingsService.lng;

      //   // Get all locations from data service
      //   this.locations = [];
      //   this._firebaseDataService.getAllLocations("locationcountry")
      //     .then(() => {
      //           this.locations = this._firebaseDataService.allLocations;
      //       });

      //   // Translations
      //   this.translate();

      // })
      // .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

        this.isLoggedIn = true;
        // this.currentUser = user;

        // Use user settings from service
        this.lat = this._userSettingsService.lat;
        this.lng = this._userSettingsService.lng;

        // Get all locations from data service
        this.locations = [];
        this._firebaseDataService.getAllLocations("locationcountry")
          .then(() => {
                this.locations = this._firebaseDataService.allLocations;
            });

        // Translations
        this.translate();

  }

  showLocationsUpdateAlert() {
    this.showLocationsUpdatedAlert = true;
    setTimeout(() => {
      this.showLocationsUpdatedAlert = false;
    }, 4000);
    
  }

  showLocationsAddAlert() {
    this.showLocationsAddedAlert = true;
    setTimeout(() => {
      this.showLocationsAddedAlert = false;
      this.mode = dataHandlingMode.get;
      this.t_LocationsComponent_MapTitle = this.t_LocationsComponent_MapTitle_GetMode;
    }, 4000);
    
  }

  showLocationsDeleteAlert() {
    this.showLocationsDeletedAlert = true;
    setTimeout(() => {
      this.showLocationsDeletedAlert = false;
      this.mode = dataHandlingMode.get;
      this.t_LocationsComponent_MapTitle = this.t_LocationsComponent_MapTitle_GetMode;
    }, 4000);
    
  }

  showLocationsUpdateExistingAlert() {
    this.showLocationsUpdatedAlert = true;
    setTimeout(() => {
      this.showLocationsUpdatedAlert = false;
      this.mode = dataHandlingMode.get;
      this.t_LocationsComponent_MapTitle = this.t_LocationsComponent_MapTitle_GetMode;
    }, 4000);
    
  }

  onLocationClick(location: IDataLocationsListModel, i: number) {
      if (this.mode === dataHandlingMode.get) {
        this.selectedLocation = location;
      }
  }

  onAddClick() {

        // Reset variables for adding new location
        this.newLocationLocationLat = 0;
        this.newLocationLocationLng = 0;
        this.newLocationLocationSqm = 0;
        this.newLocationLocationCountry = "";
        this.newLocationLocationComment = "";
        this.newLocationLocationAddedByEmail = "";

        // Reset mode to add and updata map title
        this.mode = dataHandlingMode.add;
        this.t_LocationsComponent_MapTitle = this.t_LocationsComponent_MapTitle_AddMode;
  }

  onEditClick() {

        if (this.selectedLocation) {

            // Set variables for updating existing location
            this.updatedLocationLocationLat = this.selectedLocation.locationmarker.markerlat;
            this.updatedLocationLocationLng = this.selectedLocation.locationmarker.markerlng;
            this.updatedLocationLocationSqm = this.selectedLocation.locationsqm;
            this.updatedLocationLocationCountry = this.selectedLocation.locationcountry;
            this.updatedLocationLocationComment = this.selectedLocation.locationcomment;
            this.updatedLocationLocationAddedByEmail = this.selectedLocation.locationaddedbyemail;

            // Reset mode to update and updata map title
            this.mode = dataHandlingMode.update;
            this.t_LocationsComponent_MapTitle = this.t_LocationsComponent_MapTitle_EditMode;

        }

  }

  onDeleteClick(locationKey) {

      // Delete location from database
      this._firebaseDataService.deleteLocation(locationKey)
        .then(() => {
            this._firebaseDataService.allLocations = [];
            this.locations = [];
            this._firebaseDataService.getAllLocations("locationcountry")
                .then(() => {
                        this.locations = this._firebaseDataService.allLocations;
                });
        })
        .catch(error => console.log(error));

      // Show user an success delete alert
      this.showLocationsDeleteAlert();

      // Don't select any particular location after deletion
      this.selectedLocation = null;

  }

  onSaveNewClick() {

      let newLocation: IDataLocationsListModel = {
          locationsqm: parseFloat(this.newLocationLocationSqm.toString().replace(",", ".")),
          locationcountry: this.newLocationLocationCountry,
          locationcomment: this.newLocationLocationComment,
          // locationaddedbyemail: this.currentUser.email,
          locationaddedbyemail: "",
          locationmarker: {
              markerlat: parseFloat(this.newLocationLocationLat.toString().replace(",", ".")),
              markerlng: parseFloat(this.newLocationLocationLng.toString().replace(",", "."))
          }
      }

      // Save new location to database and get back an object with a belonging database key
      this._firebaseDataService.addLocation(newLocation)
        .then(location => this.locations.push(location))
        .catch(error => console.log(error));

      // Show user an success save alert, go back to "get" mode and update map title (inside that call)
      this.showLocationsAddAlert();

      // Select this added location immediately
      this.selectedLocation = newLocation;

  }

  onUpdateExistingClick(locationKey: string) {

      let updatedLocation: IDataLocationsListModel = {
          locationsqm: parseFloat(this.updatedLocationLocationSqm.toString().replace(",", ".")),
          locationcountry: this.updatedLocationLocationCountry,
          locationcomment: this.updatedLocationLocationComment,
          // locationaddedbyemail: this.currentUser.email,
          locationaddedbyemail: "",
          locationmarker: {
              markerlat: parseFloat(this.updatedLocationLocationLat.toString().replace(",", ".")),
              markerlng: parseFloat(this.updatedLocationLocationLng.toString().replace(",", "."))
          }
      }

      // Update existing location in database
      this._firebaseDataService.updateLocation(locationKey, updatedLocation)
        .then((location) => {
            // Select this updated location immediately
            this.selectedLocation = updatedLocation;
            // Refresh data in data service to include changes in data also
            this._firebaseDataService.allLocations = [];
            this.locations = [];
            this._firebaseDataService.getAllLocations("locationcountry")
                .then(() => {
                        this.locations = this._firebaseDataService.allLocations;
                });
        })
        .catch(error => console.log(error));

      // Show user an success update alert, go back to "get" mode and update map title (inside that call)
      this.showLocationsUpdateExistingAlert();

  }

  onCancelSavingNewClick() {

        // Reset variables for adding new location
        this.newLocationLocationLat = 0;
        this.newLocationLocationLng = 0;
        this.newLocationLocationSqm = 0;
        this.newLocationLocationCountry = "";
        this.newLocationLocationComment = "";
        this.newLocationLocationAddedByEmail = "";

        // Reset mode to get and updata map title
        this.mode = dataHandlingMode.get;
        this.t_LocationsComponent_MapTitle = this.t_LocationsComponent_MapTitle_GetMode;

  }

  onCancelEditingExistingClick() {

        // Reset variables for updating existing location
        this.updatedLocationLocationLat = 0;
        this.updatedLocationLocationLng = 0;
        this.updatedLocationLocationSqm = 0;
        this.updatedLocationLocationCountry = "";
        this.updatedLocationLocationComment = "";
        this.updatedLocationLocationAddedByEmail = "";

        // Reset mode to get and updata map title
        this.mode = dataHandlingMode.get;
        this.t_LocationsComponent_MapTitle = this.t_LocationsComponent_MapTitle_GetMode;

  }

  onMapClick($event: any) {

      if (this.mode === dataHandlingMode.add) {
        // Mode is "add", update coordinates
        this.newLocationLocationLat = $event.coords.lat;
        this.newLocationLocationLng = $event.coords.lng;
      } 
      else if (this.mode === dataHandlingMode.update) {
        // Mode is "update", update coordinates
        this.updatedLocationLocationLat = $event.coords.lat;
        this.updatedLocationLocationLng = $event.coords.lng;
      } else {
        // Mode is "get" and user clicked on empty place on map, so don't select any particular location
        this.selectedLocation = null;
      }

  }

  translate() {

      if (this._translationsService.translationsSetToVariables === false) {
          this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
              .then(() => {
                  // Translations
                  this.t_LocationsComponent_PanelTitle = this._translationsService.t_LocationsComponent_PanelTitle;
                  this.t_LocationsComponent_MapTitle = this._translationsService.t_LocationsComponent_MapTitle;
                  this.t_LocationsComponent_MapTitle_GetMode = this._translationsService.t_LocationsComponent_MapTitle_GetMode;
                  this.t_LocationsComponent_MapTitle_AddMode = this._translationsService.t_LocationsComponent_MapTitle_AddMode;
                  this.t_LocationsComponent_MapTitle_EditMode = this._translationsService.t_LocationsComponent_MapTitle_EditMode;
                  this.t_LocationsComponent_Latitude = this._translationsService.t_LocationsComponent_Latitude;
                  this.t_LocationsComponent_Longitude = this._translationsService.t_LocationsComponent_Longitude;
                  this.t_LocationsComponent_Sqm = this._translationsService.t_LocationsComponent_Sqm;
                  this.t_LocationsComponent_Country = this._translationsService.t_LocationsComponent_Country;
                  this.t_LocationsComponent_Comment = this._translationsService.t_LocationsComponent_Comment;
                  this.t_LocationsComponent_AddNewLocation = this._translationsService.t_LocationsComponent_AddNewLocation;
                  this.t_LocationsComponent_Save = this._translationsService.t_LocationsComponent_Save;
                  this.t_LocationsComponent_Cancel = this._translationsService.t_LocationsComponent_Cancel;
                  this.t_LocationsComponent_Edit = this._translationsService.t_LocationsComponent_Edit;
                  this.t_LocationsComponent_Delete = this._translationsService.t_LocationsComponent_Delete;
                  this.t_LocationsComponent_AddedAlert = this._translationsService.t_LocationsComponent_AddedAlert;
                  this.t_LocationsComponent_UpdatedAlert = this._translationsService.t_LocationsComponent_UpdatedAlert;
                  this.t_LocationsComponent_DeletedAlert = this._translationsService.t_LocationsComponent_DeletedAlert;
              });
      } else {
                  // Translations
                  this.t_LocationsComponent_PanelTitle = this._translationsService.t_LocationsComponent_PanelTitle;
                  this.t_LocationsComponent_MapTitle = this._translationsService.t_LocationsComponent_MapTitle;
                  this.t_LocationsComponent_MapTitle_GetMode = this._translationsService.t_LocationsComponent_MapTitle_GetMode;
                  this.t_LocationsComponent_MapTitle_AddMode = this._translationsService.t_LocationsComponent_MapTitle_AddMode;
                  this.t_LocationsComponent_MapTitle_EditMode = this._translationsService.t_LocationsComponent_MapTitle_EditMode;
                  this.t_LocationsComponent_Latitude = this._translationsService.t_LocationsComponent_Latitude;
                  this.t_LocationsComponent_Longitude = this._translationsService.t_LocationsComponent_Longitude;
                  this.t_LocationsComponent_Sqm = this._translationsService.t_LocationsComponent_Sqm;
                  this.t_LocationsComponent_Country = this._translationsService.t_LocationsComponent_Country;
                  this.t_LocationsComponent_Comment = this._translationsService.t_LocationsComponent_Comment;
                  this.t_LocationsComponent_AddNewLocation = this._translationsService.t_LocationsComponent_AddNewLocation;
                  this.t_LocationsComponent_Save = this._translationsService.t_LocationsComponent_Save;
                  this.t_LocationsComponent_Cancel = this._translationsService.t_LocationsComponent_Cancel;
                  this.t_LocationsComponent_Edit = this._translationsService.t_LocationsComponent_Edit;
                  this.t_LocationsComponent_Delete = this._translationsService.t_LocationsComponent_Delete;
                  this.t_LocationsComponent_AddedAlert = this._translationsService.t_LocationsComponent_AddedAlert;
                  this.t_LocationsComponent_UpdatedAlert = this._translationsService.t_LocationsComponent_UpdatedAlert;
                  this.t_LocationsComponent_DeletedAlert = this._translationsService.t_LocationsComponent_DeletedAlert;
      }

  }

}

export enum dataHandlingMode {
    get = 0,
    add = 1,
    update = 2
}
