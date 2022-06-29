import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
// import { colors } from './colors';
import { DataService } from '../data.service';
import { Domain } from '../interfaces';
import { NetworkNewComponent } from '../network-new/network-new.component';
import { network } from '../network-new/network';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {ThemePalette} from '@angular/material/core';
import {example} from '../hierarch-bar/example';
import { index } from 'd3';
import { CheckboxControlValueAccessor } from '@angular/forms';


export interface CheckBox {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subCheckBoxes?: CheckBox[];
}

@Component({
  selector: 'app-network-menu',
  templateUrl: './network-menu.component.html',
  styleUrls: ['./network-menu.component.css']
})
export class NetworkMenuComponent implements OnInit {

  domainCheckBoxes: CheckBox = {
    name: 'all',
    completed: false,
    color: 'primary',
    subCheckBoxes: [],
  };

  categoryCheckBoxes: CheckBox = {
    name: "all",
    completed: false,
    color: "primary",
    subCheckBoxes: []
  };

  domains : Domain[] = DOMAINS;
  ids:number[] = [];
  network = network;
  categories = example.children;
  
  allComplete: boolean = false;

  constructor(private networkComp : NetworkNewComponent) {
  }

  ngOnInit(): void {
      this.domains.forEach(element => {
        if(this.domainCheckBoxes.subCheckBoxes) {
          this.domainCheckBoxes.subCheckBoxes.push({name:element.name, completed:false, color:'primary'});
        }
      });
      
      this.categories.shift();
      if (this.categories) {
        this.categories.forEach(element => {
          if(this.categoryCheckBoxes.subCheckBoxes) {
            let subChildren:CheckBox[] = [];
            element.children.forEach(subElement => {
              subChildren.push({name:subElement.name, completed:false, color:"primary"});
            });
            this.categoryCheckBoxes.subCheckBoxes.push({name:element.name, completed:false, color:"primary", subCheckBoxes:subChildren});
          }
        });
      }
  }
  
    updateAllComplete(checkBox:CheckBox) {
      this.allComplete = checkBox.subCheckBoxes != null && checkBox.subCheckBoxes.every(t => t.completed);
    }
  
    someComplete(checkBox:CheckBox): boolean {
      if (checkBox.subCheckBoxes == null) {
        return false;
      }
      return checkBox.subCheckBoxes.filter(t => t.completed).length > 0;
    }

    setAll(completed:boolean, checkBox:CheckBox) {
      let id = this.getId(checkBox.name);
      if(checkBox.subCheckBoxes) {
        checkBox.subCheckBoxes.forEach(subCheckBox => {this.setAll(completed, subCheckBox)});
        checkBox.completed = completed;
      } else if (completed) {
        this.addId(id);
        checkBox.completed = completed;
      } else {
        this.removeId(id);
        checkBox.completed = completed;
      }
    }

    getId(name:string): number {
      let id = -1;
      network.nodes.forEach(element => {
        if(element.name && element.name == name) {
          id = element.id;
        }
      });
      return id;
    }

    addId(id:number) {
      if(this.ids.indexOf(id) != 1) {
        this.ids.push(id);
      }
    }

    removeId(id:number) {
      this.ids = this.ids.filter(number => number !== id);
    }



  changeSelection() {
    this.networkComp.changeSelection(this.ids);
  }

}
