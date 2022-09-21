import { Component, OnInit } from '@angular/core';
import { UsnoService } from './shared/usno.service'
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { Observable } from 'rxjs';
import { IUserSettingsModel } from './shared/user.settings.model';

@Component({
  selector: 'app-sunmoon',
  templateUrl: './sunmoon.component.html',
  styleUrls: ['./sunmoon.component.css']
})

export class SunmoonComponent implements OnInit {

  isLoggedIn: boolean;
  nump: number = 4;
  sunMoonData: Observable<any>;
  solarEclipses: Observable<any>;
  nextMoonPhases: Observable<any>;
  allMoonPhases: Observable<any>;

  // Variables for various error messages
  errorMessageSunMoonData: string = "";
  errorMessageSolarEclipses: string = "";
  errorMessageNextMoonPhases: string = "";
  errorMessageAllMoonPhases: string = "";

  // Variables for user settings
  lat: number = 0;
  lng: number = 0;
  timeZoneRawOffset: number = 0;
  languageId: number = 0;
  itemsPerPage: number = 0;
  pagesPerPageset: number = 0;
  userSettings: IUserSettingsModel = { lat: 0, lng: 0, timeZoneRawOffset: 0, languageId: 0, dataSource: 0, itemsPerPage: 0, pagesPerPageset: 0 };

  // Variables for translations
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
  t_SunMoonComponent_Time: string = "Time"

  constructor(private _usnoService: UsnoService, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // var p = this._firebaseAuthService.listenForAuthStateChanges();

    // p.then(user => {
    //   this.isLoggedIn = true;

    //   // Use user settings from service
    //   this.lat = this._userSettingsService.lat;
    //   this.lng = this._userSettingsService.lng;
    //   this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
    //   this.languageId = this._userSettingsService.languageId;
    //   this.itemsPerPage = this._userSettingsService.itemsPerPage;
    //   this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

    //   // Get data from Usno service
    //   let coords = this.lat.toString() + "," + this.lng.toString();
    //   let d = new Date();
    //   let date: string = ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()) + '/' + (d.getDate() < 10 ? '0' + d.getDate().toString(): d.getDate().toString()) + '/' + (d.getFullYear().toString());
    //   let year: string = d.getFullYear().toString();
    //   this._usnoService.getSunAndMoonData(date, coords, this.timeZoneRawOffset.toString()).subscribe(sunMoonData => this.sunMoonData = sunMoonData, (err) => this.errorMessageSunMoonData = err);
    //   this._usnoService.getSolarEclipses(year).subscribe(solarEclipses => this.solarEclipses = solarEclipses, (err) => this.errorMessageSolarEclipses = err);
    //   this._usnoService.getNextMoonPhases(date, this.nump).subscribe(nextMoonPhases => this.nextMoonPhases = nextMoonPhases, (err) => this.errorMessageNextMoonPhases = err);
    //   this._usnoService.getAllMoonPhases(year).subscribe(allMoonPhases => this.allMoonPhases = allMoonPhases, (err) => this.errorMessageAllMoonPhases = err);

    //   // Translations
    //   this.translate();

    // })
    // .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

    this.isLoggedIn = true;

    // Use user settings from service
    this.lat = this._userSettingsService.lat;
    this.lng = this._userSettingsService.lng;
    this.timeZoneRawOffset = this._userSettingsService.timeZoneRawOffset;
    this.languageId = this._userSettingsService.languageId;
    this.itemsPerPage = this._userSettingsService.itemsPerPage;
    this.pagesPerPageset = this._userSettingsService.pagesPerPageset;

    // Get data from Usno service
    let coords = this.lat.toString() + "," + this.lng.toString();
    let d = new Date();
    let date: string = ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()) + '/' + (d.getDate() < 10 ? '0' + d.getDate().toString() : d.getDate().toString()) + '/' + (d.getFullYear().toString());
    let year: string = d.getFullYear().toString();
    this._usnoService.getSunAndMoonData(date, coords, this.timeZoneRawOffset.toString()).subscribe(sunMoonData => this.sunMoonData = sunMoonData, (err) => this.errorMessageSunMoonData = err);
    this._usnoService.getSolarEclipses(year).subscribe(solarEclipses => this.solarEclipses = solarEclipses, (err) => this.errorMessageSolarEclipses = err);
    this._usnoService.getNextMoonPhases(date, this.nump).subscribe(nextMoonPhases => this.nextMoonPhases = nextMoonPhases, (err) => this.errorMessageNextMoonPhases = err);
    this._usnoService.getAllMoonPhases(year).subscribe(allMoonPhases => this.allMoonPhases = allMoonPhases, (err) => this.errorMessageAllMoonPhases = err);

    // Translations
    this.translate();

  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          this.t_SunMoonComponent_PanelTitle = this._translationsService.t_SunMoonComponent_PanelTitle;
          this.t_SunMoonComponent_CurrentDataTitlePart1 = this._translationsService.t_SunMoonComponent_CurrentDataTitlePart1;
          this.t_SunMoonComponent_CurrentDataTitlePart2 = this._translationsService.t_SunMoonComponent_CurrentDataTitlePart2;
          this.t_SunMoonComponent_CurrentDataTitlePart3 = this._translationsService.t_SunMoonComponent_CurrentDataTitlePart3;
          this.t_SunMoonComponent_SolarEclipsesTitle = this._translationsService.t_SunMoonComponent_SolarEclipsesTitle;
          this.t_SunMoonComponent_NextMoonPhasesTitlePart1 = this._translationsService.t_SunMoonComponent_NextMoonPhasesTitlePart1;
          this.t_SunMoonComponent_NextMoonPhasesTitlePart2 = this._translationsService.t_SunMoonComponent_NextMoonPhasesTitlePart2;
          this.t_SunMoonComponent_AllMoonPhasesTitle = this._translationsService.t_SunMoonComponent_AllMoonPhasesTitle;
          this.t_SunMoonComponent_BeginCivilTwilight = this._translationsService.t_SunMoonComponent_BeginCivilTwilight;
          this.t_SunMoonComponent_Sunrise = this._translationsService.t_SunMoonComponent_Sunrise;
          this.t_SunMoonComponent_UpperTransit = this._translationsService.t_SunMoonComponent_UpperTransit;
          this.t_SunMoonComponent_Sunset = this._translationsService.t_SunMoonComponent_Sunset;
          this.t_SunMoonComponent_EndCivilTwilight = this._translationsService.t_SunMoonComponent_EndCivilTwilight;
          this.t_SunMoonComponent_Fracillum = this._translationsService.t_SunMoonComponent_Fracillum;
          this.t_SunMoonComponent_CurrentPhase = this._translationsService.t_SunMoonComponent_CurrentPhase;
          this.t_SunMoonComponent_Date = this._translationsService.t_SunMoonComponent_Date;
          this.t_SunMoonComponent_Event = this._translationsService.t_SunMoonComponent_Event;
          this.t_SunMoonComponent_Phase = this._translationsService.t_SunMoonComponent_Phase;
          this.t_SunMoonComponent_Time = this._translationsService.t_SunMoonComponent_Time;
        });
    } else {
      this.t_SunMoonComponent_PanelTitle = this._translationsService.t_SunMoonComponent_PanelTitle;
      this.t_SunMoonComponent_CurrentDataTitlePart1 = this._translationsService.t_SunMoonComponent_CurrentDataTitlePart1;
      this.t_SunMoonComponent_CurrentDataTitlePart2 = this._translationsService.t_SunMoonComponent_CurrentDataTitlePart2;
      this.t_SunMoonComponent_CurrentDataTitlePart3 = this._translationsService.t_SunMoonComponent_CurrentDataTitlePart3;
      this.t_SunMoonComponent_SolarEclipsesTitle = this._translationsService.t_SunMoonComponent_SolarEclipsesTitle;
      this.t_SunMoonComponent_NextMoonPhasesTitlePart1 = this._translationsService.t_SunMoonComponent_NextMoonPhasesTitlePart1;
      this.t_SunMoonComponent_NextMoonPhasesTitlePart2 = this._translationsService.t_SunMoonComponent_NextMoonPhasesTitlePart2;
      this.t_SunMoonComponent_AllMoonPhasesTitle = this._translationsService.t_SunMoonComponent_AllMoonPhasesTitle;
      this.t_SunMoonComponent_BeginCivilTwilight = this._translationsService.t_SunMoonComponent_BeginCivilTwilight;
      this.t_SunMoonComponent_Sunrise = this._translationsService.t_SunMoonComponent_Sunrise;
      this.t_SunMoonComponent_UpperTransit = this._translationsService.t_SunMoonComponent_UpperTransit;
      this.t_SunMoonComponent_Sunset = this._translationsService.t_SunMoonComponent_Sunset;
      this.t_SunMoonComponent_EndCivilTwilight = this._translationsService.t_SunMoonComponent_EndCivilTwilight;
      this.t_SunMoonComponent_Fracillum = this._translationsService.t_SunMoonComponent_Fracillum;
      this.t_SunMoonComponent_CurrentPhase = this._translationsService.t_SunMoonComponent_CurrentPhase;
      this.t_SunMoonComponent_Date = this._translationsService.t_SunMoonComponent_Date;
      this.t_SunMoonComponent_Event = this._translationsService.t_SunMoonComponent_Event;
      this.t_SunMoonComponent_Phase = this._translationsService.t_SunMoonComponent_Phase;
      this.t_SunMoonComponent_Time = this._translationsService.t_SunMoonComponent_Time;
    }

  }

}
