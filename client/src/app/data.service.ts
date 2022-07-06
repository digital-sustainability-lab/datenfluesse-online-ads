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
import { color_alt } from './data/alt/color';
import { color_swiss } from './data/swiss/color';
import { color3p_alt } from './data/alt/color3p';
import { color3p_swiss } from './data/swiss/color3p';
import { category_alt } from './data/alt/category_alt';
import { category_swiss } from './data/swiss/category_swiss';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private currentColorSource = new BehaviorSubject<any>({ color: color_swiss, color3p: color3p_swiss })

  private currentDataSetSource = new BehaviorSubject<any>({ network: network_swiss, domain: domain_swiss, hierarchy: hierarchy_swiss, color: color_swiss, color3p: color3p_swiss, category: category_swiss })

  private currenttDataSet = this.currentDataSetSource.asObservable()

  private currentColor = this.currentColorSource.asObservable()

  private selectedDataSetSource = new BehaviorSubject<any>(network_swiss)

  private selectedDomainSource = new BehaviorSubject<any>(domain_swiss)

  private hierarchySource = new BehaviorSubject<any>(hierarchy_swiss)

  private hierarchy = this.hierarchySource.asObservable()

  private selectedDomain = this.selectedDomainSource.asObservable()

  private selectedDataSet = this.selectedDataSetSource.asObservable()

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

  getHierarchy() {
    return this.hierarchy
  }

  getSelectedNode() {
    return this.selecetedNode
  }

  getDataSet() {
    return this.selectedDataSet
  }

  getDomain() {
    return this.selectedDomain
  }

  getColor() {
    return this.currentColor
  }

  changeDataSet(data: string) {
    if (data == 'all') {
      this.setCurrentDataSet({ network: network_all, domain: domain_all })
      this.selectedDataSetSource.next(network_all)
      this.selectedDomainSource.next(domain_all)
      // this.hierarchySource.next()
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
