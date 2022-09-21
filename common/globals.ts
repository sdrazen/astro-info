export class Globals {

  /////////////////////////////////
  // Global constants and variables
  /////////////////////////////////

  // Data source (this setting can be changed dynamically - user settings)
  static DATA_SOURCE: number = 0; // 0 = Firebase, 1 = MongoDb

  // Firebase specific
  public static FIREBASE_API_URL: string = "";
  public static FIREBASE_LOCATION: string = "Google Cloud";
  public static FIREBASE_CALLED_FROM: string = "backend service";

  // MongoDb specific
  public static MONGODB_API_URL: string = "https://astro-info-backend.vercel.app/api";
  public static MONGODB_LOCATION: string = "Atlas";
  public static MONGODB_CALLED_FROM: string = "Vercel";

  // API keys
  public static FLICKR_API_KEY: string = "a3d7ab8d127095d544d1ab29021a37e1";
  public static GOOGLE_MAPS_API_KEY: string = "AIzaSyBlM8kxAViRQPXkTLsGLHm6VYQdP4GwUgg";
  public static NASA_API_KEY: string = "BE2zFFfjKg71NIoVQ8nUN5p1LBL7tEJwPelittw3";
  public static WEATHER_API_KEY: string = "PxWpcAA5uQrAL3k14SCYCU7pTvAIx03v";

}