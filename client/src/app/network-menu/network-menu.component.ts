import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { NetworkService } from '../services/network.service';

export interface CheckBox {
  name: string;
  completed: boolean;
  color: ThemePalette;
  indeterminate?: boolean;
  subCheckBoxes?: CheckBox[];
}

@Component({
  selector: 'app-network-menu',
  templateUrl: './network-menu.component.html',
  styleUrls: ['./network-menu.component.css'],
})
/**
 * the network menu component handles the checkboxes in the filtering section
 */
export class NetworkMenuComponent implements OnInit {
  @Output('selectionChanged') selectionChanged = new EventEmitter();
  @Output('onNavigateSelection') onNavigateSelection = new EventEmitter();

  domainCheckBoxes: CheckBox = {
    name: 'all',
    completed: false,
    indeterminate: false,
    color: 'primary',
    subCheckBoxes: [],
  };

  domains: any;
  /**
   * the ids that are going to be sent to the network service
   */
  ids: Set<number> = new Set();
  network: any;
  color: any;
  color3p: any;
  /**
   * a boolean to set the previous selection button's disabled state
   */
  backDisabled: boolean = false;
  /**
   * a boolean to set the next selection button's disabled state
   */
  forwardDisabled: boolean = false;

  constructor(
    private dataService: DataService,
    private networkService: NetworkService
  ) {}

  /**
   * sets up some initial values
   */
  ngOnInit(): void {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
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
      // initialize all the checkboxes as checked
      this.setAll(<MatCheckboxChange>{ checked: true });
      this.handleSuperCheckBox(this.domainCheckBoxes);
      this.selectionChanged.emit(this.ids);
    });
    // a subscription to networkService to set the navigation buttons disabled state
    this.networkService.navigationDisabled.subscribe((navDis) => {
      this.backDisabled = navDis.backDisabled;
      this.forwardDisabled = navDis.forwardDisabled;
    });
    // a subscription to networkService to set the checkboxes checked state
    this.networkService.checkBoxUpdate.subscribe((checkBoxNames: string[]) => {
      let elements = [];
      for (let name of checkBoxNames) {
        elements.push(
          this.domainCheckBoxes.subCheckBoxes?.find((subCheckBox: CheckBox) => {
            return subCheckBox.name === name;
          })
        );
      }
      if (this.domainCheckBoxes.subCheckBoxes) {
        for (let subCheckBox of this.domainCheckBoxes.subCheckBoxes) {
          subCheckBox.completed = false;
        }
      }
      for (let element of elements) {
        if (element) {
          element.completed = true;
          this.addId(this.getId(element.name));
        }
      }
      this.handleSuperCheckBox(this.domainCheckBoxes);
    });
  }

  /**
   * handles the two states (checked and indeterminate) of the super checkbox.
   * @param checkBox the superCheckBox to be handled (for this file momentarily only this.domainCheckBoxes)
   */
  handleSuperCheckBox(checkBox: CheckBox) {
    if (checkBox.hasOwnProperty('indeterminate') && checkBox.subCheckBoxes) {
      const numCheckedSubCheckBoxes = checkBox.subCheckBoxes.filter(
        (subCheckbox: CheckBox) => subCheckbox.completed
      ).length;
      checkBox.indeterminate =
        checkBox.subCheckBoxes.length !== numCheckedSubCheckBoxes &&
        numCheckedSubCheckBoxes !== 0;
      checkBox.completed =
        checkBox.subCheckBoxes.length === numCheckedSubCheckBoxes;
    }
  }

  /**
   * sets a checkboxe's state and all their subcheckboxes' states. rewrite needed.
   * @param event the event that carries the checked state
   * @param checkBox
   */
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
    this.handleSuperCheckBox(this.domainCheckBoxes);
  }

  /**
   * sets a checkboxes individual checked state. rewrite needed
   * @param checked boolean value that sets the checkBoxes completed state
   * @param id the id that will be added or removed based on the parameter checked
   */
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

  /**
   * sets a checkbox and all their subcheckboxes by the use of updatecheckboxes
   * @param event the event that carries the checked state
   */
  setAll(event: MatCheckboxChange) {
    this.domainCheckBoxes.completed = event.checked;
    this.domainCheckBoxes.subCheckBoxes?.forEach((element) => {
      this.updateCheckBoxes(event, element);
    });
  }

  /**
   * used to get the id of the node of the corresponding checkbox name
   * @param name the name of the checkbox
   * @returns the id
   */
  getId(name: string): number {
    let id = -1;
    this.network.nodes.forEach((element: any) => {
      if (element.name && element.name == name) {
        id = element.id;
      }
    });
    return id;
  }

  /**
   * adds an id to the ids. maybe obsolete
   * @param id the node id to be added
   */
  addId(id: number) {
    this.ids.add(id);
  }

  /**
   * removes an id from the ids. maybe obsolete
   * @param idToRemove the id to remove
   */
  removeId(idToRemove: number) {
    this.ids.delete(idToRemove);
  }

  /**
   * gets all the ids of the domaincheckboxes which are checked
   * @returns a set of ids which is used in network service
   */
  private getCheckedIds() {
    let idSet = new Set<number>();
    if (this.domainCheckBoxes.subCheckBoxes) {
      for (let subCheckBox of this.domainCheckBoxes.subCheckBoxes) {
        if (subCheckBox.completed) {
          idSet.add(this.getId(subCheckBox.name));
        }
      }
    }
    return idSet;
  }

  /**
   * sends the ids that are checked to the network service
   */
  changeSelection() {
    this.ids = this.getCheckedIds();
    this.selectionChanged.emit(this.ids);
    // maybe not needed here anymore
    this.networkService.handleDisabled(
      this.networkService.historyIndex,
      this.networkService.history.length
    );
  }

  /**
   * called by the html buttons. sends direction to navigate to network service
   * @param direction either -1 (for going backwards) or +1 (for going forward)
   */
  navigateSelection(direction: number) {
    this.onNavigateSelection.emit(direction);
    this.networkService.handleDisabled(
      this.networkService.historyIndex,
      this.networkService.history.length
    );
  }
}
