import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BarchartTypesSizesService } from '../services/barchart-types-sizes.service';

@Component({
  selector: 'app-types-sizes-menu',
  templateUrl: './types-sizes-menu.component.html',
  styleUrls: ['./types-sizes-menu.component.css'],
})
export class TypesSizesMenuComponent implements OnInit {
  constructor(private typesService: BarchartTypesSizesService) {}

  data: any;

  ngOnInit(): void {
    this.data = this.typesService.getData();
  }
}
