import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {
  BehaviorSubject,
  combineLatestWith,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class BarchartDetailsService {
  rawData: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.dataService.getCurrentDataSet()
  );

  data: ReplaySubject<any> = new ReplaySubject<any>(1);

  dataToDisplay: Observable<any> = new Observable<any>();

  dataSelection: BehaviorSubject<string> = new BehaviorSubject<string>(
    'request'
  );

  orderSelection: BehaviorSubject<string> = new BehaviorSubject<string>(
    'value'
  );

  constructor(private dataService: DataService) {
    this.init();
  }

  init() {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this.rawData.next(data.types);
    });
    this.dataSelection
      .pipe(combineLatestWith(this.orderSelection, this.rawData))
      .subscribe(([dataSelection, order, rawData]: any) => {
        this.updateData(dataSelection, order, rawData);
      });
  }

  updateData(dataSelection: string, order: string, rawData: any) {
    let data = { chartData: {}, meta: {} };

    data.chartData = this.generateChartData(rawData, dataSelection);

    data.meta = this.generateMetaData(data.chartData, dataSelection);

    data = this.orderData(data, order);

    console.log(data);

    this.data.next(data);
  }

  generateChartData(rawData: any, dataSelection: string) {
    let typeData = [];
    let subgroups = this.getSubgroupsByRawdata(rawData);

    for (let page in rawData) {
      let group: {
        meta: {
          name: string;
          total: number;
          domains: string[];
        };
        [type: string]: any;
      } = {
        meta: { name: page, total: 0, domains: [] },
      };
      for (let subgroup of subgroups) {
        group[subgroup] = 0;
      }
      let total = 0;
      for (let thirdParty in rawData[page]) {
        group.meta['domains'].push(thirdParty);
        for (let request of rawData[page][thirdParty]) {
          group[request.type] += this.calcAmount(request, dataSelection);
          total += this.calcAmount(request, dataSelection);
        }
      }
      group.meta.total = total;
      typeData.push(group);
    }
    return typeData;
  }

  getSubgroupsByRawdata(rawData: any): string[] {
    let subgroups = new Set<string>();
    for (let page in rawData) {
      for (let thirdParty in rawData[page]) {
        for (let request of rawData[page][thirdParty]) {
          subgroups.add(request.type);
        }
      }
    }
    return [...subgroups];
  }

  calcAmount(request: any, dataSelection: string) {
    if (dataSelection === 'request') {
      return 1;
    } else if (dataSelection === 'payload') {
      return Math.round(request.size / 1000);
    }
    return 1;
  }

  generateMetaData(data: any, dataSelection: string) {
    let meta = {
      groups: this.getGroups(data),
      subgroups: this.getSubgroups(data),
      maxTotal: this.getYMax(data),
      color: {},
      description: this.getDescription(dataSelection),
      xLabel: this.getXLabel(dataSelection),
      yLabel: this.getYLabel(dataSelection),
    };

    meta.color = this.getColor(meta.subgroups);

    return meta;
  }

  getGroups(chartData: any) {
    return chartData.map((d: any) => d.meta.name);
  }

  getSubgroups(chartData: any): string[] {
    let subgroups: string[] = [];
    for (let group of chartData) {
      for (let subgroup in group) {
        if (subgroup != 'meta' && !subgroups.includes(subgroup)) {
          subgroups.push(subgroup);
        }
      }
    }
    return subgroups;
  }

  getYMax(chartData: any) {
    let max = 0;
    for (let group of chartData) {
      max = Math.max(group.meta.total, max);
    }
    // TODO simply multiplying by 1.1 is not that good of a solution
    return max * 1.1;
  }

  getDescription(dataSelection: string): string {
    if (dataSelection === 'request') {
      return 'Number of requests made, categorized in types.';
    } else if (dataSelection === 'payload') {
      return 'Payload sizes of requests, categorized in types.';
    }
    return 'something went wrong';
  }

  getXLabel(dataSelection: string): string {
    if (dataSelection === 'request') {
      return 'Pages';
    } else if (dataSelection === 'payload') {
      return 'Pages';
    }
    return 'something went wrong';
  }

  getYLabel(dataSelection: string): string {
    if (dataSelection === 'request') {
      return 'Number of requests';
    } else if (dataSelection === 'payload') {
      return 'Payload sizes in kilobytes';
    }
    return 'something went wrong';
  }

  getColor(subgroups: any) {
    let color: any = {};
    for (let [index, subgroup] of subgroups.entries()) {
      color[subgroup] = d3.interpolateRainbow(index / (subgroups.length - 1));
    }
    return color;
  }

  orderData(data: any, order: string): any {
    if (order === 'alphabetical') {
      return this.orderAlphabetical(data, 1);
    } else if (order === 'alphabeticalReversed') {
      return this.orderAlphabetical(data, -1);
    } else if (order === 'value') {
      return this.orderBytotal(data);
    }
    return data;
  }

  orderAlphabetical(data: any, reverseFactor: number): any {
    data.chartData = data.chartData.sort((a: any, b: any) => {
      if (a.meta.name < b.meta.name) return -1 * reverseFactor;
      if (a.meta.name > b.meta.name) return 1 * reverseFactor;
      return 0;
    });

    data = this.orderGroups(data);

    return data;
  }

  orderBytotal(data: any): any {
    //sorting by total
    data.chartData = data.chartData
      .sort((a: any, b: any) => {
        return a.meta.total - b.meta.total;
      })
      .reverse();

    data = this.orderGroups(data);

    return data;
  }

  orderGroups(data: any) {
    // sorting groups too. otherwise it wouldn't have an effect on the barchart
    data.meta.groups = data.meta.groups.sort((a: any, b: any) => {
      const chartNames = data.chartData.map((d: any) => d.meta.name);
      return chartNames.indexOf(a) - chartNames.indexOf(b);
    });
    return data;
  }
}
