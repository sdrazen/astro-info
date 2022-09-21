import { Component, OnInit } from '@angular/core';
import { NasaService } from './shared/nasa.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-neo',
  templateUrl: './neo.component.html',
  styleUrls: ['./neo.component.css']
})

export class NeoComponent implements OnInit {

  isLoggedIn: boolean;
  neos: Array<any> = [];

  // Variables for various error messages
  errorMessageNeo: string = "";

  // Variables for translations
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

  constructor(private _nasaService: NasaService, private _router: Router, private _userSettingsService: UserSettingsService, private _translationsService: TranslationsService) { }

  ngOnInit() {

    // var p = this._firebaseAuthService.listenForAuthStateChanges();

    // p.then(user => {
    //   this.isLoggedIn = true;

    //   // Get data from Nasa service
    //   let today = new Date();
    //   let start_date = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString();
    //   let end_date = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString();

    //   this._nasaService.getNeo(start_date, end_date).subscribe(
    //     (value) => {
    //       this.neos.push(value.near_earth_objects[Object.keys(value.near_earth_objects)[0]]);
    //       // Get data for charts
    //       let arr: Array<any> = value.near_earth_objects[Object.keys(value.near_earth_objects)[0]];
    //       let labels: Array<string> = arr.map(el => el.name);
    //       this.lineChartLabels = labels;
    //       // Data - Min est. diam. (m)
    //       let dataMinEstDiameterM: Array<number> = arr.map(el => Math.round(parseFloat(el.estimated_diameter.meters.estimated_diameter_min)));
    //       this.lineChartDataMinEstDiameterM[0].data = dataMinEstDiameterM;
    //       // Data - Velocity km/s
    //       let dataVelocityKms: Array<number> = arr.map(el => Math.round(parseFloat(el.close_approach_data[0].relative_velocity.kilometers_per_second)));
    //       this.lineChartDataVelocityKms[0].data = dataVelocityKms;
    //     },
    //     (err) => {this.errorMessageNeo = err}
    //   );

    //   // Translations
    //   this.translate();

    //   // Update chart labels
    //   this.lineChartDataMinEstDiameterM[0].label = this.t_NeoComponent_MinEstimatedDiameterM;
    //   this.lineChartDataVelocityKms[0].label = this.t_NeoComponent_VelocityKms;

    // })
    // .catch(value => {this.isLoggedIn = false; this._router.navigate (['/']);})

    this.isLoggedIn = true;

    // Get data from Nasa service
    let today = new Date();
    let start_date = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString();
    let end_date = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString();

    this._nasaService.getNeo(start_date, end_date).subscribe(
      (value) => {
        this.neos.push(value.near_earth_objects[Object.keys(value.near_earth_objects)[0]]);
      },
      (err) => { this.errorMessageNeo = err }
    );

    // Translations
    this.translate();

  }

  onSelect(neo: any) {
    this._router.navigate(['/neo', neo.neo_reference_id])
  }

  translate() {

    if (this._translationsService.translationsSetToVariables === false) {
      this._translationsService.setTranslationsForLanguage(this._userSettingsService.languageId)
        .then(() => {
          this.t_NeoComponent_PanelTitle = this._translationsService.t_NeoComponent_PanelTitle;
          this.t_NeoComponent_ReferenceId = this._translationsService.t_NeoComponent_ReferenceId;
          this.t_NeoComponent_Name = this._translationsService.t_NeoComponent_Name;
          this.t_NeoComponent_AbsoluteMagnitude = this._translationsService.t_NeoComponent_AbsoluteMagnitude;
          this.t_NeoComponent_MinEstimatedDiameterM = this._translationsService.t_NeoComponent_MinEstimatedDiameterM;
          this.t_NeoComponent_MaxEstimatedDiameterM = this._translationsService.t_NeoComponent_MaxEstimatedDiameterM;
          this.t_NeoComponent_CloseApproachDate = this._translationsService.t_NeoComponent_CloseApproachDate;
          this.t_NeoComponent_VelocityKms = this._translationsService.t_NeoComponent_VelocityKms;
          this.t_NeoComponent_VelocityKmh = this._translationsService.t_NeoComponent_VelocityKmh;
          this.t_NeoComponent_OrbitingBody = this._translationsService.t_NeoComponent_OrbitingBody;
        });
    } else {
      this.t_NeoComponent_PanelTitle = this._translationsService.t_NeoComponent_PanelTitle;
      this.t_NeoComponent_ReferenceId = this._translationsService.t_NeoComponent_ReferenceId;
      this.t_NeoComponent_Name = this._translationsService.t_NeoComponent_Name;
      this.t_NeoComponent_AbsoluteMagnitude = this._translationsService.t_NeoComponent_AbsoluteMagnitude;
      this.t_NeoComponent_MinEstimatedDiameterM = this._translationsService.t_NeoComponent_MinEstimatedDiameterM;
      this.t_NeoComponent_MaxEstimatedDiameterM = this._translationsService.t_NeoComponent_MaxEstimatedDiameterM;
      this.t_NeoComponent_CloseApproachDate = this._translationsService.t_NeoComponent_CloseApproachDate;
      this.t_NeoComponent_VelocityKms = this._translationsService.t_NeoComponent_VelocityKms;
      this.t_NeoComponent_VelocityKmh = this._translationsService.t_NeoComponent_VelocityKmh;
      this.t_NeoComponent_OrbitingBody = this._translationsService.t_NeoComponent_OrbitingBody;
    }

  }

}
