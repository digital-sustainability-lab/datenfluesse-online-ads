import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { types_sizes } from '../data/both/types_sizes';

@Injectable({
  providedIn: 'root',
})
export class BarchartDetailsService {
  constructor() {}

  rawData: any = types_sizes;

  data: Subject<any> = new Subject<any>();

  dataFilter: BehaviorSubject<string> = new BehaviorSubject<string>('request');

  init() {
    this.dataFilter.subscribe((dataFilter: string) => {
      this.updateData(dataFilter);
    });
  }

  updateData(dataSelection: string) {
    let data = { chartData: {}, meta: {} };

    data.chartData = this.generateChartData(this.rawData, dataSelection);

    data.meta = this.generateMetaData(data.chartData);

    data = this.sortByTotal(data);

    this.data.next(data);
  }

  sortByTotal(data: any) {
    //sorting by total
    data.chartData = data.chartData
      .sort((a: any, b: any) => {
        return a.meta.total - b.meta.total;
      })
      .reverse();

    // sorting groups too. otherwise it wouldn't have an effect on the barchart
    data.meta.groups = data.meta.groups.sort((a: any, b: any) => {
      const chartNames = data.chartData.map((d: any) => d.meta.name);
      return chartNames.indexOf(a) - chartNames.indexOf(b);
    });

    return data;
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

  generateChartData(rawData: any, dataSelection: string) {
    let typeData = [];
    let subgroups = this.getSubgroupsByRawdata(rawData);

    for (let page in rawData) {
      let group: {
        meta: {
          name: string;
          total: number;
        };
        [type: string]: any;
      } = {
        meta: { name: page, total: 0 },
      };
      for (let subgroup of subgroups) {
        group[subgroup] = 0;
      }
      let total = 0;
      for (let thirdParty in rawData[page]) {
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

  generateMetaData(data: any) {
    let meta = {
      groups: this.getGroups(data),
      subgroups: this.getSubgroups(data),
      maxTotal: this.getYMax(data),
      color: {},
    };

    meta.color = this.getColor(meta.subgroups);

    return meta;
  }

  getColor(subgroups: any) {
    let color: any = {};
    let colorScale = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        '#ee0088',
        '#ee8800',
        '#88ee00',
        '#ffccaa',
        '#ccffaa',
        '#ccaaff',
        '#99bbff',
        '#99ffbb',
        '#ff99bb',
        '#cc44aa',
        '#ccaa44',
        '#aacc44',
        '#338899',
        '#339988',
        '#993388',
      ]);
    for (let subgroup of subgroups) {
      color[subgroup] = colorScale(subgroup);
    }
    return color;
  }

  getYMax(chartData: any) {
    let max = 0;
    for (let group of chartData) {
      max = Math.max(group.meta.total, max);
    }
    return max * 1.1;
  }
}
