import { Component } from '@angular/core';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  fadiagram = faProjectDiagram
  faChartBar = faChartBar

  constructor(private dataService: DataService) { }

  changeDataSet(data: string) {
    this.dataService.changeDataSet(data)
  }
}
