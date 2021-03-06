import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
// import { colors } from './colors';
import { DataService } from '../data.service';
import { Domain } from '../interfaces';
import { NetworkNewComponent } from '../network-new/network-new.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { example } from '../hierarch-bar/example';
import { index } from 'd3';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { elementAt } from 'rxjs';

export interface CheckBox {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subCheckBoxes?: CheckBox[];
}

@Component({
  selector: 'app-network-menu',
  templateUrl: './network-menu.component.html',
  styleUrls: ['./network-menu.component.css'],
})
export class NetworkMenuComponent implements OnInit {
  domainCheckBoxes: CheckBox = {
    name: 'all',
    completed: false,
    color: 'primary',
    subCheckBoxes: [],
  };

  categoryCheckBoxes: CheckBox = {
    name: 'all',
    completed: false,
    color: 'primary',
    subCheckBoxes: [],
  };

  domains: any
  ids: number[] = [];
  network: any
  color: any
  color3p: any
  categories: any; // makes categories not reference the category data
  backDisabled: any;
  forwardDisabled: any;

  constructor(private networkComp: NetworkNewComponent, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this.color = data.color
      this.color3p = data.color3p
      this.network = JSON.parse(JSON.stringify(data.network))
      this.domains = data.domain
      this.categories = data.hierarchy.children.slice()
      this.domainCheckBoxes.subCheckBoxes = []
      this.domains.forEach((element: any) => {
        if (this.domainCheckBoxes.subCheckBoxes) {
          this.domainCheckBoxes.subCheckBoxes.push({
            name: element.name,
            completed: false,
            color: 'primary',
          });
        }
      });
      this.backDisabled = true;
      this.forwardDisabled = true;
    })




    this.categories.shift();
    if (this.categories) {
      let noCat = this.domainCheckBoxes.subCheckBoxes?.slice();
      this.categories.forEach((element: any) => {
        if (this.categoryCheckBoxes.subCheckBoxes) {
          let subChildren: CheckBox[] = [];
          element.children.forEach((subElement: any) => {
            subChildren.push({
              name: subElement.name,
              completed: false,
              color: 'primary',
            });
            if (noCat) {
              noCat = noCat.filter((t) => t.name != subElement.name);
            }
          });
          this.categoryCheckBoxes.subCheckBoxes.push({
            name: element.name,
            completed: false,
            color: 'primary',
            subCheckBoxes: subChildren,
          });
        }
      });
      // adding in categoryless domains
      this.categoryCheckBoxes.subCheckBoxes?.push({
        name: 'No Category',
        completed: false,
        color: 'primary',
        subCheckBoxes: noCat,
      });
    }
  }

  someComplete(checkBox: CheckBox): boolean {
    if (checkBox.subCheckBoxes == null) {
      return false;
    }
    return (
      checkBox.subCheckBoxes.filter((t) => t.completed).length > 0 &&
      !(
        checkBox.subCheckBoxes.filter((t) => t.completed).length ==
        checkBox.subCheckBoxes.length
      )
    );
  }

  allComplete(checkBox: CheckBox) {
    if (
      checkBox.subCheckBoxes?.filter((t) => t.completed).length ==
      checkBox.subCheckBoxes?.length
    ) {
      checkBox.completed = true;
    } else {
      checkBox.completed = false;
    }
  }

  updateCheckBoxes(event: MatCheckboxChange, checkBox: CheckBox) {
    let id = this.getId(checkBox.name);
    let checked = event.checked;
    if (id != -1) {
      this.setIndividuals(checked, id);
    } else {
      checkBox.subCheckBoxes?.forEach((element) => {
        this.setIndividuals(checked, this.getId(element.name));
      });
    }
  }

  setIndividuals(checked: boolean, id: number) {
    this.domainCheckBoxes.subCheckBoxes?.forEach((element) => {
      if (this.getId(element.name) == id) {
        element.completed = checked;
        if (checked) {
          this.addId(id);
        } else {
          this.removeId(id);
        }
      }
    });
    this.categoryCheckBoxes.subCheckBoxes?.forEach((element) => {
      element.subCheckBoxes?.forEach((subElement) => {
        if (this.getId(subElement.name) == id) {
          subElement.completed = checked;
          if (checked) {
            this.addId(id);
          } else {
            this.removeId(id);
          }
        }
      });
      this.someComplete(element);
      this.allComplete(element);
    });
  }

  setAll(event: MatCheckboxChange, checkBox: CheckBox) {
    this.domainCheckBoxes.completed = event.checked;
    this.domainCheckBoxes.subCheckBoxes?.forEach((element) => {
      this.updateCheckBoxes(event, element);
    });

    this.categoryCheckBoxes.completed = event.checked;
    this.categoryCheckBoxes.subCheckBoxes?.forEach((element) => {
      this.updateCheckBoxes(event, element);
    });
  }

  getId(name: string): number {
    let id = -1;
    this.network.nodes.forEach((element: any) => {
      if (element.name && element.name == name) {
        id = element.id;
      }
    });
    return id;
  }

  addId(id: number) {
    if (this.ids.indexOf(id) != 1) {
      this.ids.push(id);
    }
  }

  removeId(id: number) {
    this.ids = this.ids.filter((number) => number !== id);
  }

  changeSelection() {
    this.networkComp.changeSelection(this.ids);
    this.handleDisability();
  }

  navigateSelection(direction:number) {
    this.networkComp.navigateSelection(direction);
    this.handleDisability();
  }

  handleDisability() {
    let index = this.networkComp.historyIndex;
    let length = this.networkComp.history.length;
    if (index + 1 == length) {
      this.forwardDisabled = true;
    } else {
      this.forwardDisabled = false;
    }
    if (index == 0) {
      this.backDisabled = true;
    } else {
      this.backDisabled = false;
    } 
  }
}
