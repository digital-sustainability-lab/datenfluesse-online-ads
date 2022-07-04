import { Component, OnInit } from '@angular/core';
import { colors } from '../network-new/colors'

@Component({
  selector: 'app-color-legend',
  templateUrl: './color-legend.component.html',
  styleUrls: ['./color-legend.component.css']
})
export class ColorLegendComponent implements OnInit {

  data = colors

  constructor() { }

  ngOnInit(): void {
  }


}
