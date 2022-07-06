import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { network_alt } from './data/network_alt';
import { network_swiss } from './data/network_swiss';
import { network_all } from './data/network_all';
import { domain_all } from './data/domain_all';
import { domain_swiss } from './data/domain_swiss';
import { domain_alt } from './data/domain_alt';
import { hierarchy_alt } from './data/hierarchy_alt';
import { hierarchy_swiss } from './data/hierarchy_swiss';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private selectedDataSetSource = new BehaviorSubject<any>(network_swiss)

  private selectedDomainSource = new BehaviorSubject<any>(domain_swiss)

  private hierarchySource = new BehaviorSubject<any>(hierarchy_swiss)

  private hierarchy = this.hierarchySource.asObservable()

  private selectedDomain = this.selectedDomainSource.asObservable()

  private selectedDataSet = this.selectedDataSetSource.asObservable()

  private selectedNodeSource = new BehaviorSubject({})

  private selecetedNode = this.selectedNodeSource.asObservable()

  constructor() { }

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

  changeDataSet(data: string) {
    if (data == 'all') {
      this.selectedDataSetSource.next(network_all)
      this.selectedDomainSource.next(domain_all)
      // this.hierarchySource.next()
    }
    if (data == 'alt') {
      this.selectedDataSetSource.next(network_alt)
      this.selectedDomainSource.next(domain_alt)
      this.hierarchySource.next(hierarchy_alt)
    }
    if (data == 'swiss') {
      this.selectedDataSetSource.next(network_swiss)
      this.selectedDomainSource.next(domain_swiss)
      this.hierarchySource.next(hierarchy_swiss)
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
