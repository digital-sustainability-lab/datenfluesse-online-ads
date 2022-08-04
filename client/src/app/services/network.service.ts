import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DataService } from '../data.service';

interface NavigationDisabled {
  forwardDisabled: boolean;
  backDisabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(public dataService: DataService) {
    this.init();
  }

  private _historyIndex: number = 0;
  private _history: Set<number>[] = [];
  private _alldata: any;
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

  navigationDisabled: Subject<NavigationDisabled> =
    new Subject<NavigationDisabled>();

  checkBoxUpdate: Subject<string[]> = new Subject<string[]>();

  private init() {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this._alldata = { ...data.network };
    });
  }

  updateIds(ids: Set<number>) {
    if (ids.size === 0) return;
    const data = this.generateDataByIds(ids);
    let checkBoxNames = this.getNames(data);
    this.updateCheckBox(checkBoxNames);
  }

  selectionChanged(ids: any) {
    this.updateHistory(ids);
    this.currentIds.next(ids);
  }

  navigateSelection(direction: number) {
    this.historyIndex += direction;
    this.currentIds.next(this.history[this.historyIndex]);
  }

  selectNode(event: any) {
    let id = event.target.__data__.id;
    let newIds = this.currentIds.value;
    newIds.add(id);
    this.selectionChanged(newIds);
    this.handleDisabled(this.historyIndex, this.history.length);
  }

  updateHistory(ids: Set<number>) {
    const newIds = new Set(ids);
    if (
      this.history.length === 0 ||
      !this.dataIsSame(newIds, this.history[this.historyIndex])
    ) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(newIds);
      this.historyIndex = this.history.length - 1;
    }
  }

  dataIsSame(newIds: Set<number>, currentIds: Set<number>): boolean {
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

  handleDisabled(historyIndex: number, historyLength: number) {
    let navigationDisabled: NavigationDisabled = {
      forwardDisabled: historyIndex + 1 === historyLength,
      backDisabled: historyIndex === 0,
    };
    this.navigationDisabled.next(navigationDisabled);
  }

  updateCheckBox(checkBoxNames: string[]) {
    this.checkBoxUpdate.next(checkBoxNames);
  }

  getNames(data: any): string[] {
    // TODO do we need the filter function?
    return data.nodes
      .filter((node: any) => this.currentIds.value.has(node.id))
      .map((node: any) => node.name);
  }

  generateDataByIds(ids: Set<number>): any {
    let links = this.generateLinksByIds(ids);
    return {
      links: links,
      nodes: this.generateNodesByLinks(links),
    };
  }

  generateLinksByIds(ids: Set<number>): any[] {
    return JSON.parse(JSON.stringify(this.alldata.links)).filter((el: any) => {
      if (ids.has(el.source)) return true;
      return ids.has(el.target);
    });
  }

  generateNodesByLinks(links: any[]): any[] {
    const ids = links.flatMap((el: any) => {
      return [el.source, el.target];
    });
    return this.alldata.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true;
      return false;
    });
  }
}
