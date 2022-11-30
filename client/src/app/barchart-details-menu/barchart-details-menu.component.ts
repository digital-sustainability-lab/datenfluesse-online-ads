import { Component, OnInit } from '@angular/core';
import { BarchartDetailsService } from '../services/barchart-details.service';

@Component({
  selector: 'app-barchart-details-menu',
  templateUrl: './barchart-details-menu.component.html',
  styleUrls: ['./barchart-details-menu.component.css'],
})
export class BarchartDetailsMenu implements OnInit {
  data: any;

  constructor(private barchartDetailsService: BarchartDetailsService) {}

  ngOnInit(): void {
    this.barchartDetailsService.data.subscribe((data: any) => {
      this.data = data;
      console.log(data.meta);
    });
  }

  updateDataToDisplay(event: any) {
    this.barchartDetailsService.dataSelection.next(event.target.value);
  }

  updateCategorization(event: any) {
    this.barchartDetailsService.categorySelection.next(event.target.value);
  }

  updateOrder(event: any) {
    this.barchartDetailsService.orderSelection.next(event.target.value);
  }
}
