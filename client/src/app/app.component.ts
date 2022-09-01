import { Component } from '@angular/core';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { BarchartDetailsService } from './services/barchart-details.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';
  fadiagram = faProjectDiagram;
  faChartBar = faChartBar;

  constructor(
    private dataService: DataService,
    private barchartDetailsService: BarchartDetailsService
  ) {}

  active: string = 'swiss';

  ngOnInit(): void {
    this.dataService.getActiveData().subscribe((data: string) => {
      this.active = data;
    });
  }

  changeDataSet(data: string) {
    this.dataService.changeDataSet(data);
  }
}
