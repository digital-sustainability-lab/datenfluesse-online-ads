import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { NetworkComponent } from './network/network.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ColorLegendComponent } from './color-legend/color-legend.component';
import { InformationComponent } from './information/information.component';
import { HierarchBarComponent } from './hierarch-bar/hierarch-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NetworkMenuComponent } from './network-menu/network-menu.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { BarchartDetails } from './barchart-details/barchart-details.component';
import { BarchartDetailsMenu } from './barchart-details-menu/barchart-details-menu.component';
import { TestChartComponent } from './test-chart/test-chart.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NetworkComponent,
    ColorLegendComponent,
    InformationComponent,
    HierarchBarComponent,
    NetworkMenuComponent,
    BarchartDetails,
    BarchartDetailsMenu,
    TestChartComponent,
    LandingPageComponent,
  ],
  imports: [
    FontAwesomeModule,
    MatExpansionModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
