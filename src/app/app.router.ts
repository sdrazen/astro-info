import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AboutComponent } from "./about.component";
import { WelcomeComponent } from "./welcome.component";
import { LoginComponent } from "./login.component";
import { ObjectsComponent } from './objects.component';
import { ObjectDetailsComponent } from './object.details.component';
import { AltAzCalculatorComponent } from './altaz.calculator.component';
import { ApodComponent } from './apod.component';
import { NeoComponent } from './neo.component';
import { NeoDetailsComponent } from './neo.details.component';
import { SolarEclipsesComponent } from './solareclipses.component';
import { LunarEclipsesComponent } from './lunareclipses.component';
import { SunmoonComponent } from './sunmoon.component';
import { IssComponent } from './iss.component';
import { MoonfeaturesComponent } from './moonfeatures.component';
import { StoresComponent } from './stores.component';
import { LocationsComponent } from './locations.component';
import { WeatherComponent } from './weather.component';
import { UserSettingsComponent } from './user.settings.component';

export const routes: Routes = [
    // {path: '', redirectTo: 'welcome', pathMatch: 'full'},
    // {path: '', component: LoginComponent},
    // {path: 'welcome', component: WelcomeComponent},
    {path: '', component: WelcomeComponent},
    {path: 'welcome', component: WelcomeComponent},
    {path: 'objects', component: ObjectsComponent},
    {path: 'calculator', component: AltAzCalculatorComponent},
    {path: 'apod', component: ApodComponent},
    {path: 'neo', component: NeoComponent},
    {path: 'neo/:id', component: NeoDetailsComponent},
    {path: 'solareclipses', component: SolarEclipsesComponent},
    {path: 'lunareclipses', component: LunarEclipsesComponent},
    {path: 'sunmoon', component: SunmoonComponent},
    {path: 'iss', component: IssComponent},
    {path: 'moonfeatures', component: MoonfeaturesComponent},
    {path: 'stores', component: StoresComponent},
    {path: 'locations', component: LocationsComponent},
    {path: 'weather', component: WeatherComponent},
    {path: 'settings', component: UserSettingsComponent},
    {path: 'about', component: AboutComponent},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
