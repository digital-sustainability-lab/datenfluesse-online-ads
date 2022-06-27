import { Component, OnInit } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
// import { colors } from './colors';
import { DataService } from '../data.service';
import { Domain } from '../interfaces';
import { NetworkNewComponent } from '../network-new/network-new.component';
import { network } from '../network-new/network';
import { html } from 'd3';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { elementAt } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ComponentFixtureNoNgZone, waitForAsync } from '@angular/core/testing';


@Component({
  selector: 'app-network-menu',
  templateUrl: './network-menu.component.html',
  styleUrls: ['./network-menu.component.css']
})
export class NetworkMenuComponent implements OnInit {

  domains : Domain[] = DOMAINS;
  ids:number[] = [];
  network = network;

  constructor(private networkComp : NetworkNewComponent) { }

  ngOnInit(): void {
  }

  getId(name:string): number {
    let id = 0;
    network.nodes.forEach(element => {
      if(element.name && element.name == name) {
        id = element.id;
      }
    });
    return id;
  }

  

  checkBoxChange(event:MatCheckboxChange, name:string) {
      let id = this.getId(name);
      if(event.checked) {
        this.ids.push(id);
      } else {
        this.ids = this.ids.filter(number => number !== id);
      }
      console.log(this.ids);
  }

  changeSelection() {
      this.networkComp.changeSelection(this.ids);
  }

}
