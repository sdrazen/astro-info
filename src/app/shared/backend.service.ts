import { Injectable } from '@angular/core';
import { IDataObjectListModel } from '../shared/data.objectlist.model';
import { IDataStoresListModel } from '../shared/data.storeslist.model';
import { IDataLocationsListModel } from '../shared/data.locationslist.model';
import { ISearchCriteriaModel } from '../shared/searchcriteria.model';
import { IDataMoonfeatureListModel } from '../shared/data.moonfeaturelist.model';
import { IDataSolarEclipseListModel } from '../shared/data.solareclipselist.model';
import { IDataLunarEclipseListModel } from '../shared/data.lunareclipselist.model';
import { ISearchCriteriaMoonfeaturesModel } from '../shared/searchcriteriamoonfeatures.model';
import { ISearchCriteriaSolarEclipsesModel } from '../shared/searchcriteriasolareclipses.model';
import { ISearchCriteriaLunarEclipsesModel } from '../shared/searchcriterialunareclipses.model';
import { CalculationsService } from '../shared/calculations.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from 'common/globals'
import { map } from 'rxjs';

@Injectable()
export class BackendService {

  allObjects: IDataObjectListModel[] = [];
  objects: IDataObjectListModel[] = [];
  filteredObjects: IDataObjectListModel[] = [];
  isInitialGet: boolean = true;
  object: IDataObjectListModel;
  allObjectTypes: Array<string> = [""];
  allConstellations: Array<string> = [""];

  allStores: IDataStoresListModel[] = [];
  stores: IDataStoresListModel[] = [];
  store: IDataStoresListModel;

  allLocations: IDataLocationsListModel[] = [];
  locations: IDataLocationsListModel[] = [];
  location: IDataLocationsListModel;

  allMoonfeatures: IDataMoonfeatureListModel[] = [];
  moonfeatures: IDataMoonfeatureListModel[] = [];
  filteredMoonfeatures: IDataMoonfeatureListModel[] = [];
  isInitialGetMoonfeatures: boolean = true;
  moonfeature: IDataMoonfeatureListModel;
  allMoonfeatureTypes: Array<string> = [""];
  allMoonfeatureApprovalStatusTexts: Array<string> = [""];

  allSolarEclipses: IDataSolarEclipseListModel[] = [];
  solarEclipses: IDataSolarEclipseListModel[] = [];
  filteredSolarEclipses: IDataSolarEclipseListModel[] = [];
  isInitialGetSolarEclipses: boolean = true;
  solarEclipse: IDataSolarEclipseListModel;

  allLunarEclipses: IDataLunarEclipseListModel[] = [];
  lunarEclipses: IDataLunarEclipseListModel[] = [];
  filteredLunarEclipses: IDataLunarEclipseListModel[] = [];
  isInitialGetLunarEclipses: boolean = true;
  lunarEclipse: IDataLunarEclipseListModel;

  constructor(private _http: HttpClient, private _calculationsService: CalculationsService) { }

  init() {

    // Data source changed, reset all data
    this.allObjects = [];
    this.objects = [];
    this.filteredObjects = [];
    this.isInitialGet = true;
    this.allObjectTypes = [""];
    this.allConstellations = [""];

    this.allStores = [];
    this.stores = [];

    this.allLocations = [];
    this.locations = [];

    this.allMoonfeatures = [];
    this.moonfeatures = [];
    this.filteredMoonfeatures = [];
    this.isInitialGetMoonfeatures = true;
    this.allMoonfeatureTypes = [""];
    this.allMoonfeatureApprovalStatusTexts = [""];

    this.allSolarEclipses = [];
    this.solarEclipses = [];
    this.filteredSolarEclipses = [];
    this.isInitialGetSolarEclipses = true;

    this.allLunarEclipses = [];
    this.lunarEclipses = [];
    this.filteredLunarEclipses = [];
    this.isInitialGetLunarEclipses = true;

  }

  getAllObjects(orderBy: string): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        if (this.allObjects.length === 0) {
          let dataFromMongoDb;
          this._http.get(Globals.MONGODB_API_URL + "/dsos").pipe(map(data => <IDataObjectListModel[]>data)).subscribe(arr => {
            dataFromMongoDb = arr;
            // Sort data
            dataFromMongoDb.sort(function (x, y) {
              let a = x[orderBy].toUpperCase(),
                b = y[orderBy].toUpperCase();
              return a == b ? 0 : a > b ? 1 : -1;
            });
            dataFromMongoDb.forEach(item => {
              var object;
              object = item;
              object["key"] = item["_id"];
              this.allObjects.push(object);
              // Types
              if (this.allObjectTypes.indexOf(object.type) === -1) {
                this.allObjectTypes.push(object.type);
              }
              // Constellations
              if (this.allConstellations.indexOf(object.constellation) === -1) {
                this.allConstellations.push(object.constellation);
              }
            })
            // Resolve
            resolve();
          }, (error) => { reject(error) });
        } else {
          resolve();
        }
      }

    })

    return p;

  }

  getObjects(pageIndex: number, itemsPerPage: number, allObjects: Array<IDataObjectListModel>, filteredObjects: Array<IDataObjectListModel>): Promise<any> {

    this.objects = [];

    let p = new Promise((resolve, reject) => {

      if (this.filteredObjects.length > 0) {
        this.objects = filteredObjects.filter((value, index, array) => {
          return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
        });

      } else {
        if (this.isInitialGet) {
          this.objects = allObjects.filter((value, index, array) => {
            return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
          });
        }
      }


      resolve(this.objects);

    })

    return p;

  }

  getObjectsBySearchCriteria(searchcriteria: ISearchCriteriaModel, itemsPerPage: number, allObjects: Array<IDataObjectListModel>): Promise<any> {

    this.objects = [];
    this.filteredObjects = [];

    let p = new Promise((resolve, reject) => {

      this.objects = allObjects.filter((value, index, array) => {

        let altAz: Array<number> = [];
        let altDMS: Array<number> = [];
        let azDMS: Array<number> = [];

        // If there is no criteria regarding object position (alt, az) at given time, don't calculate, otherwise do calculate
        if (
          (searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAltMin !== "") ||
          (searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAltMax !== "") ||
          (searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAzMin !== "") ||
          (searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAzMax !== "")
        ) {
          altAz = this.getObjectPosition(value.rightascension, value.declination, searchcriteria.criteriaLat, searchcriteria.criteriaLng, searchcriteria.criteriaTimeUt);
          altDMS = this._calculationsService.convertDegreesDecimalToDegreesMinutesSeconds(altAz[0]);
          azDMS = this._calculationsService.convertDegreesDecimalToDegreesMinutesSeconds(altAz[1]);
        }

        return (
          (
            (value.catalogueentry.toLowerCase().indexOf(searchcriteria.searchText.toLowerCase()) !== -1) ||
            (value.catalogueentry.toLowerCase().replace(" ", "").indexOf(searchcriteria.searchText.toLowerCase()) !== -1) ||
            (value.familiarname.toLowerCase().indexOf(searchcriteria.searchText.toLowerCase()) !== -1) ||
            (value.alternativeentries.toLowerCase().indexOf(searchcriteria.searchText.toLowerCase()) !== -1)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaType !== "") ? value.type.toLowerCase() === searchcriteria.criteriaType.toLowerCase() : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaConstellation !== "") ? value.constellation.toLowerCase() === searchcriteria.criteriaConstellation.toLowerCase() : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaMagnitudeMax !== "") ? parseFloat(value.magnitude) <= parseInt(searchcriteria.criteriaMagnitudeMax) : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaSizeMin !== "") ? this.isSizeGreaterOrEqualToValueInMinutes(value.size, parseInt(searchcriteria.criteriaSizeMin)) : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAltMin !== "") ? altDMS[0] >= parseInt(searchcriteria.criteriaAltMin) : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAltMax !== "") ? altDMS[0] <= parseInt(searchcriteria.criteriaAltMax) : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAzMin !== "") ? azDMS[0] >= parseInt(searchcriteria.criteriaAzMin) : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAzMax !== "") ? azDMS[0] <= parseInt(searchcriteria.criteriaAzMax) : true)
          )
        );
      });

      this.filteredObjects = this.objects;
      this.isInitialGet = false;

      // Resolve
      resolve(this.objects);

    })

    return p;

  }

  getAllStores(orderBy: string): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        if (this.allStores.length === 0) {
          let dataFromMongoDb;
          this._http.get(Globals.MONGODB_API_URL + "/stores").subscribe(data => {
            dataFromMongoDb = data;
            // Sort data
            dataFromMongoDb.sort(function (x, y) {
              let a = x[orderBy].toUpperCase(),
                b = y[orderBy].toUpperCase();
              return a == b ? 0 : a > b ? 1 : -1;
            });
            dataFromMongoDb.forEach(item => {
              var store;
              store = item;
              store["key"] = item["_id"];
              this.allStores.push(store);
            })
            // Resolve
            resolve();
          }, (error) => { reject(error) });
        } else {
          resolve();
        }
      }

    })

    return p;

  }

  addStore(store: IDataStoresListModel): Promise<any> {

    let p = new Promise((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this._http.post(Globals.MONGODB_API_URL + "/store", store, { headers: headers }).subscribe(item => {
          store["key"] = item["_id"];
          this.allStores.push(store);
          // Resolve
          resolve(store);
        }, err => reject(err))
      }

    })

    return p;

  }

  updateStore(storeKey: string, store: IDataStoresListModel): Promise<any> {

    let p = new Promise((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this._http.put(Globals.MONGODB_API_URL + "/store/" + storeKey, store, { headers: headers }).subscribe(item => {
          store["key"] = storeKey;
          // Resolve
          resolve(store);
        }, err => reject(err))
      }

    })

    return p;

  }

  deleteStore(storeKey: string): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        this._http.delete(Globals.MONGODB_API_URL + "/store/" + storeKey).subscribe(item => {
          // Resolve
          resolve();
        }, err => reject(err))
      }

    })

    return p;

  }

  getAllLocations(orderBy: string): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        if (this.allLocations.length === 0) {
          let dataFromMongoDb;
          this._http.get(Globals.MONGODB_API_URL + "/locations").subscribe(data => {
            dataFromMongoDb = data;
            // Sort data
            dataFromMongoDb.sort(function (x, y) {
              let a = x[orderBy].toUpperCase(),
                b = y[orderBy].toUpperCase();
              return a == b ? 0 : a > b ? 1 : -1;
            });
            dataFromMongoDb.forEach(item => {
              var location;
              location = item;
              location["key"] = item["_id"];
              this.allLocations.push(location);
            })
            // Resolve
            resolve();
          }, (error) => { reject(error) });
        } else {
          resolve();
        }
      }

    })

    return p;

  }

  addLocation(location: IDataLocationsListModel): Promise<any> {

    let p = new Promise((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this._http.post(Globals.MONGODB_API_URL + "/location", location, { headers: headers }).subscribe(item => {
          location["key"] = item["_id"];
          this.allLocations.push(location);
          // Resolve
          resolve(location);
        }, err => reject(err))
      }

    })

    return p;

  }

  updateLocation(locationKey: string, location: IDataLocationsListModel): Promise<any> {

    let p = new Promise((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this._http.put(Globals.MONGODB_API_URL + "/store/" + locationKey, location, { headers: headers }).subscribe(item => {
          location["key"] = locationKey;
          // Resolve
          resolve(location);
        }, err => reject(err))
      }

    })

    return p;

  }

  deleteLocation(locationKey: string): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        this._http.delete(Globals.MONGODB_API_URL + "/location/" + locationKey).subscribe(item => {
          // Resolve
          resolve();
        }, err => reject(err))
      }

    })

    return p;

  }

  isSizeGreaterOrEqualToValueInMinutes(sizeInMinutesAsString: string, valueInMinutes: number): boolean {

    let isOk: boolean = false;

    if (sizeInMinutesAsString.indexOf(" ") === -1) {
      // Size as string consists of just one part, so check last character
      if (sizeInMinutesAsString.slice(-1) === "??") {
        isOk = true;
      }
      else if (sizeInMinutesAsString.slice(-1) === "'") {
        parseFloat(sizeInMinutesAsString.slice(0, -1)) >= valueInMinutes ? isOk = true : isOk = false;
      }
      else if (sizeInMinutesAsString.slice(-1) === "s") {
        isOk = false;
      } else {
        isOk = false;
      }
    } else {
      // Size as string consists of more parts
      let parsedSize: Array<string> = sizeInMinutesAsString.split(" ");
      parsedSize.forEach(part => {
        if (part.slice(-1) === "??") {
          return true;
        }
        else if (part.slice(-1) === "'") {
          if (parseFloat(sizeInMinutesAsString.slice(0, -1)) >= valueInMinutes) {
            return true;
          }
        }
      })
    }

    return isOk;
  }

  getObjectPosition(ra: string, dec: string, lat: number, lng: number, timeUt: string): Array<number> {

    let RA: Array<string> = ra.replace("h", "").replace("'", "").replace("s", "").split(" ");
    let RA_H: number = parseInt(RA[0]);
    let RA_M: number = parseInt(RA[1]);
    let RA_S: number = parseInt(RA[2]);
    let DEC: Array<string> = dec.replace("??", "").replace("'", "").replace("s", "").split(" ");
    let DEC_D: number = parseInt(DEC[0]);
    let DEC_M: number = parseInt(DEC[1]);
    let DEC_S: number = parseInt(DEC[2]);
    let LAT: number = lat;
    let LON: number = lng;
    let time_ut = new Date(timeUt);
    let dd = time_ut.getDate();
    let mm = time_ut.getMonth() + 1;
    let yyyy = time_ut.getFullYear();
    let hh = time_ut.getHours();
    let min = time_ut.getMinutes();

    let altAz: Array<number> = [];
    let altDMS: Array<number> = [];
    let azDMS: Array<number> = [];

    altAz = this._calculationsService.getAltAz(
      this._calculationsService.convertToHours(RA_H, RA_M, RA_S),
      this._calculationsService.convertToDegreesDecimal(DEC_D, DEC_M, DEC_S),
      LAT,
      LON,
      yyyy,
      mm,
      dd,
      hh,
      min
    );

    return altAz;

  }

  getAllMoonfeatures(orderBy: string): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        if (this.allMoonfeatures.length === 0) {

          let dataFromMongoDb;

          // Part one
          let p_part_one = new Promise<void>((resolve, reject) => {
            this._http.get(Globals.MONGODB_API_URL + "/moonfeatures1").pipe(map(data => <IDataMoonfeatureListModel[]>data)).subscribe(arr => {
              dataFromMongoDb = arr;
              // Sort data
              dataFromMongoDb.sort(function (x, y) {
                let a = x[orderBy].toUpperCase(), b = y[orderBy].toUpperCase();
                return a == b ? 0 : a > b ? 1 : -1;
              });
              dataFromMongoDb.forEach(item => {
                var moonfeature;
                moonfeature = item;
                moonfeature["key"] = item["_id"];
                moonfeature["featuretypetext"] = item.featuretype.text;
                moonfeature["approvalstatustext"] = item.approvalstatus.text;
                this.allMoonfeatures.push(moonfeature);
                // Feature Types
                if (this.allMoonfeatureTypes.indexOf(moonfeature.featuretypetext) === -1) {
                  this.allMoonfeatureTypes.push(moonfeature.featuretypetext);
                }
                // Approval status texts
                if (this.allMoonfeatureApprovalStatusTexts.indexOf(moonfeature.approvalstatustext) === -1) {
                  this.allMoonfeatureApprovalStatusTexts.push(moonfeature.approvalstatustext);
                }
              })
              // Resolve
              resolve();
            }, (error) => { reject(error) });
          })

          // Part two
          let p_part_two = new Promise<void>((resolve, reject) => {
            this._http.get(Globals.MONGODB_API_URL + "/moonfeatures2").pipe(map(data => <IDataMoonfeatureListModel[]>data)).subscribe(arr => {
              dataFromMongoDb = arr;
              // Sort data
              dataFromMongoDb.sort(function (x, y) {
                let a = x[orderBy].toUpperCase(), b = y[orderBy].toUpperCase();
                return a == b ? 0 : a > b ? 1 : -1;
              });
              dataFromMongoDb.forEach(item => {
                var moonfeature;
                moonfeature = item;
                moonfeature["key"] = item["_id"];
                moonfeature["featuretypetext"] = item.featuretype.text;
                moonfeature["approvalstatustext"] = item.approvalstatus.text;
                this.allMoonfeatures.push(moonfeature);
                // Feature Types
                if (this.allMoonfeatureTypes.indexOf(moonfeature.featuretypetext) === -1) {
                  this.allMoonfeatureTypes.push(moonfeature.featuretypetext);
                }
                // Approval status texts
                if (this.allMoonfeatureApprovalStatusTexts.indexOf(moonfeature.approvalstatustext) === -1) {
                  this.allMoonfeatureApprovalStatusTexts.push(moonfeature.approvalstatustext);
                }
              })
              // Resolve
              resolve();
            }, (error) => { reject(error) });
          })

          p_part_one
            .then(() => {
              p_part_two
                .then(() => {
                  // Sort data
                  this.allMoonfeatures.sort(function (x, y) {
                    let a = x[orderBy].toUpperCase(), b = y[orderBy].toUpperCase();
                    return a == b ? 0 : a > b ? 1 : -1;
                  });
                  // Resolve
                  resolve();
                })
            })

        } else {
          resolve();
        }
      }

    })

    return p;

  }

  getMoonfeatures(pageIndex: number, itemsPerPage: number, allMoonfeatures: Array<IDataMoonfeatureListModel>, filteredMoonfeatures: Array<IDataMoonfeatureListModel>): Promise<any> {

    this.moonfeatures = [];

    let p = new Promise((resolve, reject) => {

      if (this.filteredMoonfeatures.length > 0) {
        this.moonfeatures = filteredMoonfeatures.filter((value, index, array) => {
          return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
        });

      } else {
        if (this.isInitialGetMoonfeatures) {
          this.moonfeatures = allMoonfeatures.filter((value, index, array) => {
            return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
          });
        }
      }


      resolve(this.moonfeatures);

    })

    return p;

  }

  getMoonfeaturesBySearchCriteria(searchcriteria: ISearchCriteriaMoonfeaturesModel, itemsPerPage: number, allMoonfeatures: Array<IDataMoonfeatureListModel>): Promise<any> {

    this.moonfeatures = [];
    this.filteredMoonfeatures = [];

    let p = new Promise((resolve, reject) => {

      this.moonfeatures = allMoonfeatures.filter((value, index, array) => {

        return (
          (
            (value.name.toLowerCase().indexOf(searchcriteria.searchText.toLowerCase()) !== -1) ||
            (value.origin.toLowerCase().replace(" ", "").indexOf(searchcriteria.searchText.toLowerCase()) !== -1)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaFeatureTypeText !== "") ? value.featuretypetext.toLowerCase() === searchcriteria.criteriaFeatureTypeText.toLowerCase() : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaApprovalStatusText !== "") ? value.approvalstatustext.toLowerCase() === searchcriteria.criteriaApprovalStatusText.toLowerCase() : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaDiameterMin !== "") ? parseFloat(value.diameter) >= parseInt(searchcriteria.criteriaDiameterMin) : true)
          ) && (
            ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaDiameterMax !== "") ? parseFloat(value.diameter) <= parseInt(searchcriteria.criteriaDiameterMax) : true)
          )
        );
      });

      this.filteredMoonfeatures = this.moonfeatures;
      this.isInitialGetMoonfeatures = false;

      // Resolve
      resolve(this.moonfeatures);

    })

    return p;

  }

  getAllSolarEclipses(): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        if (this.allSolarEclipses.length === 0) {
          let dataFromMongoDb;
          this._http.get(Globals.MONGODB_API_URL + "/solareclipses").subscribe(data => {
            dataFromMongoDb = data;
            dataFromMongoDb.forEach(item => {
              var solareclipse;
              solareclipse = item;
              solareclipse["key"] = item["_id"];
              solareclipse["url"] = "https://eclipse.gsfc.nasa.gov/SEplot/SEplot" + (parseInt(item.calendardate.substring(0, 4).toString()) <= 2050 ? "2001" : "2051") + "/" + "SE" + item.calendardate.replace(/ /g, "") + item.eclipsetype.substring(0, 1) + ".GIF";
              this.allSolarEclipses.push(solareclipse);
            })
            // Resolve
            resolve();
          }, (error) => { reject(error) });
        } else {
          resolve();
        }
      }

    })

    return p;

  }

  getSolarEclipses(pageIndex: number, itemsPerPage: number, allSolarEclipses: Array<IDataSolarEclipseListModel>, filteredSolarEclipses: Array<IDataSolarEclipseListModel>): Promise<any> {

    this.solarEclipses = [];

    let p = new Promise((resolve, reject) => {

      if (this.filteredSolarEclipses.length > 0) {
        this.solarEclipses = filteredSolarEclipses.filter((value, index, array) => {
          return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
        });

      } else {
        if (this.isInitialGetSolarEclipses) {
          this.solarEclipses = allSolarEclipses.filter((value, index, array) => {
            return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
          });
        }
      }


      resolve(this.solarEclipses);

    })

    return p;

  }

  getSolarEclipsesBySearchCriteria(searchcriteria: ISearchCriteriaSolarEclipsesModel, itemsPerPage: number, allSolarEclipses: Array<IDataSolarEclipseListModel>): Promise<any> {

    this.solarEclipses = [];
    this.filteredSolarEclipses = [];

    let p = new Promise((resolve, reject) => {

      this.solarEclipses = allSolarEclipses.filter((value, index, array) => {

        return (
          (
            (value.calendardate.toLowerCase().indexOf(searchcriteria.searchText.toLowerCase()) !== -1)
          )
        );
      });

      this.filteredSolarEclipses = this.solarEclipses;
      this.isInitialGetSolarEclipses = false;

      // Resolve
      resolve(this.solarEclipses);

    })

    return p;

  }

  getAllLunarEclipses(): Promise<any> {

    let p = new Promise<void>((resolve, reject) => {

      if (Globals.DATA_SOURCE == 0) {
        // MongoDb
        if (this.allLunarEclipses.length === 0) {
          let dataFromMongoDb;
          this._http.get(Globals.MONGODB_API_URL + "/lunareclipses").subscribe(data => {
            dataFromMongoDb = data;
            dataFromMongoDb.forEach(item => {
              var lunareclipse;
              lunareclipse = item;
              lunareclipse["key"] = item["_id"];
              lunareclipse["url"] = "https://eclipse.gsfc.nasa.gov/LEplot/LEplot" + (parseInt(item.calendardate.substring(0, 4).toString()) <= 2050 ? "2001" : "2051") + "/" + "LE" + item.calendardate.replace(/ /g, "") + item.eclipsetype.substring(0, 1) + ".pdf";
              this.allLunarEclipses.push(lunareclipse);
            })
            // Resolve
            resolve();
          }, (error) => { reject(error) });
        } else {
          resolve();
        }
      }

    })

    return p;

  }

  getLunarEclipses(pageIndex: number, itemsPerPage: number, allLunarEclipses: Array<IDataLunarEclipseListModel>, filteredLunarEclipses: Array<IDataLunarEclipseListModel>): Promise<any> {

    this.lunarEclipses = [];

    let p = new Promise((resolve, reject) => {

      if (this.filteredLunarEclipses.length > 0) {
        this.lunarEclipses = filteredLunarEclipses.filter((value, index, array) => {
          return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
        });

      } else {
        if (this.isInitialGetLunarEclipses) {
          this.lunarEclipses = allLunarEclipses.filter((value, index, array) => {
            return (index >= (pageIndex - 1) * itemsPerPage && index <= (pageIndex - 1) * itemsPerPage + itemsPerPage - 1);
          });
        }
      }


      resolve(this.lunarEclipses);

    })

    return p;

  }

  getLunarEclipsesBySearchCriteria(searchcriteria: ISearchCriteriaLunarEclipsesModel, itemsPerPage: number, allLunarEclipses: Array<IDataLunarEclipseListModel>): Promise<any> {

    this.lunarEclipses = [];
    this.filteredLunarEclipses = [];

    let p = new Promise((resolve, reject) => {

      this.lunarEclipses = allLunarEclipses.filter((value, index, array) => {

        return (
          (
            (value.calendardate.toLowerCase().indexOf(searchcriteria.searchText.toLowerCase()) !== -1)
          )
        );
      });

      this.filteredLunarEclipses = this.lunarEclipses;
      this.isInitialGetLunarEclipses = false;

      // Resolve
      resolve(this.lunarEclipses);

    })

    return p;

  }

}