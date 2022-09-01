import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HierarchBarComponent } from './hierarch-bar/hierarch-bar.component';
import { NetworkComponent } from './network/network.component';
import { BarchartDetails } from './barchart-details/barchart-details.component';
import { TestChartComponent } from './test-chart/test-chart.component';

const routes: Routes = [
  { path: '', redirectTo: 'bar', pathMatch: 'full' },
  { path: 'bar', component: HierarchBarComponent },
  { path: 'details', component: BarchartDetails },
  { path: 'network', component: NetworkComponent },
  { path: 'test', component: TestChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
