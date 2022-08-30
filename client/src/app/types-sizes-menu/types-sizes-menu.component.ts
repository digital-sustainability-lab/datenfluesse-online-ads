import { Component, OnInit } from '@angular/core';
import { BarchartTypesSizesService } from '../services/barchart-types-sizes.service';

@Component({
  selector: 'app-types-sizes-menu',
  templateUrl: './types-sizes-menu.component.html',
  styleUrls: ['./types-sizes-menu.component.css'],
})
export class TypesSizesMenuComponent implements OnInit {
  data: any;

  constructor(private typesService: BarchartTypesSizesService) {}

  ngOnInit(): void {
    this.typesService.data.subscribe((data: any) => {
      this.data = data;
    });
    this.typesService.init();
  }

  updateDataToShow(event: any) {
    this.typesService.dataFilter.next(event.target.value);
  }
}
