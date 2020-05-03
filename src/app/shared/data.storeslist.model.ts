import { IDataStoreMarkerModel } from './data.storemarker.model';

export interface IDataStoresListModel {
    storename: string,
    storeaddress: string,
    storecity: string,
    storepostalcode: string;
    storecountry: string,
    storecomment: string,
    storemarker: IDataStoreMarkerModel,
    storeaddedbyemail: string
}
