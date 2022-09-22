import { Component, OnInit } from '@angular/core';
import { NasaService } from './shared/nasa.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-neodetails',
  templateUrl: './neo.details.component.html',
  styleUrls: ['./neo.details.component.css']
})

export class NeoDetailsComponent implements OnInit {

  isLoggedIn: boolean;
  neoId: number = 0;
  neoDetails: Array<any> = [];

  // Variables for various error messages
  errorMessageNeoDetails: string = "";

  // Variables for translations
  t_NeoDetailsComponent_PanelTitle: string = "NEO details";
  t_NeoDetailsComponent_CloseApproachDate: string = "Close approach date";
  t_NeoDetailsComponent_VelocityKms: string = "Velocity (km/s)";
  t_NeoDetailsComponent_VelocityKmh: string = "Velocity (km/h)";
  t_NeoDetailsComponent_MissDistanceAstronomical: string = "Miss distance (astronomical)";
  t_NeoDetailsComponent_MissDistanceLunar: string = "Miss distance (lunar)";
  t_NeoDetailsComponent_MissDistanceKilometers: string = "Miss distance (km)";
  t_NeoDetailsComponent_OrbitingBody: string = "Orbiting body";

  constructor(private _nasaService: NasaService, private _activatedRoute: ActivatedRoute, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // Activated route
    this.neoId = parseInt(this._activatedRoute.snapshot.params['id']);

    // Get data from Nasa service
    this._nasaService.getNeoDetails(this.neoId).subscribe(value => {
      this.neoDetails.push(value.close_approach_data);
    }, (err) => this.errorMessageNeoDetails = err);

    // Translations
    this.translate();

    // Update panel title
    this.t_NeoDetailsComponent_PanelTitle = this.t_NeoDetailsComponent_PanelTitle + ": " + this.neoId.toString();

  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          this.t_NeoDetailsComponent_PanelTitle = this._translationsService.t_NeoDetailsComponent_PanelTitle;
          this.t_NeoDetailsComponent_CloseApproachDate = this._translationsService.t_NeoDetailsComponent_CloseApproachDate;
          this.t_NeoDetailsComponent_VelocityKms = this._translationsService.t_NeoDetailsComponent_VelocityKms;
          this.t_NeoDetailsComponent_VelocityKmh = this._translationsService.t_NeoDetailsComponent_VelocityKmh;
          this.t_NeoDetailsComponent_MissDistanceAstronomical = this._translationsService.t_NeoDetailsComponent_MissDistanceAstronomical;
          this.t_NeoDetailsComponent_MissDistanceLunar = this._translationsService.t_NeoDetailsComponent_MissDistanceLunar;
          this.t_NeoDetailsComponent_MissDistanceKilometers = this._translationsService.t_NeoDetailsComponent_MissDistanceKilometers;
          this.t_NeoDetailsComponent_OrbitingBody = this._translationsService.t_NeoDetailsComponent_OrbitingBody;
        });
    } else {
      this.t_NeoDetailsComponent_PanelTitle = this._translationsService.t_NeoDetailsComponent_PanelTitle;
      this.t_NeoDetailsComponent_CloseApproachDate = this._translationsService.t_NeoDetailsComponent_CloseApproachDate;
      this.t_NeoDetailsComponent_VelocityKms = this._translationsService.t_NeoDetailsComponent_VelocityKms;
      this.t_NeoDetailsComponent_VelocityKmh = this._translationsService.t_NeoDetailsComponent_VelocityKmh;
      this.t_NeoDetailsComponent_MissDistanceAstronomical = this._translationsService.t_NeoDetailsComponent_MissDistanceAstronomical;
      this.t_NeoDetailsComponent_MissDistanceLunar = this._translationsService.t_NeoDetailsComponent_MissDistanceLunar;
      this.t_NeoDetailsComponent_MissDistanceKilometers = this._translationsService.t_NeoDetailsComponent_MissDistanceKilometers;
      this.t_NeoDetailsComponent_OrbitingBody = this._translationsService.t_NeoDetailsComponent_OrbitingBody;
    }

  }

}
