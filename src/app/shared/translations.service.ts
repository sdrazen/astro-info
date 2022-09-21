import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable()
export class TranslationsService {

  // General language info
  languageId: number = 0;
  languageidentifier: string = "";
  languagetitle: string = "";
  languageList: Array<any> = [];

  // Actual translations
  languages: Array<any> = [];

  // AppComponent
  t_AppComponent_Home: string = "Home";
  t_AppComponent_Objects: string = "Objects";
  t_AppComponent_Data: string = "Data";
  t_AppComponent_DeepSky: string = "Deep-sky";
  t_AppComponent_Calculator: string = "Calculator";
  t_AppComponent_Apod: string = "APOD";
  t_AppComponent_Neo: string = "NEO";
  t_AppComponent_SolarEclipses: string = "Solar eclipses";
  t_AppComponent_LunarEclipses: string = "Lunar eclipses";
  t_AppComponent_SunAndMoon: string = "Sun & Moon";
  t_AppComponent_Iss: string = "ISS";
  t_AppComponent_Moonfeatures: string = "Moon";
  t_AppComponent_Stores: string = "Stores";
  t_AppComponent_Locations: string = "Locations";
  t_AppComponent_Weather: string = "Weather";
  t_AppComponent_Settings: string = "Settings";
  t_AppComponent_About: string = "About";
  t_AppComponent_Others: string = "Others";
  t_AppComponent_Logout: string = "Logout";
  t_AppComponent_DataSource: string = "Data source";

  // LoginComponent
  t_LoginComponent_Title: string = "Get started with AstroInfo";
  t_LoginComponent_Subtitle: string = "...and access information about deep sky objects from various resources";

  // WelcomeComponent
  t_WelcomeComponent_PanelTitle: string = "Welcome";
  t_WelcomeComponent_Title: string = "Welcome to AstroInfo web application!";
  t_WelcomeComponent_YouAreLoggedInWith: string = "You are logged in with";
  t_WelcomeComponent_YouAreLoggedInAs: string = "as";
  t_WelcomeComponent_YourGeolocation: string = "Your geolocation";
  t_WelcomeComponent_Click: string = "click";
  t_WelcomeComponent_Settings: string = "Settings";
  t_WelcomeComponent_ToChange: string = "to change";
  t_WelcomeComponent_SettingsAdvise: string = "Before using this application it is advisable to first define Your";
  t_WelcomeComponent_SettingsAdviseAddendum: string = "for the application";

  // ObjectsComponent
  t_ObjectsComponent_PanelTitle: string = "Objects list";
  t_ObjectsComponent_Filter: string = "Filter";
  t_ObjectsComponent_Search: string = "Search";
  t_ObjectsComponent_CatalogueEntry: string = "Catalogue entry";
  t_ObjectsComponent_FamiliarName: string = "Familiar name";
  t_ObjectsComponent_AlternativeEntries: string = "Alternative entries";
  t_ObjectsComponent_Type: string = "Type";
  t_ObjectsComponent_Constellation: string = "Constellation";
  t_ObjectsComponent_RightAscension: string = "Right ascension";
  t_ObjectsComponent_Declination: string = "Declination";
  t_ObjectsComponent_Magnitude: string = "Magnitude";
  t_ObjectsComponent_Size: string = "Size";
  t_ObjectsComponent_SurfaceBrightness: string = "Surface brightness";
  t_ObjectsComponent_DisplayingObjects: string = "Displaying objects";
  t_ObjectsComponent_DisplayingObjectsOf: string = "of";
  t_ObjectsComponent_Choose: string = "Choose";
  t_ObjectsComponent_Loading: string = "Loading data...";
  t_ObjectsComponent_AdditionalSearchCriteria: string = "Additional search criteria";
  t_ObjectsComponent_Magn: string = "Magn.";
  t_ObjectsComponent_SizeShortened: string = "Size";
  t_ObjectsComponent_AltitudeDegrees: string = "Altitude (degrees)";
  t_ObjectsComponent_AzimuthDegrees: string = "Azimuth (degrees)";
  t_ObjectsComponent_TimeUT: string = "UT (yyyy-mm-dd hh:mm)";
  t_ObjectsComponent_Latitude: string = "Latitude";
  t_ObjectsComponent_Longitude: string = "Longitude";
  t_ObjectsComponent_Use: string = "Use";
  t_ObjectsComponent_Ignore: string = "Ignore";
  t_ObjectsComponent_TypeFilterText: "Type filter text...";
  t_ObjectsComponent_TypeSearchText: "Type search text...";
  t_ObjectsComponent_UseAdditionalCriteria: string = "Use additional search criteria...";

  // ObjectDetailsComponent
  t_ObjectDetailsComponent_PanelTitle: string = "Object details";
  t_ObjectDetailsComponent_ObjectsCurrentPosition: string = "Object's current position on the sky at Your location";
  t_ObjectDetailsComponent_Altitude: string = "Altitude";
  t_ObjectDetailsComponent_Azimuth: string = "Azimuth";
  t_ObjectDetailsComponent_TimeUt: string = "Time (UT)";
  t_ObjectDetailsComponent_ObjectsNextPositions: string = "Object's next positions on the sky at Your location";
  t_ObjectDetailsComponent_Back: string = "Back";

  // AltAzCalculatorComponent
  t_AltAzCalculatorComponent_PanelTitle: string = "Alt-Az calculator";
  t_AltAzCalculatorComponent_MapTitle: string = "Define parameters to get object's alt-az position";
  t_AltAzCalculatorComponent_Latitude: string = "Latitude";
  t_AltAzCalculatorComponent_Longitude: string = "Longitude";
  t_AltAzCalculatorComponent_RA: string = "RA (hh mm ss)";
  t_AltAzCalculatorComponent_DEC: string = "DEC (deg mm ss)";
  t_AltAzCalculatorComponent_TimeUT: string = "UT (yyyy-mm-dd hh:mm)";
  t_AltAzCalculatorComponent_ObjectsPosition: string = "Object's position on the sky for chosen location and time";
  t_AltAzCalculatorComponent_Altitude: string = "Altitude";
  t_AltAzCalculatorComponent_Azimuth: string = "Azimuth";
  t_AltAzCalculatorComponent_Calculate: string = "Calculate";
  t_AltAzCalculatorComponent_Back: string = "Back";
  t_AltAzCalculatorComponent_AlertText: string = "Data is automatically updated by changing any parameter (RA, DEC, UT or geolocation)";

  // ApodComponent
  t_ApodComponent_PanelTitle: string = "Astronomy Picture of the Day";
  t_ApodComponent_Title: string = "Title";
  t_ApodComponent_Explanation: string = "Explanation";
  t_ApodComponent_Date: string = "Date";
  t_ApodComponent_Copyright: string = "Copyright";

  // NeoComponent
  t_NeoComponent_PanelTitle: string = "NEO - Near Earth Objects";
  t_NeoComponent_ReferenceId: string = "Ref. Id";
  t_NeoComponent_Name: string = "Name";
  t_NeoComponent_AbsoluteMagnitude: string = "Abs. magnitude";
  t_NeoComponent_MinEstimatedDiameterM: string = "Min. est. diameter (m)";
  t_NeoComponent_MaxEstimatedDiameterM: string = "Max. est. diameter (m)";
  t_NeoComponent_CloseApproachDate: string = "Close approach date";
  t_NeoComponent_VelocityKms: string = "Velocity (km/s)";
  t_NeoComponent_VelocityKmh: string = "Velocity (km/h)";
  t_NeoComponent_OrbitingBody: string = "Orbiting body";

  // NeoDetailsComponent
  t_NeoDetailsComponent_PanelTitle: string = "NEO details";
  t_NeoDetailsComponent_CloseApproachDate: string = "Close approach date";
  t_NeoDetailsComponent_VelocityKms: string = "Velocity (km/s)";
  t_NeoDetailsComponent_VelocityKmh: string = "Velocity (km/h)";
  t_NeoDetailsComponent_MissDistanceAstronomical: string = "Miss distance (astronomical)";
  t_NeoDetailsComponent_MissDistanceLunar: string = "Miss distance (lunar)";
  t_NeoDetailsComponent_MissDistanceKilometers: string = "Miss distance (km)";
  t_NeoDetailsComponent_OrbitingBody: string = "Orbiting body";

  // SolarEclipsesComponent
  t_SolarEclipsesComponent_PanelTitle: string = "Solar eclipses 2001 - 2100";
  t_SolarEclipsesComponent_Filter: string = "Filter";
  t_SolarEclipsesComponent_Search: string = "Search";
  t_SolarEclipsesComponent_Date: string = "Date";
  t_SolarEclipsesComponent_GreatestEclipseTd: string = "Time";
  t_SolarEclipsesComponent_Deltat: string = "Delta t";
  t_SolarEclipsesComponent_EclipseType: string = "Type";
  t_SolarEclipsesComponent_Latitude: string = "Lat.";
  t_SolarEclipsesComponent_Longitude: string = "Lon.";
  t_SolarEclipsesComponent_SunAltitude: string = "Sun alt.";
  t_SolarEclipsesComponent_PathWidth: string = "Path width";
  t_SolarEclipsesComponent_Duration: string = "Duration";
  t_SolarEclipsesComponent_TypeFilterText: "Type filter text...";
  t_SolarEclipsesComponent_TypeSearchText: "Type search text...";
  t_SolarEclipsesComponent_DisplayingEclipses: string = "Displaying eclipses";
  t_SolarEclipsesComponent_DisplayingEclipsesOf: string = "of";
  t_SolarEclipsesComponent_Loading: string = "Loading data...";

  // LunarEclipsesComponent
  t_LunarEclipsesComponent_PanelTitle: string = "Lunar eclipses 2001 - 2100";
  t_LunarEclipsesComponent_Filter: string = "Filter";
  t_LunarEclipsesComponent_Search: string = "Search";
  t_LunarEclipsesComponent_Date: string = "Date";
  t_LunarEclipsesComponent_GreatestEclipseTd: string = "Time";
  t_LunarEclipsesComponent_Deltat: string = "Delta t";
  t_LunarEclipsesComponent_EclipseType: string = "Type";
  t_LunarEclipsesComponent_DurationPen: string = "Dur. pen.";
  t_LunarEclipsesComponent_DurationPar: string = "Dur. par.";
  t_LunarEclipsesComponent_DurationTotal: string = "Dur. tot.";
  t_LunarEclipsesComponent_Latitude: string = "Lat.";
  t_LunarEclipsesComponent_Longitude: string = "Lon.";
  t_LunarEclipsesComponent_TypeFilterText: "Type filter text...";
  t_LunarEclipsesComponent_TypeSearchText: "Type search text...";
  t_LunarEclipsesComponent_DisplayingEclipses: string = "Displaying eclipses";
  t_LunarEclipsesComponent_DisplayingEclipsesOf: string = "of";
  t_LunarEclipsesComponent_Loading: string = "Loading data...";

  // SunMoonComponent
  t_SunMoonComponent_PanelTitle: string = "Sun and Moon data";
  t_SunMoonComponent_CurrentDataTitlePart1: string = "Current Sun and Moon data for latitude";
  t_SunMoonComponent_CurrentDataTitlePart2: string = "longitude";
  t_SunMoonComponent_CurrentDataTitlePart3: string = "and timezone";
  t_SunMoonComponent_SolarEclipsesTitle: string = "Solar eclipses for current year";
  t_SunMoonComponent_NextMoonPhasesTitlePart1: string = "Next";
  t_SunMoonComponent_NextMoonPhasesTitlePart2: string = "Moon phases";
  t_SunMoonComponent_AllMoonPhasesTitle: string = "All Moon phases for current year";
  t_SunMoonComponent_BeginCivilTwilight: string = "Begin civil twilight";
  t_SunMoonComponent_Sunrise: string = "Sunrise";
  t_SunMoonComponent_UpperTransit: string = "Upper transit";
  t_SunMoonComponent_Sunset: string = "Sunset";
  t_SunMoonComponent_EndCivilTwilight: string = "End civil twilight";
  t_SunMoonComponent_Fracillum: string = "Fracillum";
  t_SunMoonComponent_CurrentPhase: string = "Current phase";
  t_SunMoonComponent_Date: string = "Date";
  t_SunMoonComponent_Event: string = "Event";
  t_SunMoonComponent_Phase: string = "Phase";
  t_SunMoonComponent_Time: string = "Time";

  // IssComponent
  t_IssComponent_PanelTitle: string = "Current ISS position";
  t_IssComponent_MapTitle: string = "Current ISS position and data";
  t_IssComponent_Latitude: string = "Latitude";
  t_IssComponent_Longitude: string = "Longitude";
  t_IssComponent_Altitude: string = "Altitude (km)";
  t_IssComponent_Velocity: string = "Velocity (km/h)";
  t_IssComponent_DateTime: string = "Date/Time";
  t_IssComponent_DataRefreshPeriod: string = "Data refresh period (sec)";
  t_IssComponent_AlertTextPart1: string = "Data will be automatically updated every";
  t_IssComponent_AlertTextPart2: string = "seconds";

  // MoonfeatureComponent
  t_MoonfeaturesComponent_PanelTitle: string = "Moon's features list";
  t_MoonfeaturesComponent_Filter: string = "Filter";
  t_MoonfeaturesComponent_Search: string = "Search";
  t_MoonfeaturesComponent_Name: string = "Name";
  t_MoonfeaturesComponent_Diameter: string = "Diameter (km)";
  t_MoonfeaturesComponent_CenterLatitude: string = "Center latitude";
  t_MoonfeaturesComponent_CenterLongitude: string = "Center longitude";
  t_MoonfeaturesComponent_Continent: string = "Continent";
  t_MoonfeaturesComponent_Ethnicity: string = "Ethnicity";
  t_MoonfeaturesComponent_ApprovalStatus: string = "Approval status";
  t_MoonfeaturesComponent_ApprovalDate: string = "Approval date";
  t_MoonfeaturesComponent_FeatureType: string = "Feature type";
  t_MoonfeaturesComponent_Origin: string = "Origin";
  t_MoonfeaturesComponent_LastUpdated: string = "Last updated";
  t_MoonfeaturesComponent_DisplayingFeatures: string = "Displaying features";
  t_MoonfeaturesComponent_DisplayingFeaturesOf: string = "of";
  t_MoonfeaturesComponent_Choose: string = "Choose";
  t_MoonfeaturesComponent_Loading: string = "Loading data...";
  t_MoonfeaturesComponent_AdditionalSearchCriteria: string = "Additional search criteria";
  t_MoonfeaturesComponent_Use: string = "Use";
  t_MoonfeaturesComponent_Ignore: string = "Ignore";
  t_MoonfeaturesComponent_TypeFilterText: "Type filter text...";
  t_MoonfeaturesComponent_TypeSearchText: "Type search text...";
  t_MoonfeaturesComponent_UseAdditionalCriteria: string = "Use additional search criteria...";

  // MoonfeatureDetailsComponent
  t_MoonfeatureDetailsComponent_PanelTitle: string = "Moon's feature details";
  t_MoonfeatureDetailsComponent_Back: string = "Back";

  // StoresComponent
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

  // LocationsComponent
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

  // WeatherComponent
  t_WeatherComponent_PanelTitle: string = "Weather conditions and forecasts";
  t_WeatherComponent_MapTitle: string = "Click on map or drag marker to get weather conditions and forecasts for chosen place";
  t_WeatherComponent_Sun: string = "Sun";
  t_WeatherComponent_Mon: string = "Mon";
  t_WeatherComponent_Tue: string = "Tue";
  t_WeatherComponent_Wed: string = "Wed";
  t_WeatherComponent_Thu: string = "Thu";
  t_WeatherComponent_Fri: string = "Fri";
  t_WeatherComponent_Sat: string = "Sat";
  t_WeatherComponent_Wind: string = "Wind";
  t_WeatherComponent_Visibility: string = "Visibility";
  t_WeatherComponent_CloudCover: string = "Cloud cover";
  t_WeatherComponent_RainProbability: string = "Rain prob.";
  t_WeatherComponent_SnowProbability: string = "Snow prob.";
  t_WeatherComponent_IceProbability: string = "Ice prob.";
  t_WeatherComponent_Sunrise: string = "Sun rise";
  t_WeatherComponent_Sunset: string = "Sun set";
  t_WeatherComponent_Moonrise: string = "Moon rise";
  t_WeatherComponent_Moonset: string = "Moon set";
  t_WeatherComponent_MoonAge: string = "Moon age";
  t_WeatherComponent_Rain: string = "Rain";
  t_WeatherComponent_Clouds: string = "Clouds";

  // SettingsComponent
  t_SettingsComponent_PanelTitle: string = "Application settings";
  t_SettingsComponent_MapTitle: string = "Click on map or drag marker to update Your location";
  t_SettingsComponent_Latitude: string = "Latitude";
  t_SettingsComponent_Longitude: string = "Longitude";
  t_SettingsComponent_DaylightSavingsOffset: string = "Daylight savings offset (hours)";
  t_SettingsComponent_RawOffset: string = "Raw offset (hours)";
  t_SettingsComponent_TimeZoneId: string = "Time zone ID";
  t_SettingsComponent_TimeZoneName: string = "Time zone name";
  t_SettingsComponent_OtherSettingsTitle: string = "Select Your other preferred application settings";
  t_SettingsComponent_PreferredLanguage: string = "Your preferred language";
  t_SettingsComponent_PreferredDataSource: string = "Your preferred data source";
  t_SettingsComponent_ItemsPerPage: string = "Items per page in objects list";
  t_SettingsComponent_PagesPerPageset: string = "Pages per pageset in objects list";
  t_SettingsComponent_SaveAlert: string = "Your settings are updated and saved!";
  t_SettingsComponent_Save: string = "Save";
  t_SettingsComponent_Choose: string = "Choose";

  // AboutComponent
  t_AboutComponent_PanelTitle: string = "About";
  t_AboutComponent_PanelContent: string = "This web application was born as result of combination of my two passions: astronomy as hobby and programming as professional occupation. It offers many useful information and calculations that can help amateur astronomers in planning their astronomy/astrophotograpy sessions. It also has some additional features and interesting data provided by external web services such as NASA which is updated on a daily basis. Some of application's features are: extensive information on numerous deep-sky objects, calculator which converts RA/DEC coordinates to ALT/AZ coordinates, modern user interface, easy user's geographical location definition and update by mouse click, daily new astonomy picture of the day, user definable data such as astronomy stores or locations suitable for astronomy/astrophotography, current ISS (International space station) real-time data and their visual presentation on a map and much more... Application currently supports three languages (English, Croatian and German) but it can be easily translated to other languages, too. I hope You'll find this web application useful and have a good time using it, at least as much as I enjoyed working on it!";
  t_AboutComponent_PleaseDonate: string = "Please donate (optional)";
  t_AboutComponent_Option: string = "Option";

  // Everything set?
  translationsSetToVariables: boolean = false;


  constructor(private _http: HttpClient) { }

  setTranslationsForLanguage(languageId: number): Promise<void> {

    let p = new Promise<void>((resolve, reject) => {
      this._http
        .get('assets/translations/translations.json')
        .pipe(
          map((request) => <any>request)
        )
        .subscribe(translations => {
          // General language info
          this.languages = translations.translations.languages;
          this.languageId = languageId;
          this.languageidentifier = this.languages[languageId].languageidentifier;
          this.languagetitle = this.languages[languageId].languagetitle;
          this.languageList = [];
          this.languages.map(element => this.languageList.push({ languageid: element.languageid, languagetitle: element.languagetitle }));
          // AppComponent
          this.t_AppComponent_Home = this.languages[languageId].t_AppComponent_Home;
          this.t_AppComponent_Objects = this.languages[languageId].t_AppComponent_Objects;
          this.t_AppComponent_Data = this.languages[languageId].t_AppComponent_Data;
          this.t_AppComponent_DeepSky = this.languages[languageId].t_AppComponent_DeepSky;
          this.t_AppComponent_Calculator = this.languages[languageId].t_AppComponent_Calculator;
          this.t_AppComponent_Apod = this.languages[languageId].t_AppComponent_Apod;
          this.t_AppComponent_Neo = this.languages[languageId].t_AppComponent_Neo;
          this.t_AppComponent_SolarEclipses = this.languages[languageId].t_AppComponent_SolarEclipses;
          this.t_AppComponent_LunarEclipses = this.languages[languageId].t_AppComponent_LunarEclipses;
          this.t_AppComponent_SunAndMoon = this.languages[languageId].t_AppComponent_SunAndMoon;
          this.t_AppComponent_Iss = this.languages[languageId].t_AppComponent_Iss;
          this.t_AppComponent_Moonfeatures = this.languages[languageId].t_AppComponent_Moonfeatures;
          this.t_AppComponent_Stores = this.languages[languageId].t_AppComponent_Stores;
          this.t_AppComponent_Locations = this.languages[languageId].t_AppComponent_Locations;
          this.t_AppComponent_Weather = this.languages[languageId].t_AppComponent_Weather;
          this.t_AppComponent_Settings = this.languages[languageId].t_AppComponent_Settings;
          this.t_AppComponent_About = this.languages[languageId].t_AppComponent_About;
          this.t_AppComponent_Others = this.languages[languageId].t_AppComponent_Others;
          this.t_AppComponent_Logout = this.languages[languageId].t_AppComponent_Logout;
          this.t_AppComponent_DataSource = this.languages[languageId].t_AppComponent_DataSource;
          // LoginComponent
          this.t_LoginComponent_Title = this.languages[languageId].t_LoginComponent_Title;
          this.t_LoginComponent_Subtitle = this.languages[languageId].t_LoginComponent_Subtitle;
          // WelcomeComponent
          this.t_WelcomeComponent_PanelTitle = this.languages[languageId].t_WelcomeComponent_PanelTitle;
          this.t_WelcomeComponent_Title = this.languages[languageId].t_WelcomeComponent_Title;
          this.t_WelcomeComponent_YouAreLoggedInWith = this.languages[languageId].t_WelcomeComponent_YouAreLoggedInWith;
          this.t_WelcomeComponent_YouAreLoggedInAs = this.languages[languageId].t_WelcomeComponent_YouAreLoggedInAs;
          this.t_WelcomeComponent_YourGeolocation = this.languages[languageId].t_WelcomeComponent_YourGeolocation;
          this.t_WelcomeComponent_Click = this.languages[languageId].t_WelcomeComponent_Click;
          this.t_WelcomeComponent_Settings = this.languages[languageId].t_WelcomeComponent_Settings;
          this.t_WelcomeComponent_ToChange = this.languages[languageId].t_WelcomeComponent_ToChange;
          this.t_WelcomeComponent_SettingsAdvise = this.languages[languageId].t_WelcomeComponent_SettingsAdvise;
          this.t_WelcomeComponent_SettingsAdviseAddendum = this.languages[languageId].t_WelcomeComponent_SettingsAdviseAddendum;
          // ObjectsComponent
          this.t_ObjectsComponent_PanelTitle = this.languages[languageId].t_ObjectsComponent_PanelTitle;
          this.t_ObjectsComponent_Filter = this.languages[languageId].t_ObjectsComponent_Filter;
          this.t_ObjectsComponent_Search = this.languages[languageId].t_ObjectsComponent_Search;
          this.t_ObjectsComponent_CatalogueEntry = this.languages[languageId].t_ObjectsComponent_CatalogueEntry;
          this.t_ObjectsComponent_FamiliarName = this.languages[languageId].t_ObjectsComponent_FamiliarName;
          this.t_ObjectsComponent_AlternativeEntries = this.languages[languageId].t_ObjectsComponent_AlternativeEntries;
          this.t_ObjectsComponent_Type = this.languages[languageId].t_ObjectsComponent_Type;
          this.t_ObjectsComponent_Constellation = this.languages[languageId].t_ObjectsComponent_Constellation;
          this.t_ObjectsComponent_RightAscension = this.languages[languageId].t_ObjectsComponent_RightAscension;
          this.t_ObjectsComponent_Declination = this.languages[languageId].t_ObjectsComponent_Declination;
          this.t_ObjectsComponent_Magnitude = this.languages[languageId].t_ObjectsComponent_Magnitude;
          this.t_ObjectsComponent_Size = this.languages[languageId].t_ObjectsComponent_Size;
          this.t_ObjectsComponent_SurfaceBrightness = this.languages[languageId].t_ObjectsComponent_SurfaceBrightness;
          this.t_ObjectsComponent_DisplayingObjects = this.languages[languageId].t_ObjectsComponent_DisplayingObjects;
          this.t_ObjectsComponent_DisplayingObjectsOf = this.languages[languageId].t_ObjectsComponent_DisplayingObjectsOf;
          this.t_ObjectsComponent_Choose = this.languages[languageId].t_ObjectsComponent_Choose;
          this.t_ObjectsComponent_Loading = this.languages[languageId].t_ObjectsComponent_Loading;
          this.t_ObjectsComponent_AdditionalSearchCriteria = this.languages[languageId].t_ObjectsComponent_AdditionalSearchCriteria;
          this.t_ObjectsComponent_Magn = this.languages[languageId].t_ObjectsComponent_Magn;
          this.t_ObjectsComponent_SizeShortened = this.languages[languageId].t_ObjectsComponent_SizeShortened;
          this.t_ObjectsComponent_AltitudeDegrees = this.languages[languageId].t_ObjectsComponent_AltitudeDegrees;
          this.t_ObjectsComponent_AzimuthDegrees = this.languages[languageId].t_ObjectsComponent_AzimuthDegrees;
          this.t_ObjectsComponent_TimeUT = this.languages[languageId].t_ObjectsComponent_TimeUT;
          this.t_ObjectsComponent_Latitude = this.languages[languageId].t_ObjectsComponent_Latitude;
          this.t_ObjectsComponent_Longitude = this.languages[languageId].t_ObjectsComponent_Longitude;
          this.t_ObjectsComponent_Use = this.languages[languageId].t_ObjectsComponent_Use;
          this.t_ObjectsComponent_Ignore = this.languages[languageId].t_ObjectsComponent_Ignore;
          this.t_ObjectsComponent_TypeFilterText = this.languages[languageId].t_ObjectsComponent_TypeFilterText;
          this.t_ObjectsComponent_TypeSearchText = this.languages[languageId].t_ObjectsComponent_TypeSearchText;
          this.t_ObjectsComponent_UseAdditionalCriteria = this.languages[languageId].t_ObjectsComponent_UseAdditionalCriteria;
          // ObjectDetailsComponent
          this.t_ObjectDetailsComponent_PanelTitle = this.languages[languageId].t_ObjectDetailsComponent_PanelTitle;
          this.t_ObjectDetailsComponent_ObjectsCurrentPosition = this.languages[languageId].t_ObjectDetailsComponent_ObjectsCurrentPosition;
          this.t_ObjectDetailsComponent_Altitude = this.languages[languageId].t_ObjectDetailsComponent_Altitude;
          this.t_ObjectDetailsComponent_Azimuth = this.languages[languageId].t_ObjectDetailsComponent_Azimuth;
          this.t_ObjectDetailsComponent_TimeUt = this.languages[languageId].t_ObjectDetailsComponent_TimeUt;
          this.t_ObjectDetailsComponent_ObjectsNextPositions = this.languages[languageId].t_ObjectDetailsComponent_ObjectsNextPositions;
          this.t_ObjectDetailsComponent_Back = this.languages[languageId].t_ObjectDetailsComponent_Back;
          // AltAzCalculatorComponent
          this.t_AltAzCalculatorComponent_PanelTitle = this.languages[languageId].t_AltAzCalculatorComponent_PanelTitle;
          this.t_AltAzCalculatorComponent_MapTitle = this.languages[languageId].t_AltAzCalculatorComponent_MapTitle;
          this.t_AltAzCalculatorComponent_Latitude = this.languages[languageId].t_AltAzCalculatorComponent_Latitude;
          this.t_AltAzCalculatorComponent_Longitude = this.languages[languageId].t_AltAzCalculatorComponent_Longitude;
          this.t_AltAzCalculatorComponent_RA = this.languages[languageId].t_AltAzCalculatorComponent_RA;
          this.t_AltAzCalculatorComponent_DEC = this.languages[languageId].t_AltAzCalculatorComponent_DEC;
          this.t_AltAzCalculatorComponent_TimeUT = this.languages[languageId].t_AltAzCalculatorComponent_TimeUT;
          this.t_AltAzCalculatorComponent_ObjectsPosition = this.languages[languageId].t_AltAzCalculatorComponent_ObjectsPosition;
          this.t_AltAzCalculatorComponent_Altitude = this.languages[languageId].t_AltAzCalculatorComponent_Altitude;
          this.t_AltAzCalculatorComponent_Azimuth = this.languages[languageId].t_AltAzCalculatorComponent_Azimuth;
          this.t_AltAzCalculatorComponent_Calculate = this.languages[languageId].t_AltAzCalculatorComponent_Calculate;
          this.t_AltAzCalculatorComponent_Back = this.languages[languageId].t_AltAzCalculatorComponent_Back;
          this.t_AltAzCalculatorComponent_AlertText = this.languages[languageId].t_AltAzCalculatorComponent_AlertText;
          // ApodComponent
          this.t_ApodComponent_PanelTitle = this.languages[languageId].t_ApodComponent_PanelTitle;
          this.t_ApodComponent_Title = this.languages[languageId].t_ApodComponent_Title;
          this.t_ApodComponent_Explanation = this.languages[languageId].t_ApodComponent_Explanation;
          this.t_ApodComponent_Date = this.languages[languageId].t_ApodComponent_Date;
          this.t_ApodComponent_Copyright = this.languages[languageId].t_ApodComponent_Copyright;
          // NeoComponent
          this.t_NeoComponent_PanelTitle = this.languages[languageId].t_NeoComponent_PanelTitle;
          this.t_NeoComponent_ReferenceId = this.languages[languageId].t_NeoComponent_ReferenceId;
          this.t_NeoComponent_Name = this.languages[languageId].t_NeoComponent_Name;
          this.t_NeoComponent_AbsoluteMagnitude = this.languages[languageId].t_NeoComponent_AbsoluteMagnitude;
          this.t_NeoComponent_MinEstimatedDiameterM = this.languages[languageId].t_NeoComponent_MinEstimatedDiameterM;
          this.t_NeoComponent_MaxEstimatedDiameterM = this.languages[languageId].t_NeoComponent_MaxEstimatedDiameterM;
          this.t_NeoComponent_CloseApproachDate = this.languages[languageId].t_NeoComponent_CloseApproachDate;
          this.t_NeoComponent_VelocityKms = this.languages[languageId].t_NeoComponent_VelocityKms;
          this.t_NeoComponent_VelocityKmh = this.languages[languageId].t_NeoComponent_VelocityKmh;
          this.t_NeoComponent_OrbitingBody = this.languages[languageId].t_NeoComponent_OrbitingBody;
          // NeoDetailsComponent
          this.t_NeoDetailsComponent_PanelTitle = this.languages[languageId].t_NeoDetailsComponent_PanelTitle;
          this.t_NeoDetailsComponent_CloseApproachDate = this.languages[languageId].t_NeoDetailsComponent_CloseApproachDate;
          this.t_NeoDetailsComponent_VelocityKms = this.languages[languageId].t_NeoDetailsComponent_VelocityKms;
          this.t_NeoDetailsComponent_VelocityKmh = this.languages[languageId].t_NeoDetailsComponent_VelocityKmh;
          this.t_NeoDetailsComponent_MissDistanceAstronomical = this.languages[languageId].t_NeoDetailsComponent_MissDistanceAstronomical;
          this.t_NeoDetailsComponent_MissDistanceLunar = this.languages[languageId].t_NeoDetailsComponent_MissDistanceLunar;
          this.t_NeoDetailsComponent_MissDistanceKilometers = this.languages[languageId].t_NeoDetailsComponent_MissDistanceKilometers;
          this.t_NeoDetailsComponent_OrbitingBody = this.languages[languageId].t_NeoDetailsComponent_OrbitingBody;
          // SolarEclipsesComponent
          this.t_SolarEclipsesComponent_PanelTitle = this.languages[languageId].t_SolarEclipsesComponent_PanelTitle;
          this.t_SolarEclipsesComponent_Filter = this.languages[languageId].t_SolarEclipsesComponent_Filter;
          this.t_SolarEclipsesComponent_Search = this.languages[languageId].t_SolarEclipsesComponent_Search;
          this.t_SolarEclipsesComponent_Date = this.languages[languageId].t_SolarEclipsesComponent_Date;
          this.t_SolarEclipsesComponent_GreatestEclipseTd = this.languages[languageId].t_SolarEclipsesComponent_GreatestEclipseTd;
          this.t_SolarEclipsesComponent_Deltat = this.languages[languageId].t_SolarEclipsesComponent_Deltat;
          this.t_SolarEclipsesComponent_EclipseType = this.languages[languageId].t_SolarEclipsesComponent_EclipseType;
          this.t_SolarEclipsesComponent_Latitude = this.languages[languageId].t_SolarEclipsesComponent_Latitude;
          this.t_SolarEclipsesComponent_Longitude = this.languages[languageId].t_SolarEclipsesComponent_Longitude;
          this.t_SolarEclipsesComponent_SunAltitude = this.languages[languageId].t_SolarEclipsesComponent_SunAltitude;
          this.t_SolarEclipsesComponent_PathWidth = this.languages[languageId].t_SolarEclipsesComponent_PathWidth;
          this.t_SolarEclipsesComponent_Duration = this.languages[languageId].t_SolarEclipsesComponent_Duration;
          this.t_SolarEclipsesComponent_TypeFilterText = this.languages[languageId].t_SolarEclipsesComponent_TypeFilterText;
          this.t_SolarEclipsesComponent_TypeSearchText = this.languages[languageId].t_SolarEclipsesComponent_TypeSearchText;
          this.t_SolarEclipsesComponent_DisplayingEclipses = this.languages[languageId].t_SolarEclipsesComponent_DisplayingEclipses;
          this.t_SolarEclipsesComponent_DisplayingEclipsesOf = this.languages[languageId].t_SolarEclipsesComponent_DisplayingEclipsesOf;
          this.t_SolarEclipsesComponent_Loading = this.languages[languageId].t_SolarEclipsesComponent_Loading;
          // LunarEclipsesComponent
          this.t_LunarEclipsesComponent_PanelTitle = this.languages[languageId].t_LunarEclipsesComponent_PanelTitle;
          this.t_LunarEclipsesComponent_Filter = this.languages[languageId].t_LunarEclipsesComponent_Filter;
          this.t_LunarEclipsesComponent_Search = this.languages[languageId].t_LunarEclipsesComponent_Search;
          this.t_LunarEclipsesComponent_Date = this.languages[languageId].t_LunarEclipsesComponent_Date;
          this.t_LunarEclipsesComponent_GreatestEclipseTd = this.languages[languageId].t_LunarEclipsesComponent_GreatestEclipseTd;
          this.t_LunarEclipsesComponent_Deltat = this.languages[languageId].t_LunarEclipsesComponent_Deltat;
          this.t_LunarEclipsesComponent_EclipseType = this.languages[languageId].t_LunarEclipsesComponent_EclipseType;
          this.t_LunarEclipsesComponent_DurationPen = this.languages[languageId].t_LunarEclipsesComponent_DurationPen;
          this.t_LunarEclipsesComponent_DurationPar = this.languages[languageId].t_LunarEclipsesComponent_DurationPar;
          this.t_LunarEclipsesComponent_DurationTotal = this.languages[languageId].t_LunarEclipsesComponent_DurationTotal;
          this.t_LunarEclipsesComponent_Latitude = this.languages[languageId].t_LunarEclipsesComponent_Latitude;
          this.t_LunarEclipsesComponent_Longitude = this.languages[languageId].t_LunarEclipsesComponent_Longitude;
          this.t_LunarEclipsesComponent_TypeFilterText = this.languages[languageId].t_LunarEclipsesComponent_TypeFilterText;
          this.t_LunarEclipsesComponent_TypeSearchText = this.languages[languageId].t_LunarEclipsesComponent_TypeSearchText;
          this.t_LunarEclipsesComponent_DisplayingEclipses = this.languages[languageId].t_LunarEclipsesComponent_DisplayingEclipses;
          this.t_LunarEclipsesComponent_DisplayingEclipsesOf = this.languages[languageId].t_LunarEclipsesComponent_DisplayingEclipsesOf;
          this.t_LunarEclipsesComponent_Loading = this.languages[languageId].t_LunarEclipsesComponent_Loading;
          // SunMoonComponent
          this.t_SunMoonComponent_PanelTitle = this.languages[languageId].t_SunMoonComponent_PanelTitle;
          this.t_SunMoonComponent_CurrentDataTitlePart1 = this.languages[languageId].t_SunMoonComponent_CurrentDataTitlePart1;
          this.t_SunMoonComponent_CurrentDataTitlePart2 = this.languages[languageId].t_SunMoonComponent_CurrentDataTitlePart2;
          this.t_SunMoonComponent_CurrentDataTitlePart3 = this.languages[languageId].t_SunMoonComponent_CurrentDataTitlePart3;
          this.t_SunMoonComponent_SolarEclipsesTitle = this.languages[languageId].t_SunMoonComponent_SolarEclipsesTitle;
          this.t_SunMoonComponent_NextMoonPhasesTitlePart1 = this.languages[languageId].t_SunMoonComponent_NextMoonPhasesTitlePart1;
          this.t_SunMoonComponent_NextMoonPhasesTitlePart2 = this.languages[languageId].t_SunMoonComponent_NextMoonPhasesTitlePart2;
          this.t_SunMoonComponent_AllMoonPhasesTitle = this.languages[languageId].t_SunMoonComponent_AllMoonPhasesTitle;
          this.t_SunMoonComponent_BeginCivilTwilight = this.languages[languageId].t_SunMoonComponent_BeginCivilTwilight;
          this.t_SunMoonComponent_Sunrise = this.languages[languageId].t_SunMoonComponent_Sunrise;
          this.t_SunMoonComponent_UpperTransit = this.languages[languageId].t_SunMoonComponent_UpperTransit;
          this.t_SunMoonComponent_Sunset = this.languages[languageId].t_SunMoonComponent_Sunset;
          this.t_SunMoonComponent_EndCivilTwilight = this.languages[languageId].t_SunMoonComponent_EndCivilTwilight;
          this.t_SunMoonComponent_Fracillum = this.languages[languageId].t_SunMoonComponent_Fracillum;
          this.t_SunMoonComponent_CurrentPhase = this.languages[languageId].t_SunMoonComponent_CurrentPhase;
          this.t_SunMoonComponent_Date = this.languages[languageId].t_SunMoonComponent_Date;
          this.t_SunMoonComponent_Event = this.languages[languageId].t_SunMoonComponent_Event;
          this.t_SunMoonComponent_Phase = this.languages[languageId].t_SunMoonComponent_Phase;
          this.t_SunMoonComponent_Time = this.languages[languageId].t_SunMoonComponent_Time;
          // IssComponent
          this.t_IssComponent_PanelTitle = this.languages[languageId].t_IssComponent_PanelTitle;
          this.t_IssComponent_MapTitle = this.languages[languageId].t_IssComponent_MapTitle;
          this.t_IssComponent_Latitude = this.languages[languageId].t_IssComponent_Latitude;
          this.t_IssComponent_Longitude = this.languages[languageId].t_IssComponent_Longitude;
          this.t_IssComponent_Altitude = this.languages[languageId].t_IssComponent_Altitude;
          this.t_IssComponent_Velocity = this.languages[languageId].t_IssComponent_Velocity;
          this.t_IssComponent_DateTime = this.languages[languageId].t_IssComponent_DateTime;
          this.t_IssComponent_DataRefreshPeriod = this.languages[languageId].t_IssComponent_DataRefreshPeriod;
          this.t_IssComponent_AlertTextPart1 = this.languages[languageId].t_IssComponent_AlertTextPart1;
          this.t_IssComponent_AlertTextPart2 = this.languages[languageId].t_IssComponent_AlertTextPart2;
          // MoonfeaturesComponent
          this.t_MoonfeaturesComponent_PanelTitle = this.languages[languageId].t_MoonfeaturesComponent_PanelTitle;
          this.t_MoonfeaturesComponent_Filter = this.languages[languageId].t_MoonfeaturesComponent_Filter;
          this.t_MoonfeaturesComponent_Search = this.languages[languageId].t_MoonfeaturesComponent_Search;
          this.t_MoonfeaturesComponent_Name = this.languages[languageId].t_MoonfeaturesComponent_Name;
          this.t_MoonfeaturesComponent_Diameter = this.languages[languageId].t_MoonfeaturesComponent_Diameter;
          this.t_MoonfeaturesComponent_CenterLatitude = this.languages[languageId].t_MoonfeaturesComponent_CenterLatitude;
          this.t_MoonfeaturesComponent_CenterLongitude = this.languages[languageId].t_MoonfeaturesComponent_CenterLongitude;
          this.t_MoonfeaturesComponent_Continent = this.languages[languageId].t_MoonfeaturesComponent_Continent;
          this.t_MoonfeaturesComponent_Ethnicity = this.languages[languageId].t_MoonfeaturesComponent_Ethnicity;
          this.t_MoonfeaturesComponent_ApprovalStatus = this.languages[languageId].t_MoonfeaturesComponent_ApprovalStatus;
          this.t_MoonfeaturesComponent_ApprovalDate = this.languages[languageId].t_MoonfeaturesComponent_ApprovalDate;
          this.t_MoonfeaturesComponent_FeatureType = this.languages[languageId].t_MoonfeaturesComponent_FeatureType;
          this.t_MoonfeaturesComponent_Origin = this.languages[languageId].t_MoonfeaturesComponent_Origin;
          this.t_MoonfeaturesComponent_LastUpdated = this.languages[languageId].t_MoonfeaturesComponent_LastUpdated;
          this.t_MoonfeaturesComponent_DisplayingFeatures = this.languages[languageId].t_MoonfeaturesComponent_DisplayingFeatures;
          this.t_MoonfeaturesComponent_DisplayingFeaturesOf = this.languages[languageId].t_MoonfeaturesComponent_DisplayingFeaturesOf;
          this.t_MoonfeaturesComponent_Choose = this.languages[languageId].t_MoonfeaturesComponent_Choose;
          this.t_MoonfeaturesComponent_Loading = this.languages[languageId].t_MoonfeaturesComponent_Loading;
          this.t_MoonfeaturesComponent_AdditionalSearchCriteria = this.languages[languageId].t_MoonfeaturesComponent_AdditionalSearchCriteria;
          this.t_MoonfeaturesComponent_Use = this.languages[languageId].t_MoonfeaturesComponent_Use;
          this.t_MoonfeaturesComponent_Ignore = this.languages[languageId].t_MoonfeaturesComponent_Ignore;
          this.t_MoonfeaturesComponent_TypeFilterText = this.languages[languageId].t_MoonfeaturesComponent_TypeFilterText;
          this.t_MoonfeaturesComponent_TypeSearchText = this.languages[languageId].t_MoonfeaturesComponent_TypeSearchText;
          this.t_MoonfeaturesComponent_UseAdditionalCriteria = this.languages[languageId].t_MoonfeaturesComponent_UseAdditionalCriteria;
          // MoonfeatureDetailsComponent
          this.t_MoonfeatureDetailsComponent_PanelTitle = this.languages[languageId].t_MoonfeatureDetailsComponent_PanelTitle;
          this.t_MoonfeatureDetailsComponent_Back = this.languages[languageId].t_MoonfeatureDetailsComponent_Back;
          // StoresComponent
          this.t_StoresComponent_PanelTitle = this.languages[languageId].t_StoresComponent_PanelTitle;
          this.t_StoresComponent_MapTitle = this.languages[languageId].t_StoresComponent_MapTitle;
          this.t_StoresComponent_MapTitle_GetMode = this.languages[languageId].t_StoresComponent_MapTitle_GetMode;
          this.t_StoresComponent_MapTitle_AddMode = this.languages[languageId].t_StoresComponent_MapTitle_AddMode;
          this.t_StoresComponent_MapTitle_EditMode = this.languages[languageId].t_StoresComponent_MapTitle_EditMode;
          this.t_StoresComponent_Latitude = this.languages[languageId].t_StoresComponent_Latitude;
          this.t_StoresComponent_Longitude = this.languages[languageId].t_StoresComponent_Longitude;
          this.t_StoresComponent_Name = this.languages[languageId].t_StoresComponent_Name;
          this.t_StoresComponent_Address = this.languages[languageId].t_StoresComponent_Address;
          this.t_StoresComponent_City = this.languages[languageId].t_StoresComponent_City;
          this.t_StoresComponent_PostalCode = this.languages[languageId].t_StoresComponent_PostalCode;
          this.t_StoresComponent_Country = this.languages[languageId].t_StoresComponent_Country;
          this.t_StoresComponent_Comment = this.languages[languageId].t_StoresComponent_Comment;
          this.t_StoresComponent_AddNewStore = this.languages[languageId].t_StoresComponent_AddNewStore;
          this.t_StoresComponent_Save = this.languages[languageId].t_StoresComponent_Save;
          this.t_StoresComponent_Cancel = this.languages[languageId].t_StoresComponent_Cancel;
          this.t_StoresComponent_Edit = this.languages[languageId].t_StoresComponent_Edit;
          this.t_StoresComponent_Delete = this.languages[languageId].t_StoresComponent_Delete;
          this.t_StoresComponent_AddedAlert = this.languages[languageId].t_StoresComponent_AddedAlert;
          this.t_StoresComponent_UpdatedAlert = this.languages[languageId].t_StoresComponent_UpdatedAlert;
          this.t_StoresComponent_DeletedAlert = this.languages[languageId].t_StoresComponent_DeletedAlert;
          // LocationsComponent
          this.t_LocationsComponent_PanelTitle = this.languages[languageId].t_LocationsComponent_PanelTitle;
          this.t_LocationsComponent_MapTitle = this.languages[languageId].t_LocationsComponent_MapTitle;
          this.t_LocationsComponent_MapTitle_GetMode = this.languages[languageId].t_LocationsComponent_MapTitle_GetMode;
          this.t_LocationsComponent_MapTitle_AddMode = this.languages[languageId].t_LocationsComponent_MapTitle_AddMode;
          this.t_LocationsComponent_MapTitle_EditMode = this.languages[languageId].t_LocationsComponent_MapTitle_EditMode;
          this.t_LocationsComponent_Latitude = this.languages[languageId].t_LocationsComponent_Latitude;
          this.t_LocationsComponent_Longitude = this.languages[languageId].t_LocationsComponent_Longitude;
          this.t_LocationsComponent_Sqm = this.languages[languageId].t_LocationsComponent_Sqm;
          this.t_LocationsComponent_Country = this.languages[languageId].t_LocationsComponent_Country;
          this.t_LocationsComponent_Comment = this.languages[languageId].t_LocationsComponent_Comment;
          this.t_LocationsComponent_AddNewLocation = this.languages[languageId].t_LocationsComponent_AddNewLocation;
          this.t_LocationsComponent_Save = this.languages[languageId].t_LocationsComponent_Save;
          this.t_LocationsComponent_Cancel = this.languages[languageId].t_LocationsComponent_Cancel;
          this.t_LocationsComponent_Edit = this.languages[languageId].t_LocationsComponent_Edit;
          this.t_LocationsComponent_Delete = this.languages[languageId].t_LocationsComponent_Delete;
          this.t_LocationsComponent_AddedAlert = this.languages[languageId].t_LocationsComponent_AddedAlert;
          this.t_LocationsComponent_UpdatedAlert = this.languages[languageId].t_LocationsComponent_UpdatedAlert;
          this.t_LocationsComponent_DeletedAlert = this.languages[languageId].t_LocationsComponent_DeletedAlert;
          // WeatherComponent
          this.t_WeatherComponent_PanelTitle = this.languages[languageId].t_WeatherComponent_PanelTitle;
          this.t_WeatherComponent_MapTitle = this.languages[languageId].t_WeatherComponent_MapTitle;
          this.t_WeatherComponent_Sun = this.languages[languageId].t_WeatherComponent_Sun;
          this.t_WeatherComponent_Mon = this.languages[languageId].t_WeatherComponent_Mon;
          this.t_WeatherComponent_Tue = this.languages[languageId].t_WeatherComponent_Tue;
          this.t_WeatherComponent_Wed = this.languages[languageId].t_WeatherComponent_Wed;
          this.t_WeatherComponent_Thu = this.languages[languageId].t_WeatherComponent_Thu;
          this.t_WeatherComponent_Fri = this.languages[languageId].t_WeatherComponent_Fri;
          this.t_WeatherComponent_Sat = this.languages[languageId].t_WeatherComponent_Sat;
          this.t_WeatherComponent_Wind = this.languages[languageId].t_WeatherComponent_Wind;
          this.t_WeatherComponent_Visibility = this.languages[languageId].t_WeatherComponent_Visibility;
          this.t_WeatherComponent_CloudCover = this.languages[languageId].t_WeatherComponent_CloudCover;
          this.t_WeatherComponent_RainProbability = this.languages[languageId].t_WeatherComponent_RainProbability;
          this.t_WeatherComponent_SnowProbability = this.languages[languageId].t_WeatherComponent_SnowProbability;
          this.t_WeatherComponent_IceProbability = this.languages[languageId].t_WeatherComponent_IceProbability;
          this.t_WeatherComponent_Sunrise = this.languages[languageId].t_WeatherComponent_Sunrise;
          this.t_WeatherComponent_Sunset = this.languages[languageId].t_WeatherComponent_Sunset;
          this.t_WeatherComponent_Moonrise = this.languages[languageId].t_WeatherComponent_Moonrise;
          this.t_WeatherComponent_Moonset = this.languages[languageId].t_WeatherComponent_Moonset;
          this.t_WeatherComponent_MoonAge = this.languages[languageId].t_WeatherComponent_MoonAge;
          this.t_WeatherComponent_Rain = this.languages[languageId].t_WeatherComponent_Rain;
          this.t_WeatherComponent_Clouds = this.languages[languageId].t_WeatherComponent_Clouds;
          // SettingsComponent
          this.t_SettingsComponent_PanelTitle = this.languages[languageId].t_SettingsComponent_PanelTitle;
          this.t_SettingsComponent_MapTitle = this.languages[languageId].t_SettingsComponent_MapTitle;
          this.t_SettingsComponent_Latitude = this.languages[languageId].t_SettingsComponent_Latitude;
          this.t_SettingsComponent_Longitude = this.languages[languageId].t_SettingsComponent_Longitude;
          this.t_SettingsComponent_DaylightSavingsOffset = this.languages[languageId].t_SettingsComponent_DaylightSavingsOffset;
          this.t_SettingsComponent_RawOffset = this.languages[languageId].t_SettingsComponent_RawOffset;
          this.t_SettingsComponent_TimeZoneId = this.languages[languageId].t_SettingsComponent_TimeZoneId;
          this.t_SettingsComponent_TimeZoneName = this.languages[languageId].t_SettingsComponent_TimeZoneName;
          this.t_SettingsComponent_OtherSettingsTitle = this.languages[languageId].t_SettingsComponent_OtherSettingsTitle;
          this.t_SettingsComponent_PreferredLanguage = this.languages[languageId].t_SettingsComponent_PreferredLanguage;
          this.t_SettingsComponent_PreferredDataSource = this.languages[languageId].t_SettingsComponent_PreferredDataSource;
          this.t_SettingsComponent_ItemsPerPage = this.languages[languageId].t_SettingsComponent_ItemsPerPage;
          this.t_SettingsComponent_PagesPerPageset = this.languages[languageId].t_SettingsComponent_PagesPerPageset;
          this.t_SettingsComponent_SaveAlert = this.languages[languageId].t_SettingsComponent_SaveAlert;
          this.t_SettingsComponent_Save = this.languages[languageId].t_SettingsComponent_Save;
          this.t_SettingsComponent_Choose = this.languages[languageId].t_SettingsComponent_Choose;
          // AboutComponent
          this.t_AboutComponent_PanelTitle = this.languages[languageId].t_AboutComponent_PanelTitle;
          this.t_AboutComponent_PanelContent = this.languages[languageId].t_AboutComponent_PanelContent;
          this.t_AboutComponent_PleaseDonate = this.languages[languageId].t_AboutComponent_PleaseDonate;
          this.t_AboutComponent_Option = this.languages[languageId].t_AboutComponent_Option;
          // Everything set
          this.translationsSetToVariables = true;
          // Resolve
          resolve();
        });

    })

    return p;

  }

}