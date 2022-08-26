import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { types_sizes } from '../data/both/types_sizes';

@Injectable({
  providedIn: 'root',
})
export class BarchartTypesSizesService {
  constructor() {}

  groups: any;
  subgroups: any;

  data: any = types_sizes;

  getData() {
    return {
      raw: this.data,
      chartData: this.generateTypeChartData(this.data),
    };
  }

  getGroups(chartData: any) {
    return chartData.map((d: any) => d.name);
  }

  getSubgroups(chartData: any) {
    let subgroups = new Set();
    for (let group of chartData) {
      for (let subgroup in group) {
        if (subgroup != 'name') {
          subgroups.add(subgroup);
        }
      }
    }
    return subgroups;
  }

  generateTypeChartData(data: any) {
    let typeData = [];
    let subgroups = new Set<string>();
    for (let page in data) {
      for (let thirdParty in data[page]) {
        for (let request of data[page][thirdParty]) {
          subgroups.add(request.type);
        }
      }
    }
    for (let page in data) {
      let group: { name: string; [type: string]: any } = {
        name: page,
      };
      for (let subgroup of subgroups) {
        group[subgroup] = 0;
      }
      for (let thirdParty in data[page]) {
        for (let request of data[page][thirdParty]) {
          group[request.type]++;
        }
      }
      typeData.push(group);
    }
    return typeData;
  }

  generatePayloadChartData(data: any) {
    let typeData = [];
    let subgroups = new Set<string>();
    for (let page in data) {
      for (let thirdParty in data[page]) {
        for (let request of data[page][thirdParty]) {
          subgroups.add(request.type);
        }
      }
    }
    for (let page in data) {
      let group: { name: string; [type: string]: any } = {
        name: page,
      };
      for (let subgroup of subgroups) {
        group[subgroup] = 0;
      }
      for (let thirdParty in data[page]) {
        for (let request of data[page][thirdParty]) {
          group[request.type] += request.size;
        }
      }
      typeData.push(group);
    }
    return typeData;
  }

  getYMax(chartData: any) {
    let max = 0;
    for (let group of chartData) {
      let currentMax = 0;
      for (let value in group) {
        if (value != 'name') {
          currentMax += group[value];
        }
      }
      max = Math.max(max, currentMax);
    }
    return max * 1.1;
  }
}
