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

  categorySelection: BehaviorSubject<string> = new BehaviorSubject<string>(
    'type'
  );

  filterSubgroups: BehaviorSubject<string[] | undefined> = new BehaviorSubject<
    string[] | undefined
  >(undefined);

  constructor(private dataService: DataService) {
    this.init();
  }

  init() {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this.rawData.next(data.types);
    });
    this.dataSelection
      .pipe(
        combineLatestWith(
          this.orderSelection,
          this.rawData,
          this.categorySelection,
          this.filterSubgroups
        )
      )
      .subscribe(
        ([
          dataSelection,
          order,
          rawData,
          categorySelection,
          filterSubgroups,
        ]: any) => {
          this.updateData(
            dataSelection,
            order,
            rawData,
            categorySelection,
            filterSubgroups
          );
        }
      );
  }

  updateData(
    dataSelection: string,
    order: string,
    rawData: any,
    categorySelection: string,
    filterSubgroups: string[] | undefined
  ) {
    let data = { chartData: {}, meta: {} };

    let subgroupsUnfiltered = this.getSubgroupsByRawdata(
      rawData,
      categorySelection
    );

    data.chartData = this.generateChartData(
      rawData,
      dataSelection,
      categorySelection,
      filterSubgroups
    );

    data.meta = this.generateMetaData(
      data.chartData,
      dataSelection,
      categorySelection,
      filterSubgroups,
      subgroupsUnfiltered
    );

    data = this.orderData(data, order);

    this.data.next(data);
  }

  generateChartData(
    rawData: any,
    dataSelection: string,
    categorySelection: string,
    filterSubgroups: string[] | undefined
  ) {
    let categoryData = [];
    let subgroups = this.getSubgroupsByRawdata(rawData, categorySelection);

    if (filterSubgroups) {
      subgroups = subgroups.filter((subgroup) =>
        filterSubgroups.includes(subgroup)
      );
    }

    for (let page in rawData) {
      let group: {
        meta: {
          name: string;
          total: number;
          domains: string[];
        };
        [category: string]: any;
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
          // if the request categorization is included in the filtered subgroups, then add it
          if (subgroups.includes(request[categorySelection])) {
            group[request[categorySelection]] += this.calcAmount(
              request,
              dataSelection
            );
            total += this.calcAmount(request, dataSelection);
          }
        }
      }
      group.meta.total = total;
      categoryData.push(group);
    }
    return categoryData;
  }

  getSubgroupsByRawdata(rawData: any, categorySelection: string): string[] {
    let subgroups = new Set<string>();
    for (let page in rawData) {
      for (let thirdParty in rawData[page]) {
        for (let request of rawData[page][thirdParty]) {
          subgroups.add(request[categorySelection]);
        }
      }
    }
    return [...subgroups];
  }

  calcAmount(request: any, dataSelection: string) {
    if (dataSelection === 'payload') {
      return Math.round(request.size / 1000);
    }
    return 1;
  }

  generateMetaData(
    data: any,
    dataSelection: string,
    categorySelection: string,
    filterSubgroups: string[] | undefined,
    subgroupsUnfiltered: string[]
  ) {
    console.log(data);
    let meta = {
      groups: this.getGroups(data),
      subgroups: this.getSubgroups(data, filterSubgroups),
      subgroupsUnfiltered: subgroupsUnfiltered,
      maxTotal: this.getYMax(data),
      color: {},
      description: this.getDescription(dataSelection, categorySelection),
      categorization: categorySelection,
      xLabel: this.getXLabel(dataSelection),
      yLabel: this.getYLabel(dataSelection),
    };

    meta.color = this.getColor(meta.subgroupsUnfiltered);

    return meta;
  }

  getGroups(chartData: any) {
    return chartData.map((d: any) => d.meta.name);
  }

  getSubgroups(
    chartData: any,
    filterSubgroups?: string[] | undefined
  ): string[] {
    let subgroups: string[] = [];
    for (let group of chartData) {
      for (let subgroup in group) {
        if (subgroup != 'meta' && !subgroups.includes(subgroup)) {
          subgroups.push(subgroup);
        }
      }
    }
    if (filterSubgroups) {
      return subgroups.filter((subgroup: string) =>
        filterSubgroups.includes(subgroup)
      );
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

  getDescription(dataSelection: string, categorySelection: string): string {
    let result = '';
    if (dataSelection === 'request') {
      result += 'Number of requests made, categorized in ';
    } else if (dataSelection === 'payload') {
      result += 'Payload sizes of requests, categorized in ';
    }
    if (categorySelection === 'category') {
      return result + 'categories.';
    } else if (categorySelection === 'type') {
      return result + 'types.';
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
    for (let [index, category] of subgroups.entries()) {
      color[category] = d3.interpolateSpectral(index / subgroups.length);
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
