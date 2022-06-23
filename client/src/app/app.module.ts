import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PiechartComponent } from './piechart/piechart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from './navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { NetworkNewComponent } from './network-new/network-new.component'
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ColorLegendComponent } from './color-legend/color-legend.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { InformationComponent } from './information/information.component';
import { BarComponent } from './bar/bar.component';





@NgModule({
  declarations: [
    AppComponent,
    PiechartComponent,
    BarchartComponent,
    NavbarComponent,
    BarChartComponent,
    NetworkNewComponent,
    ColorLegendComponent,
    InformationComponent,
    BarComponent
  ],
  imports: [
    MatExpansionModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
