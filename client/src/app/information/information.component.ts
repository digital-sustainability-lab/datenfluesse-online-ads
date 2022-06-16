import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { category_data } from '../network-new/category_data';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  categoryData: any = category_data

  node: any

  name: any

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getSelectedNode().subscribe((node: any) => {
      if (this.categoryData[node]) {
        this.node = this.categoryData[node]
        this.name = node
      }
      debugger
    })

  }

}
