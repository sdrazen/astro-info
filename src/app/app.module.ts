import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AboutComponent } from './about.component';
import { WelcomeComponent } from './welcome.component';
import { ObjectsComponent } from './objects.component';
import { ObjectDetailsComponent } from './object.details.component';
import { ApodComponent } from './apod.component';
import { NeoComponent } from './neo.component';
import { NeoDetailsComponent } from './neo.details.component';
import { IssComponent } from './iss.component';
import { StoresComponent } from './stores.component';
import { LocationsComponent } from './locations.component';
import { UserSettingsComponent } from './user.settings.component';
import { AltAzCalculatorComponent } from './altaz.calculator.component';
import { MoonfeaturesComponent } from './moonfeatures.component';
import { MoonfeatureDetailsComponent } from './moonfeature.details.component';
import { SolarEclipsesComponent } from './solareclipses.component';
import { LunarEclipsesComponent } from './lunareclipses.component';
import { AppRoutingModule } from './app-routing.module';
import { GoogleMapsModule } from '@angular/google-maps'

import { BackendService } from './shared/backend.service';
import { WikipediaService } from './shared/wikipedia.service';
import { FlickrService } from './shared/flickr.service';
import { NasaService } from './shared/nasa.service';
import { GoogleService } from './shared/google.service';
import { UserSettingsService } from './shared/user.settings.service';
import { TranslationsService } from './shared/translations.service';
import { CalculationsService } from './shared/calculations.service';
import { IssService } from './shared/iss.service';

import { FilterArrayPipe } from './shared/filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    WelcomeComponent,
    ObjectsComponent,
    ObjectDetailsComponent,
    AltAzCalculatorComponent,
    ApodComponent,
    NeoComponent,
    NeoDetailsComponent,
    IssComponent,
    StoresComponent,
    LocationsComponent,
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
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    GoogleMapsModule
  ],
  providers: [
    BackendService,
    WikipediaService,
    FlickrService,
    NasaService,
    GoogleService,
    UserSettingsService,
    TranslationsService,
    CalculationsService,
    IssService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
