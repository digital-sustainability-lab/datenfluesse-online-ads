import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { NetworkComponent } from './network/network.component';
import { PiechartComponent } from './piechart/piechart.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'pie', component: PiechartComponent },
  { path: 'bar', component: BarchartComponent },
  { path: 'bar-chart', component: BarChartComponent },
  { path: 'network', component: NetworkComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
