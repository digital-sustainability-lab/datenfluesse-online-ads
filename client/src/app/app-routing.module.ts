import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BarComponent } from './bar/bar.component';
import { BarchartComponent } from './barchart/barchart.component';
import { NetworkNewComponent } from './network-new/network-new.component';
import { PiechartComponent } from './piechart/piechart.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'pie', component: PiechartComponent },
  { path: 'bar', component: BarComponent },
  { path: 'bar-chart', component: BarChartComponent },
  { path: 'network', component: NetworkNewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
