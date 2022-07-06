import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
// import { colors } from './colors';
import { DataService } from '../data.service';
import { Domain } from '../interfaces';
import { NetworkNewComponent } from '../network-new/network-new.component';
import { network_swiss } from '../data/network_swiss';
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
  categories = example.children.slice(); // makes categories not reference the category data

  constructor(private networkComp: NetworkNewComponent, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getDataSet().subscribe((data: any) => {
      this.network = JSON.parse(JSON.stringify(data))
    })
    this.dataService.getDomain().subscribe((data: any) => {
      this.domains = data
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
    })



    this.categories.shift();
    if (this.categories) {
      let noCat = this.domainCheckBoxes.subCheckBoxes?.slice();
      this.categories.forEach((element) => {
        if (this.categoryCheckBoxes.subCheckBoxes) {
          let subChildren: CheckBox[] = [];
          element.children.forEach((subElement) => {
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
  }
}
