import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BarComponent } from './bar/bar.component';
import { BarchartComponent } from './barchart/barchart.component';
import { HierarchBarComponent } from './hierarch-bar/hierarch-bar.component';
import { NetworkNewComponent } from './network-new/network-new.component';
import { PiechartComponent } from './piechart/piechart.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'pie', component: PiechartComponent },
  { path: 'bar', component: HierarchBarComponent },
  { path: 'bar-chart', component: BarchartComponent },
  { path: 'network', component: NetworkNewComponent },
  { path: 'test', component: HierarchBarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
