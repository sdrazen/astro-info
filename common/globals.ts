import { environment } from "../src/environments/environment";
export class Globals {

  /////////////////////////////////
  // Global constants and variables
  /////////////////////////////////

  // Data source (this setting can be changed dynamically - user settings)
  static DATA_SOURCE: number = 0; // 0 = Firebase, 1 = MongoDb
  static API_SOURCE: number = 1; // 0 = frontend, 1 = backend

  // Firebase specific
  public static FIREBASE_API_URL: string = "";
  public static FIREBASE_LOCATION: string = "Google Cloud";
  public static FIREBASE_CALLED_FROM: string = "frontend";

  // MongoDb specific
  public static MONGODB_API_URL: string = "https://astro-info-backend.vercel.app/api/mongodb";
  public static MONGODB_LOCATION: string = "Atlas";
  public static MONGODB_CALLED_FROM: string = "Vercel";

  // If you want to use MongoDb in your own local environment and maybe even develop your own backend
  // with some other databases for astro-info app, you can use setting like this. Database can be easily
  // recreated. It consists of 6 collections (tables) and all data can be found in /assets/data folder in
  // JSON format (which is more than suitable for creating your own MongoDb database and api endpoints to
  // play with).
  // *
  // public static MONGODB_API_URL: string = "http://localhost:8080/api/mongodb";
  // public static MONGODB_LOCATION: string = "Atlas";
  // public static MONGODB_CALLED_FROM: string = "localhost";

  // API keys - if something happens to the backend for any reason, this app can also work
  // on its own, without the backend. Database from firebase, api calls from frontend. This
  // is controlled by the API_SOURCE variable (above) which can be also set from the app in
  // user settings. In case of the need to switch api calls to frontend, user just needs to
  // here set his own API keys for Google Maps (Timezone), Flickr and NASA. By default user
  // does have to use any API keys as API calls go from backend in normal circumstances.
  // *
  // public static GOOGLE_MAPS_API_KEY: string = "YOUR-GOOGLE-MAPS-API-KEY";
  // public static FLICKR_API_KEY: string = "YOUR-FLICKR-API-KEY";
  // public static NASA_API_KEY: string = "YOUR-NASA-API-KEY";

}