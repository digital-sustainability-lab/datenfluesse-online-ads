import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DataService } from '../services/data.service';

interface NavigationDisabled {
  forwardDisabled: boolean;
  backDisabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
/**
 * the goal of NetworkService is to handle all the data that is used in the network visualization
 */
export class NetworkService {
  constructor(public dataService: DataService) {
    this.init();
  }

  private _historyIndex: number = 0;
  /**
   * an array of number Sets to store the steps in the history
   */
  private _history: Set<number>[] = [];
  private _alldata: any;
  /**
   * currentIds is the observable that gives the network component the ids for all the nodes that will be shown
   */
  currentIds: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(
    new Set()
  );

  public get historyIndex() {
    return this._historyIndex;
  }
  public set historyIndex(value) {
    this._historyIndex = value;
  }

  public get history(): Set<number>[] {
    return this._history;
  }
  public set history(value: Set<number>[]) {
    this._history = value;
  }
  public get alldata(): any {
    return this._alldata;
  }
  public set alldata(value: any) {
    this._alldata = value;
  }

  /**
   * navigationDisabled's purpose is to ensure that going backwards and forward in the history won't use an index out of bounds
   */
  navigationDisabled: Subject<NavigationDisabled> =
    new Subject<NavigationDisabled>();

  /**
   * this observable ensures that the nodes displayed in the network visualization and the checkboxes from the network menu component are always up to date
   */
  checkBoxUpdate: Subject<string[]> = new Subject<string[]>();

  /**
   * sets up some initial values. also used when loading another data set.
   */
  init() {
    this.history = this.history.slice(0, 0);
    this.historyIndex = 0;
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this._alldata = { ...data.network };
    });
  }

  /**
   * updateIds is called by the network component ensures that the checkboxes are up to date
   * @param ids the node ids that are about to be used for the update function
   * @returns makes nothing when there are no ids to display
   */
  updateIds(ids: Set<number>) {
    if (ids.size === 0) return;
    const data = this.generateDataByIds(ids);
    let checkBoxNames = this.getNames(data);
    this.updateCheckBox(checkBoxNames);
  }

  /**
   * this function causes the network viz to update by currentIds.next(). it also updates the history
   * @param ids the node ids that are going to be used in the network viz
   */
  selectionChanged(ids: any) {
    this.updateHistory(ids);
    this.currentIds.next(ids);
  }

  /**
   * is called by the network menu components when going back or forward in the history
   * @param direction the direction is either -1 (for going back) or +1 (for going forward)
   */
  navigateSelection(direction: number) {
    this.historyIndex += direction;
    this.currentIds.next(this.history[this.historyIndex]);
  }

  /**
   * this function adds the id of the node clicked in the network viz
   * @param event the event that brings with it the id needed to update the selection
   */
  selectNode(event: any) {
    let id = event.target.__data__.id;
    let newIds = new Set<number>(this.currentIds.value);
    newIds.add(id);
    this.selectionChanged(newIds);
    this.handleDisabled(this.historyIndex, this.history.length);
  }

  /**
   * handles updating the history
   * @param ids the node ids that are currently in selection
   */
  updateHistory(ids: Set<number>) {
    const newIds = new Set(ids);
    if (
      // ensures that no index out of bounds is accessed
      (this.history.length === 0 ||
        // if the same ids are entered than before the history won't update
        !this.dataIsSame(newIds, this.history[this.historyIndex])) &&
      // if no ids are entered the history won't update
      ids.size !== 0
    ) {
      // makes sure that updating the history on any index discards all entries after said index
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(newIds);
      this.historyIndex = this.history.length - 1;
    }
  }

  /**
   * makes sure that the new set of node ids are not the same as the ones at the current history index. therefore
   * @param newIds the new ids to compare to the current ids in the history
   * @param currentIds the node ids at the current index of the history
   * @returns true if the data is the same as before -> so history won't update
   */
  private dataIsSame(newIds: Set<number>, currentIds: Set<number>): boolean {
    let newData = this.generateDataByIds(newIds);
    let currentData = this.generateDataByIds(currentIds);
    if (newData.nodes.length === currentData.nodes.length) {
      for (let newNode of newData.nodes) {
        if (!currentData.nodes.includes(newNode)) return false;
      }
      return true;
    }
    return false;
  }

  /**
   * handles disabling the navigation buttons in the network menu component
   * @param historyIndex the current index in the history
   * @param historyLength the length of the history
   */
  handleDisabled(historyIndex: number, historyLength: number) {
    let navigationDisabled: NavigationDisabled = {
      forwardDisabled: historyIndex + 1 === historyLength,
      backDisabled: historyIndex === 0,
    };
    // uses this observable to let the network menu component know
    this.navigationDisabled.next(navigationDisabled);
  }

  /**
   * gets the names of the nodes. is used for updating the checkboxes
   * @param data the data that is currently used in the network viz
   * @returns an array of strings containing all the node.name
   */
  private getNames(data: any): string[] {
    // TODO do we need the filter function?
    return data.nodes
      .filter((node: any) => this.currentIds.value.has(node.id))
      .map((node: any) => node.name);
  }

  /**
   * lets the network menu component know that the checkboxes have to change
   * @param checkBoxNames a string array containg all the nodes names
   */
  private updateCheckBox(checkBoxNames: string[]) {
    this.checkBoxUpdate.next(checkBoxNames);
  }

  /**
   * generates all the network data needed by the node ids. it is used for checks and for the update function in the network viz
   * @param ids the node ids
   * @returns the network data {nodes: any[], links: any[]}
   */
  generateDataByIds(ids: Set<number>): any {
    let links = this.generateLinksByIds(ids);
    return {
      links: links,
      nodes: this.generateNodesByLinks(links),
    };
  }

  /**
   * a helper function for generateDataByIds.
   * @param ids the node ids given by generateDataByIds
   * @returns the links that are going to be used in the network viz
   */
  private generateLinksByIds(ids: Set<number>): any[] {
    return JSON.parse(JSON.stringify(this.alldata.links)).filter((el: any) => {
      if (ids.has(el.source)) return true;
      return ids.has(el.target);
    });
  }

  /**
   * a helper function for generateDataByIds.
   * @param links the links given by generateDataByIds
   * @returns all the nodes that are either source or target of the links.
   */
  private generateNodesByLinks(links: any[]): any[] {
    const ids = links.flatMap((el: any) => {
      return [el.source, el.target];
    });
    return this.alldata.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true;
      return false;
    });
  }
}
