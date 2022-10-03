import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { network_alt } from '../data/alt/network_alt';
import { network_swiss } from '../data/swiss/network_swiss';
import { types_alt } from '../data/alt/types_alt';
import { domain_swiss } from '../data/swiss/domains_swiss';
import { category_color } from '../data/category_colors';
import { country_color } from '../data/country_colors';
import { network_both } from '../data/both/network_both';
import { domain_both } from '../data/both/domains_both';
import { category_both } from '../data/both/category_both';
import { types_both } from '../data/both/types_both';
import { domain_alt } from '../data/alt/domains_alt';
import { network_schwaiger } from '../data/schwaiger/network_schwaiger';
import { domain_schwaiger } from '../data/schwaiger/domains_schwaiger';
import { types_schwaiger } from '../data/schwaiger/types_schwaiger';
import { category_alt } from '../data/alt/category_alt';
import { category_swiss } from '../data/swiss/category_swiss';
import { types_swiss } from '../data/swiss/types_swiss';
import { hierarchy_swiss } from '../data/swiss/hierarchy_swiss';
import { hierarchy_alt } from '../data/alt/hierarchy_alt';
import { hierarchy_both } from '../data/both/hierarchy_both';
import { hierarchy_schwaiger } from '../data/schwaiger/hierarchy_schwaiger';
import { category_schwaiger } from '../data/schwaiger/category_schwaiger';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private activeDataSource = new BehaviorSubject<any>('swiss');

  private activeData = this.activeDataSource.asObservable();

  private currentDataSetSource = new BehaviorSubject<any>({
    network: network_swiss,
    domain: domain_swiss,
    hierarchy: hierarchy_swiss,
    category: category_swiss,
    types: types_swiss,
    color: category_color,
    color3p: country_color,
  });

  private currenttDataSet = this.currentDataSetSource.asObservable();

  private selectedNodeSource = new BehaviorSubject({});

  private selecetedNode = this.selectedNodeSource.asObservable();

  constructor() {}

  getCurrentDataSet() {
    return this.currenttDataSet;
  }

  getActiveData() {
    return this.activeData;
  }

  setCurrentDataSet(data: any) {
    this.currentDataSetSource.next(data);
  }

  setSelectedNode(node: any) {
    this.selectedNodeSource.next(node);
  }

  getSelectedNode() {
    return this.selecetedNode;
  }

  changeDataSet(data: string) {
    if (data == 'all') {
      this.activeDataSource.next('all');
      this.setCurrentDataSet({
        network: network_both,
        domain: domain_both,
        hierarchy: hierarchy_both,
        category: category_both,
        types: types_both,
        color: category_color,
        color3p: country_color,
      });
    }
    if (data == 'alt') {
      this.activeDataSource.next('alt');
      this.setCurrentDataSet({
        network: network_alt,
        domain: domain_alt,
        hierarchy: hierarchy_alt,
        category: category_alt,
        types: types_alt,
        color: category_color,
        color3p: country_color,
      });
    }
    if (data == 'swiss') {
      this.activeDataSource.next('swiss');
      this.setCurrentDataSet({
        network: network_swiss,
        domain: domain_swiss,
        hierarchy: hierarchy_swiss,
        category: category_swiss,
        types: types_swiss,
        color: category_color,
        color3p: country_color,
      });
    }
    if (data == 'schwaiger') {
      this.activeDataSource.next('schwaiger');
      this.setCurrentDataSet({
        network: network_schwaiger,
        domain: domain_schwaiger,
        hierarchy: hierarchy_schwaiger,
        category: category_schwaiger,
        types: types_schwaiger,
        color: category_color,
        color3p: country_color,
      });
    }
  }

  createDomains3Data(data: any) {
    const barData = data.map((element: any) => {
      let count = element.thirdParties.length - 1;
      let name =
        (element.thirdParties[0].requestDomain += `u. ${count} weitere`);
      return { value: element.name, name };
    });
    return barData;
  }
}
