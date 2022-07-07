import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { network_alt } from './data/alt/network_alt';
import { network_swiss } from './data/swiss/network_swiss';
import { network_all } from './data/both/network_all';
import { domain_all } from './data/both/domain_all';
import { domain_swiss } from './data/swiss/domain_swiss';
import { domain_alt } from './data/alt/domain_alt';
import { hierarchy_alt } from './data/alt/hierarchy_alt';
import { hierarchy_swiss } from './data/swiss/hierarchy_swiss';
import { color_alt } from './data/alt/color_alt';
import { color_swiss } from './data/swiss/color';
import { color3p_alt } from './data/alt/color3p';
import { color3p_swiss } from './data/swiss/color3p';
import { category_alt } from './data/alt/category_alt';
import { category_swiss } from './data/swiss/category_swiss';
import { color3p_all } from './data/both/color3p_all';
import { color_all } from './data/both/color_all';
import { hierarchy_all } from './data/both/hierarchy_all';
import { category_all } from './data/both/category_all';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private currentDataSetSource = new BehaviorSubject<any>({ network: network_swiss, domain: domain_swiss, hierarchy: hierarchy_swiss, color: color_swiss, color3p: color3p_swiss, category: category_swiss })

  private currenttDataSet = this.currentDataSetSource.asObservable()


  private selectedNodeSource = new BehaviorSubject({})

  private selecetedNode = this.selectedNodeSource.asObservable()

  constructor() { }

  getCurrentDataSet() {
    return this.currenttDataSet
  }

  setCurrentDataSet(data: any) {
    this.currentDataSetSource.next(data)
  }

  setSelectedNode(node: any) {
    this.selectedNodeSource.next(node)
  }

  getSelectedNode() {
    return this.selecetedNode
  }

  changeDataSet(data: string) {
    if (data == 'all') {
      this.setCurrentDataSet({ network: network_all, domain: domain_all, color3p: color3p_all, color: color_all, hierarchy: hierarchy_all, category: category_all })
    }
    if (data == 'alt') {
      this.setCurrentDataSet({ network: network_alt, domain: domain_alt, hierarchy: hierarchy_alt, color: color_alt, color3p: color3p_alt, category: category_alt })
    }
    if (data == 'swiss') {
      this.setCurrentDataSet({ network: network_swiss, domain: domain_swiss, hierarchy: hierarchy_swiss, color: color_swiss, color3p: color3p_swiss, category: category_swiss })
    }
  }

  createDomains3Data(data: any) {
    const barData = data.map((element: any) => {
      let count = element.thirdParties.length - 1
      let name = element.thirdParties[0].requestDomain += `u. ${count} weitere`
      return { value: element.name, name }
    })
    return barData
  }

}
