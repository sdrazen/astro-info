import { IDataLocationMarkerModel } from './data.locationmarker.model';

export interface IDataLocationsListModel {
    locationsqm: number,
    locationcountry: string,
    locationcomment: string,
    locationmarker: IDataLocationMarkerModel,
    locationaddedbyemail: string
}
