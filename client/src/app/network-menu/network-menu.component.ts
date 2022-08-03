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
import { NetworkService } from '../services/network.service';

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
  @Output('selectionChanged') selectionChanged = new EventEmitter();

  domainCheckBoxes: CheckBox = {
    name: 'all',
    completed: false,
    color: 'primary',
    subCheckBoxes: [],
  };

  domains: any;
  ids: number[] = [];
  network: any;
  color: any;
  color3p: any;
  backDisabled: any;
  forwardDisabled: any;

  constructor(
    private networkComp: NetworkNewComponent,
    private dataService: DataService,
    private networkService: NetworkService
  ) {}

  ngOnInit(): void {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      console.log(data);
      this.color = data.color;
      this.color3p = data.color3p;
      this.network = JSON.parse(JSON.stringify(data.network));
      this.domains = data.domain;
      this.domainCheckBoxes.subCheckBoxes = [];
      this.domains.forEach((element: any) => {
        if (this.domainCheckBoxes.subCheckBoxes) {
          this.domainCheckBoxes.subCheckBoxes.push({
            name: element.name,
            completed: true,
            color: 'primary',
          });
        }
      });
      this.backDisabled = true;
      this.forwardDisabled = true;
      this.setAll(<MatCheckboxChange>{ checked: true });
      this.selectionChanged.emit(this.ids);
    });
    this.networkService.navigationDisabled.subscribe((navDis) => {
      this.backDisabled = navDis.backDisabled;
      this.forwardDisabled = navDis.forwardDisabled;
    });
    this.networkService.checkBoxUpdate.subscribe((checkBoxName) => {
      const element = this.domainCheckBoxes.subCheckBoxes?.find(
        (subCheckBox: CheckBox) => {
          return subCheckBox.name === checkBoxName;
        }
      );
      if (element) {
        element.completed = true;
        this.addId(this.getId(element.name));
      }
    });
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
  }

  setAll(event: MatCheckboxChange) {
    this.domainCheckBoxes.completed = event.checked;
    this.domainCheckBoxes.subCheckBoxes?.forEach((element) => {
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
    if (!this.ids.includes(id)) {
      this.ids.push(id);
    }
  }

  removeId(idToRemove: number) {
    this.ids = this.ids.filter((id) => id !== idToRemove);
  }

  changeSelection() {
    this.selectionChanged.emit(this.ids);
    //this.networkComp.changeSelection(this.ids);
    this.networkService.handleDisability(
      this.networkComp.historyIndex,
      this.networkComp.historyNew.length
    );
  }

  navigateSelection(direction: number) {
    // @ts-ignore
    let checkboxChecked = document.getElementById('facebook.com')['checked'];
    console.log(checkboxChecked);
    // checkboxChecked = !checkboxChecked;
    this.networkComp.navigateSelection(direction);
    this.networkService.handleDisability(
      this.networkComp.historyIndex,
      this.networkComp.historyNew.length
    );
  }
}
