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
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
declare var firebase: any;

@Injectable()
export class FirebaseDataService {

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

    constructor(private _http: Http, private _calculationsService: CalculationsService) { }

    getAllObjects(orderBy: string): Promise<any> {

        let p = new Promise ((resolve, reject) => {

            if (this.allObjects.length === 0) {
                firebase.database().ref('/dsos').orderByChild(orderBy).on('child_added', (snapshot) => {
                    var object;
                    object = snapshot.val();
                    object["key"] = snapshot.key;
                    this.allObjects.push(object);
                    // Types
                    if (this.allObjectTypes.indexOf(object.type) === -1) {
                        this.allObjectTypes.push(object.type);
                    }
                    // Constellations
                    if (this.allConstellations.indexOf(object.constellation) === -1) {
                        this.allConstellations.push(object.constellation);
                    }
                    // Resolve
                    resolve();
                })
            } else {
                resolve();
            }

        })

        return p;

    }

    getObjects(pageIndex: number, itemsPerPage: number, allObjects: Array<IDataObjectListModel>, filteredObjects: Array<IDataObjectListModel>): Promise<any> {

        this.objects = [];

        let p = new Promise ((resolve, reject) => {

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

    // getObjectByKey(key: number, allObjects: Array<IDataObjectListModel>): Promise<any> {

    //     this.objects = [];

    //     let p = new Promise ((resolve, reject) => {

    //         this.objects = allObjects.filter((value, index, array) => {
    //                             return (
    //                                 (parseInt(value.key) == key)
    //                             );
    //                         });

    //         resolve(this.objects);

    //     })

    //     return p;

    // }

    getObjectsBySearchCriteria(searchcriteria: ISearchCriteriaModel, itemsPerPage: number, allObjects: Array<IDataObjectListModel>): Promise<any> {

        this.objects = [];
        this.filteredObjects = [];

        let p = new Promise ((resolve, reject) => {

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
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaType !== "" ) ? value.type.toLowerCase() === searchcriteria.criteriaType.toLowerCase() : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaConstellation !== "" ) ? value.constellation.toLowerCase() === searchcriteria.criteriaConstellation.toLowerCase() : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaMagnitudeMax !== "" ) ? parseFloat(value.magnitude) <= parseInt(searchcriteria.criteriaMagnitudeMax) : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaSizeMin !== "" ) ? this.isSizeGreaterOrEqualToValueInMinutes(value.size, parseInt(searchcriteria.criteriaSizeMin)) : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAltMin !== "" ) ? altDMS[0] >= parseInt(searchcriteria.criteriaAltMin) : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAltMax !== "" ) ? altDMS[0] <= parseInt(searchcriteria.criteriaAltMax) : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAzMin !== "" ) ? azDMS[0] >= parseInt(searchcriteria.criteriaAzMin) : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaAzMax !== "" ) ? azDMS[0] <= parseInt(searchcriteria.criteriaAzMax) : true)
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

        let p = new Promise ((resolve, reject) => {

            if (this.allStores.length === 0) {
                firebase.database().ref('/stores').orderByChild(orderBy).on('child_added', (snapshot) => {
                    var store;
                    store = snapshot.val();
                    store["key"] = snapshot.key;
                    this.allStores.push(store);
                    resolve();
                })
            } else {
                resolve();
            }

        })

        return p;

    }

    addStore(store: IDataStoresListModel): Promise<any> {

        let p = new Promise((resolve, reject) => {

            firebase.database().ref('/stores').push(store)
                .then((snapshot) => {
                    store["key"] = snapshot.key;
                    this.allStores.push(store);
                    resolve(store);
                })
                .catch((error) => reject(error))
            })

        return p;

    }

    updateStore(storeKey: string, store: IDataStoresListModel): Promise<any> {

        let p = new Promise((resolve, reject) => {

            firebase.database().ref('/stores/' + storeKey).set(store)
                .then(() => {
                    store["key"] = storeKey;
                    resolve(store);
                })
                .catch((error) => reject(error))
            })

        return p;

    }

    deleteStore(storeKey: string): Promise<any> {

        let p = new Promise((resolve, reject) => {

            firebase.database().ref('/stores/' + storeKey).remove()
                .then(() => {
                    resolve();
                })
                .catch((error) => reject(error))
            })

        return p;

    }

    getAllLocations(orderBy: string): Promise<any> {

        let p = new Promise ((resolve, reject) => {

            if (this.allLocations.length === 0) {
                firebase.database().ref('/locations').orderByChild(orderBy).on('child_added', (snapshot) => {
                    var location;
                    location = snapshot.val();
                    location["key"] = snapshot.key;
                    this.allLocations.push(location);
                    resolve();
                })
            } else {
                resolve();
            }

        })

        return p;

    }

    addLocation(location: IDataLocationsListModel): Promise<any> {

        let p = new Promise((resolve, reject) => {

            firebase.database().ref('/locations').push(location)
                .then((snapshot) => {
                    location["key"] = snapshot.key;
                    this.allLocations.push(location);
                    resolve(location);
                })
                .catch((error) => reject(error))
            })

        return p;

    }

    updateLocation(locationKey: string, location: IDataLocationsListModel): Promise<any> {

        let p = new Promise((resolve, reject) => {

            firebase.database().ref('/locations/' + locationKey).set(location)
                .then(() => {
                    location["key"] = locationKey;
                    resolve(location);
                })
                .catch((error) => reject(error))
            })

        return p;

    }

    deleteLocation(locationKey: string): Promise<any> {

        let p = new Promise((resolve, reject) => {

            firebase.database().ref('/locations/' + locationKey).remove()
                .then(() => {
                    resolve();
                })
                .catch((error) => reject(error))
            })

        return p;

    }

    isSizeGreaterOrEqualToValueInMinutes(sizeInMinutesAsString: string, valueInMinutes: number): boolean {

        let isOk: boolean = false;

        if (sizeInMinutesAsString.indexOf(" ") === -1) {
            // Size as string consists of just one part, so check last character
            if (sizeInMinutesAsString.slice(-1) === "°") {
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
                if (part.slice(-1) === "°") {
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
        let DEC: Array<string> = dec.replace("°", "").replace("'", "").replace("s", "").split(" ");
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

        let p = new Promise ((resolve, reject) => {

            if (this.allMoonfeatures.length === 0) {
                firebase.database().ref('/moonfeatures').orderByChild(orderBy).on('child_added', (snapshot) => {
                    var moonfeature;
                    moonfeature = snapshot.val();
                    moonfeature["key"] = snapshot.key;
                    moonfeature["featuretypetext"] = snapshot.val().featuretype.text;
                    moonfeature["approvalstatustext"] = snapshot.val().approvalstatus.text;
                    this.allMoonfeatures.push(moonfeature);
                    // Feature Types
                    if (this.allMoonfeatureTypes.indexOf(moonfeature.featuretypetext) === -1) {
                        this.allMoonfeatureTypes.push(moonfeature.featuretypetext);
                    }
                    // Approval status texts
                    if (this.allMoonfeatureApprovalStatusTexts.indexOf(moonfeature.approvalstatustext) === -1) {
                        this.allMoonfeatureApprovalStatusTexts.push(moonfeature.approvalstatustext);
                    }
                    // Resolve
                    resolve();
                })
            } else {
                resolve();
            }

        })

        return p;

    }

    getMoonfeatures(pageIndex: number, itemsPerPage: number, allMoonfeatures: Array<IDataMoonfeatureListModel>, filteredMoonfeatures: Array<IDataMoonfeatureListModel>): Promise<any> {

        this.moonfeatures = [];

        let p = new Promise ((resolve, reject) => {

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

        let p = new Promise ((resolve, reject) => {

            this.moonfeatures = allMoonfeatures.filter((value, index, array) => {

                                return (
                                    (
                                        (value.name.toLowerCase().indexOf(searchcriteria.searchText.toLowerCase()) !== -1) ||
                                        (value.origin.toLowerCase().replace(" ", "").indexOf(searchcriteria.searchText.toLowerCase()) !== -1)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaFeatureTypeText !== "" ) ? value.featuretypetext.toLowerCase() === searchcriteria.criteriaFeatureTypeText.toLowerCase() : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaApprovalStatusText !== "" ) ? value.approvalstatustext.toLowerCase() === searchcriteria.criteriaApprovalStatusText.toLowerCase() : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaDiameterMin !== "" ) ? parseFloat(value.diameter) >= parseInt(searchcriteria.criteriaDiameterMin) : true)
                                    ) && (
                                        ((searchcriteria.useAdditionalCriteria && searchcriteria.criteriaDiameterMax !== "" ) ? parseFloat(value.diameter) <= parseInt(searchcriteria.criteriaDiameterMax) : true)
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

        let p = new Promise ((resolve, reject) => {

            if (this.allSolarEclipses.length === 0) {
                firebase.database().ref('/solareclipses').orderByKey().on('child_added', (snapshot) => {
                    var solareclipse;
                    solareclipse = snapshot.val();
                    solareclipse["key"] = snapshot.key;
                    solareclipse["url"] = "https://eclipse.gsfc.nasa.gov/SEplot/SEplot" + (parseInt(snapshot.val().calendardate.substring(0, 4).toString()) <= 2050 ? "2001" : "2051") + "/" + "SE" + snapshot.val().calendardate.replace(/ /g, "") + snapshot.val().eclipsetype.substring(0, 1) + ".GIF";
                    this.allSolarEclipses.push(solareclipse);
                    // Resolve
                    resolve();
                })
            } else {
                resolve();
            }

        })

        return p;

    }

    getSolarEclipses(pageIndex: number, itemsPerPage: number, allSolarEclipses: Array<IDataSolarEclipseListModel>, filteredSolarEclipses: Array<IDataSolarEclipseListModel>): Promise<any> {

        this.solarEclipses = [];

        let p = new Promise ((resolve, reject) => {

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

        let p = new Promise ((resolve, reject) => {

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

        let p = new Promise ((resolve, reject) => {

            if (this.allLunarEclipses.length === 0) {
                firebase.database().ref('/lunareclipses').orderByKey().on('child_added', (snapshot) => {
                    var lunareclipse;
                    lunareclipse = snapshot.val();
                    lunareclipse["key"] = snapshot.key;
                    lunareclipse["url"] = "https://eclipse.gsfc.nasa.gov/LEplot/LEplot" + (parseInt(snapshot.val().calendardate.substring(0, 4).toString()) <= 2050 ? "2001" : "2051") + "/" + "LE" + snapshot.val().calendardate.replace(/ /g, "") + snapshot.val().eclipsetype.substring(0, 1) + ".pdf";
                    this.allLunarEclipses.push(lunareclipse);
                    // Resolve
                    resolve();
                })
            } else {
                resolve();
            }

        })

        return p;

    }

    getLunarEclipses(pageIndex: number, itemsPerPage: number, allLunarEclipses: Array<IDataLunarEclipseListModel>, filteredLunarEclipses: Array<IDataLunarEclipseListModel>): Promise<any> {

        this.lunarEclipses = [];

        let p = new Promise ((resolve, reject) => {

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

        let p = new Promise ((resolve, reject) => {

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