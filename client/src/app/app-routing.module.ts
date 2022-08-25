import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BarComponent } from './bar/bar.component';
import { BarchartComponent } from './barchart/barchart.component';
import { HierarchBarComponent } from './hierarch-bar/hierarch-bar.component';
import { NetworkComponent } from './network/network.component';
import { PiechartComponent } from './piechart/piechart.component';
import { BarchartTypesSizesComponent } from './barchart-types-sizes/barchart-types-sizes.component';

const routes: Routes = [
  { path: '', redirectTo: 'bar', pathMatch: 'full' },
  { path: 'bar', component: HierarchBarComponent },
  { path: 'types-sizes', component: BarchartTypesSizesComponent },
  { path: 'network', component: NetworkComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
