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

  expandPanel(matExpansionPanel: any, event: any): void {
    event.stopPropagation(); // Preventing event bubbling

    if (!this._isExpansionIndicator(event.target)) {
      matExpansionPanel.close(); // Here's the magic
    }
  }

  private _isExpansionIndicator(target: any): boolean {
    const expansionIndicatorClass = 'mat-expansion-indicator';

    return (target['classList'] && target['classList'].contains(expansionIndicatorClass) );
  }


}
