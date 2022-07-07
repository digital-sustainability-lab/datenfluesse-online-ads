import { Component, Input, OnInit } from '@angular/core';

import { DataService } from '../data.service';


@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  categoryData: any

  node: any

  name: any

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this.categoryData = data.category
      this.dataService.getSelectedNode().subscribe((node: any) => {
        if (this.categoryData[node]) {
          this.node = this.categoryData[node]
          this.name = node
        } else if (this.categoryData['https://' + node + '/']) {
          this.node = this.categoryData['https://' + node + '/']
          this.name = node
        }
      })
    })


  }

}
