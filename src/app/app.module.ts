import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { AboutComponent } from './about.component';
import { LoginComponent } from './login.component';
import { WelcomeComponent } from './welcome.component';
import { ObjectsComponent } from './objects.component';
import { ObjectDetailsComponent } from './object.details.component';
import { ApodComponent } from './apod.component';
import { NeoComponent } from './neo.component';
import { NeoDetailsComponent } from './neo.details.component';
import { SunmoonComponent } from './sunmoon.component';
import { IssComponent } from './iss.component';
import { StoresComponent } from './stores.component';
import { LocationsComponent } from './locations.component';
import { WeatherComponent } from './weather.component';
import { UserSettingsComponent } from './user.settings.component';
import { AltAzCalculatorComponent } from './altaz.calculator.component';
import { MoonfeaturesComponent } from './moonfeatures.component';
import { MoonfeatureDetailsComponent } from './moonfeature.details.component';
import { SolarEclipsesComponent } from './solareclipses.component';
import { LunarEclipsesComponent } from './lunareclipses.component';
import { routes, routing } from './app.router';

import { FirebaseAuthService } from './shared/firebase.auth.service';
import { FirebaseDataService } from './shared/firebase.data.service';
import { WikipediaService } from './shared/wikipedia.service';
import { FlickrService } from './shared/flickr.service';
import { NasaService } from './shared/nasa.service';
import { WeatherService } from './shared/weather.service';
import { UsnoService } from './shared/usno.service';
import { GoogleService } from './shared/google.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { CalculationsService } from './shared/calculations.service';
import { IssService } from './shared/iss.service';

import { FilterArrayPipe } from './shared/filter.pipe';

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LoginComponent,
    WelcomeComponent,
    ObjectsComponent,
    ObjectDetailsComponent,
    AltAzCalculatorComponent,
    ApodComponent,
    NeoComponent,
    NeoDetailsComponent,
    SunmoonComponent,
    IssComponent,
    StoresComponent,
    LocationsComponent,
    WeatherComponent,
    UserSettingsComponent,
    FilterArrayPipe,
    NeoComponent,
    MoonfeaturesComponent,
    MoonfeatureDetailsComponent,
    SolarEclipsesComponent,
    LunarEclipsesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDDjDn2LFaQHk3P1Cqw8X654W8NX4SGx1U'
    }),
    routing
  ],
  providers: [
    FirebaseAuthService,
    FirebaseDataService,
    WikipediaService,
    FlickrService,
    NasaService,
    WeatherService,
    UsnoService,
    GoogleService,
    UserSettingsService,
    TranslationsService,
    CalculationsService,
    IssService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
