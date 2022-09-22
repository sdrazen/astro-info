import { Component, OnInit } from '@angular/core';
import { BackendService } from './shared/backend.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { IDataStoresListModel } from './shared/data.storeslist.model';
@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  isLoggedIn: boolean;
  currentUser: any;

  // Variables for user settings
  lat: number = 0;
  lng: number = 0;

  // Variables for Google Maps
  zoom: number = 7;
  draggable: boolean = false;
  iconUrl: string = "assets/img/shopping.png";

  // Other variables for store handling
  showStoresAddedAlert: boolean = false;
  showStoresUpdatedAlert: boolean = false;
  showStoresDeletedAlert: boolean = false;
  stores: IDataStoresListModel[] = [];
  selectedStore: IDataStoresListModel;
  mode: dataHandlingMode = dataHandlingMode.get;

  newStoreStoreLat: number = 0;
  newStoreStoreLng: number = 0;
  newStoreStoreName: string = "";
  newStoreStoreAddress: string = "";
  newStoreStoreCity: string = "";
  newStoreStorePostalCode: string = "";
  newStoreStoreCountry: string = "";
  newStoreStoreComment: string = "";
  newStoreStoreAddedByEmail: string = "";

  updatedStoreStoreLat: number = 0;
  updatedStoreStoreLng: number = 0;
  updatedStoreStoreName: string = "";
  updatedStoreStoreAddress: string = "";
  updatedStoreStoreCity: string = "";
  updatedStoreStorePostalCode: string = "";
  updatedStoreStoreCountry: string = "";
  updatedStoreStoreComment: string = "";
  updatedStoreStoreAddedByEmail: string = "";

  // Variables for translations
  t_StoresComponent_PanelTitle: string = "Stores with astronomy equippment";
  t_StoresComponent_MapTitle: string = "Click marker to get data or button to add new store";
  t_StoresComponent_MapTitle_GetMode: string = "Click on marker to get data or button to add new store";
  t_StoresComponent_MapTitle_AddMode: string = "Click on map to set location of new store";
  t_StoresComponent_MapTitle_EditMode: string = "Change data and click on button to save them";
  t_StoresComponent_Latitude: string = "Latitude";
  t_StoresComponent_Longitude: string = "Longitude";
  t_StoresComponent_Name: string = "Name";
  t_StoresComponent_Address: string = "Address";
  t_StoresComponent_City: string = "City";
  t_StoresComponent_PostalCode: string = "Postal code";
  t_StoresComponent_Country: string = "Country";
  t_StoresComponent_Comment: string = "Comment";
  t_StoresComponent_AddNewStore: string = "Add new store...";
  t_StoresComponent_Save: string = "Save";
  t_StoresComponent_Cancel: string = "Cancel";
  t_StoresComponent_Edit: string = "Edit";
  t_StoresComponent_Delete: string = "Delete";
  t_StoresComponent_AddedAlert: string = "New store was successfully added to database... Thank You!";
  t_StoresComponent_UpdatedAlert: string = "Data for this store was successfully updated in database... Thank You!";
  t_StoresComponent_DeletedAlert: string = "Store was successfully deleted from database... Thank You!";

  constructor(private _backendService: BackendService, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // Use user settings from service
    this.lat = this._userSettingsService.lat;
    this.lng = this._userSettingsService.lng;

    // Get all stores from data service
    this.stores = [];
    this._backendService.getAllStores("storecountry")
      .then(() => {
        this.stores = this._backendService.allStores;
      })
      .catch(error => console.log(error));

    // Translations
    this.translate();


  }

  showStoresUpdateAlert() {
    this.showStoresUpdatedAlert = true;
    setTimeout(() => {
      this.showStoresUpdatedAlert = false;
    }, 4000);

  }

  showStoresAddAlert() {
    this.showStoresAddedAlert = true;
    setTimeout(() => {
      this.showStoresAddedAlert = false;
      this.mode = dataHandlingMode.get;
      this.t_StoresComponent_MapTitle = this.t_StoresComponent_MapTitle_GetMode;
    }, 4000);

  }

  showStoresDeleteAlert() {
    this.showStoresDeletedAlert = true;
    setTimeout(() => {
      this.showStoresDeletedAlert = false;
      this.mode = dataHandlingMode.get;
      this.t_StoresComponent_MapTitle = this.t_StoresComponent_MapTitle_GetMode;
    }, 4000);

  }

  showStoresUpdateExistingAlert() {
    this.showStoresUpdatedAlert = true;
    setTimeout(() => {
      this.showStoresUpdatedAlert = false;
      this.mode = dataHandlingMode.get;
      this.t_StoresComponent_MapTitle = this.t_StoresComponent_MapTitle_GetMode;
    }, 4000);

  }

  onStoreClick(store: IDataStoresListModel, i: number) {
    if (this.mode === dataHandlingMode.get) {
      this.selectedStore = store;
    }
  }

  onAddClick() {

    // Reset variables for adding new store
    this.newStoreStoreLat = 0;
    this.newStoreStoreLng = 0;
    this.newStoreStoreName = "";
    this.newStoreStoreAddress = "";
    this.newStoreStoreCity = "";
    this.newStoreStorePostalCode = "";
    this.newStoreStoreCountry = "";
    this.newStoreStoreComment = "";
    this.newStoreStoreAddedByEmail = "";

    // Reset mode to add and updata map title
    this.mode = dataHandlingMode.add;
    this.t_StoresComponent_MapTitle = this.t_StoresComponent_MapTitle_AddMode;
  }

  onEditClick() {

    if (this.selectedStore) {

      // Set variables for updating existing store
      this.updatedStoreStoreLat = this.selectedStore.storemarker.markerlat;
      this.updatedStoreStoreLng = this.selectedStore.storemarker.markerlng;
      this.updatedStoreStoreName = this.selectedStore.storename;
      this.updatedStoreStoreAddress = this.selectedStore.storeaddress;
      this.updatedStoreStoreCity = this.selectedStore.storecity;
      this.updatedStoreStorePostalCode = this.selectedStore.storepostalcode;
      this.updatedStoreStoreCountry = this.selectedStore.storecountry;
      this.updatedStoreStoreComment = this.selectedStore.storecomment;
      this.updatedStoreStoreAddedByEmail = this.selectedStore.storeaddedbyemail;

      // Reset mode to update and updata map title
      this.mode = dataHandlingMode.update;
      this.t_StoresComponent_MapTitle = this.t_StoresComponent_MapTitle_EditMode;

    }

  }

  onDeleteClick(storeKey) {

    // Delete store from database
    this._backendService.deleteStore(storeKey)
      .then(() => {
        this._backendService.allStores = [];
        this.stores = [];
        this._backendService.getAllStores("storecountry")
          .then(() => {
            this.stores = this._backendService.allStores;
          });
      })
      .catch(error => console.log(error));

    // Show user an success delete alert
    this.showStoresDeleteAlert();

    // Don't select any particular store after deletion
    this.selectedStore = null;

  }

  onSaveNewClick() {

    let newStore: IDataStoresListModel = {
      storename: this.newStoreStoreName,
      storeaddress: this.newStoreStoreAddress,
      storecity: this.newStoreStoreCity,
      storepostalcode: this.newStoreStorePostalCode,
      storecountry: this.newStoreStoreCountry,
      storecomment: this.newStoreStoreComment,
      // storeaddedbyemail: this.currentUser.email,
      storeaddedbyemail: "",
      storemarker: {
        markerlat: parseFloat(this.newStoreStoreLat.toString().replace(",", ".")),
        markerlng: parseFloat(this.newStoreStoreLng.toString().replace(",", "."))
      }
    }

    // Save new store to database and get back an object with a belonging database key
    this._backendService.addStore(newStore)
      .then(store => this.stores.push(store))
      .catch(error => console.log(error));

    // Show user an success save alert, go back to "get" mode and update map title (inside that call)
    this.showStoresAddAlert();

    // Select this added store immediately
    this.selectedStore = newStore;

  }

  onUpdateExistingClick(storeKey: string) {

    let updatedStore: IDataStoresListModel = {
      storename: this.updatedStoreStoreName,
      storeaddress: this.updatedStoreStoreAddress,
      storecity: this.updatedStoreStoreCity,
      storepostalcode: this.updatedStoreStorePostalCode,
      storecountry: this.updatedStoreStoreCountry,
      storecomment: this.updatedStoreStoreComment,
      // storeaddedbyemail: this.currentUser.email,
      storeaddedbyemail: "",
      storemarker: {
        markerlat: parseFloat(this.updatedStoreStoreLat.toString().replace(",", ".")),
        markerlng: parseFloat(this.updatedStoreStoreLng.toString().replace(",", "."))
      }
    }

    // Update existing store in database
    this._backendService.updateStore(storeKey, updatedStore)
      .then((store) => {
        // Select this updated store immediately
        this.selectedStore = updatedStore;
        // Refresh data in data service to include changes in data also
        this._backendService.allStores = [];
        this.stores = [];
        this._backendService.getAllStores("storecountry")
          .then(() => {
            this.stores = this._backendService.allStores;
          });
      })
      .catch(error => console.log(error));

    // Show user an success update alert, go back to "get" mode and update map title (inside that call)
    this.showStoresUpdateExistingAlert();

  }

  onCancelSavingNewClick() {

    // Reset variables for adding new store
    this.newStoreStoreLat = 0;
    this.newStoreStoreLng = 0;
    this.newStoreStoreName = "";
    this.newStoreStoreAddress = "";
    this.newStoreStoreCity = "";
    this.newStoreStorePostalCode = "";
    this.newStoreStoreCountry = "";
    this.newStoreStoreComment = "";
    this.newStoreStoreAddedByEmail = "";

    // Reset mode to get and updata map title
    this.mode = dataHandlingMode.get;
    this.t_StoresComponent_MapTitle = this.t_StoresComponent_MapTitle_GetMode;

  }

  onCancelEditingExistingClick() {

    // Reset variables for updating existing store
    this.updatedStoreStoreLat = 0;
    this.updatedStoreStoreLng = 0;
    this.updatedStoreStoreName = "";
    this.updatedStoreStoreAddress = "";
    this.updatedStoreStoreCity = "";
    this.updatedStoreStorePostalCode = "";
    this.updatedStoreStoreCountry = "";
    this.updatedStoreStoreComment = "";
    this.updatedStoreStoreAddedByEmail = "";

    // Reset mode to get and updata map title
    this.mode = dataHandlingMode.get;
    this.t_StoresComponent_MapTitle = this.t_StoresComponent_MapTitle_GetMode;

  }

  onMapClick($event: google.maps.MapMouseEvent) {

    if (this.mode === dataHandlingMode.add) {
      // Mode is "add", update coordinates
      this.newStoreStoreLat = $event.latLng.lat();
      this.newStoreStoreLng = $event.latLng.lng();
    }
    else if (this.mode === dataHandlingMode.update) {
      // Mode is "update", update coordinates
      this.updatedStoreStoreLat = $event.latLng.lat();
      this.updatedStoreStoreLng = $event.latLng.lng();
    } else {
      // Mode is "get" and user clicked on empty place on map, so don't select any particular store
      this.selectedStore = null;
    }

  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          // Translations
          this.t_StoresComponent_PanelTitle = this._translationsService.t_StoresComponent_PanelTitle;
          this.t_StoresComponent_MapTitle = this._translationsService.t_StoresComponent_MapTitle;
          this.t_StoresComponent_MapTitle_GetMode = this._translationsService.t_StoresComponent_MapTitle_GetMode;
          this.t_StoresComponent_MapTitle_AddMode = this._translationsService.t_StoresComponent_MapTitle_AddMode;
          this.t_StoresComponent_MapTitle_EditMode = this._translationsService.t_StoresComponent_MapTitle_EditMode;
          this.t_StoresComponent_Latitude = this._translationsService.t_StoresComponent_Latitude;
          this.t_StoresComponent_Longitude = this._translationsService.t_StoresComponent_Longitude;
          this.t_StoresComponent_Name = this._translationsService.t_StoresComponent_Name;
          this.t_StoresComponent_Address = this._translationsService.t_StoresComponent_Address;
          this.t_StoresComponent_City = this._translationsService.t_StoresComponent_City;
          this.t_StoresComponent_PostalCode = this._translationsService.t_StoresComponent_PostalCode;
          this.t_StoresComponent_Country = this._translationsService.t_StoresComponent_Country;
          this.t_StoresComponent_Comment = this._translationsService.t_StoresComponent_Comment;
          this.t_StoresComponent_AddNewStore = this._translationsService.t_StoresComponent_AddNewStore;
          this.t_StoresComponent_Save = this._translationsService.t_StoresComponent_Save;
          this.t_StoresComponent_Cancel = this._translationsService.t_StoresComponent_Cancel;
          this.t_StoresComponent_Edit = this._translationsService.t_StoresComponent_Edit;
          this.t_StoresComponent_Delete = this._translationsService.t_StoresComponent_Delete;
          this.t_StoresComponent_AddedAlert = this._translationsService.t_StoresComponent_AddedAlert;
          this.t_StoresComponent_UpdatedAlert = this._translationsService.t_StoresComponent_UpdatedAlert;
          this.t_StoresComponent_DeletedAlert = this._translationsService.t_StoresComponent_DeletedAlert;
        });
    } else {
      // Translations
      this.t_StoresComponent_PanelTitle = this._translationsService.t_StoresComponent_PanelTitle;
      this.t_StoresComponent_MapTitle = this._translationsService.t_StoresComponent_MapTitle;
      this.t_StoresComponent_MapTitle_GetMode = this._translationsService.t_StoresComponent_MapTitle_GetMode;
      this.t_StoresComponent_MapTitle_AddMode = this._translationsService.t_StoresComponent_MapTitle_AddMode;
      this.t_StoresComponent_MapTitle_EditMode = this._translationsService.t_StoresComponent_MapTitle_EditMode;
      this.t_StoresComponent_Latitude = this._translationsService.t_StoresComponent_Latitude;
      this.t_StoresComponent_Longitude = this._translationsService.t_StoresComponent_Longitude;
      this.t_StoresComponent_Name = this._translationsService.t_StoresComponent_Name;
      this.t_StoresComponent_Address = this._translationsService.t_StoresComponent_Address;
      this.t_StoresComponent_City = this._translationsService.t_StoresComponent_City;
      this.t_StoresComponent_PostalCode = this._translationsService.t_StoresComponent_PostalCode;
      this.t_StoresComponent_Country = this._translationsService.t_StoresComponent_Country;
      this.t_StoresComponent_Comment = this._translationsService.t_StoresComponent_Comment;
      this.t_StoresComponent_AddNewStore = this._translationsService.t_StoresComponent_AddNewStore;
      this.t_StoresComponent_Save = this._translationsService.t_StoresComponent_Save;
      this.t_StoresComponent_Cancel = this._translationsService.t_StoresComponent_Cancel;
      this.t_StoresComponent_Edit = this._translationsService.t_StoresComponent_Edit;
      this.t_StoresComponent_Delete = this._translationsService.t_StoresComponent_Delete;
      this.t_StoresComponent_AddedAlert = this._translationsService.t_StoresComponent_AddedAlert;
      this.t_StoresComponent_UpdatedAlert = this._translationsService.t_StoresComponent_UpdatedAlert;
      this.t_StoresComponent_DeletedAlert = this._translationsService.t_StoresComponent_DeletedAlert;
    }

  }

}

export enum dataHandlingMode {
  get = 0,
  add = 1,
  update = 2
}

