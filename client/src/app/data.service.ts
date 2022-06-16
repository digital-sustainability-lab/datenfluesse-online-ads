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

}
