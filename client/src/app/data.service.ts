import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private selectedNodeSource = new BehaviorSubject({})

  private selecetedNode = this.selectedNodeSource.asObservable()

  constructor() { }

  setSelectedNode(node: any) {
    debugger
    this.selectedNodeSource.next(node)
  }

  getSelectedNode() {
    return this.selecetedNode
  }

  createDomains3Data(data: any) {
    debugger
    const barData = data.map((element: any) => {
      let count = element.thirdParties.length - 1
      let name = element.thirdParties[0].requestDomain += `u. ${count} weitere`
      return { value: element.name, name }
    })
    return barData
  }

}
