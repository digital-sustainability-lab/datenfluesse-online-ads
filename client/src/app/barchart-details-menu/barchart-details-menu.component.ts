import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CheckBox as Checkbox } from '../network-menu/network-menu.component';
import { BarchartDetailsService } from '../services/barchart-details.service';

@Component({
  selector: 'app-barchart-details-menu',
  templateUrl: './barchart-details-menu.component.html',
  styleUrls: ['./barchart-details-menu.component.css'],
})
export class BarchartDetailsMenu implements OnInit {
  data: any;
  checkboxes: Checkbox = {
    name: 'all',
    completed: true,
    indeterminate: false,
    color: 'primary',
    subCheckboxes: [],
  };

  constructor(private barchartDetailsService: BarchartDetailsService) {}

  ngOnInit(): void {
    this.barchartDetailsService.data.subscribe((data: any) => {
      console.log(data.meta.subgroups);
      console.log(data.meta.subgroupsUnfiltered);
      // if categorization changed, reset the checkboxes
      if (data.meta.categorization != this.data?.meta.categorization) {
        this.checkboxes = {
          name: 'all',
          completed: true,
          indeterminate: false,
          color: 'primary',
          subCheckboxes: [],
        };
        this.checkboxes.subCheckboxes = [];
        for (let subgroup of data.meta.subgroupsUnfiltered) {
          this.checkboxes.subCheckboxes.push({
            name: subgroup,
            completed: true,
            indeterminate: false,
            color: 'primary',
          });
        }
      }
      this.data = data;
    });
  }

  updateDataToDisplay(event: any) {
    this.barchartDetailsService.dataSelection.next(event.target.value);
  }

  updateCategorization(event: any) {
    this.barchartDetailsService.categorySelection.next(event.target.value);
    this.barchartDetailsService.filterSubgroups.next(undefined);
  }

  updateOrder(event: any) {
    this.barchartDetailsService.orderSelection.next(event.target.value);
  }

  applyFilter() {
    console.log('apply filter');
    if (this.checkboxes.subCheckboxes)
      this.barchartDetailsService.filterSubgroups.next(
        this.checkboxes.subCheckboxes
          ?.filter((subCheckbox) => subCheckbox.completed == true)
          .map((subCheckbox) => subCheckbox.name)
      );
  }

  handleSuperCheckbox(checkbox: Checkbox) {
    if (checkbox.hasOwnProperty('indeterminate') && checkbox.subCheckboxes) {
      const numCheckedSubCheckboxes = checkbox.subCheckboxes.filter(
        (subCheckbox: Checkbox) => subCheckbox.completed
      ).length;
      checkbox.indeterminate =
        checkbox.subCheckboxes.length !== numCheckedSubCheckboxes &&
        numCheckedSubCheckboxes !== 0;
      checkbox.completed =
        checkbox.subCheckboxes.length === numCheckedSubCheckboxes;
    }
  }

  setIndividuals(checked: boolean, checkbox: Checkbox) {
    this.checkboxes.subCheckboxes?.forEach((element) => {
      element.completed = checked;
    });
  }

  updateCheckboxes(event: any, checkbox: Checkbox) {
    let checked = event.checked;
    checkbox.completed = checked;
    if (checkbox.subCheckboxes) {
      this.setIndividuals(checked, checkbox);
    }
    this.handleSuperCheckbox(this.checkboxes);
  }

  setAll(event: MatCheckboxChange) {
    this.checkboxes.completed = event.checked;
    this.checkboxes.subCheckboxes?.forEach((element) => {
      this.updateCheckboxes(event, element);
    });
  }
}
