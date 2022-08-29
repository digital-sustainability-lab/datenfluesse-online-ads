import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';
import { types_sizes } from '../data/both/types_sizes';

@Injectable({
  providedIn: 'root',
})
export class BarchartTypesSizesService {
  constructor() {}

  rawData: any = types_sizes;

  color: any;

  getData() {
    return {
      chartData: this.generateTypeChartData(this.rawData),
      meta: this.generateMetaData(this.rawData),
    };
  }

  getGroups(chartData: any) {
    return chartData.map((d: any) => d.meta.name);
  }

  getSubgroups(chartData: any): Set<string> {
    let subgroups = new Set<string>();
    for (let group of chartData) {
      for (let subgroup in group) {
        if (subgroup != 'meta') {
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
      let group: {
        // TODO add color to group
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
      for (let thirdParty in data[page]) {
        for (let request of data[page][thirdParty]) {
          group[request.type]++;
          // TODO don't calc total like this
          total++;
        }
      }
      group.meta.total = total;
      typeData.push(group);
    }
    return typeData;
  }

  generateMetaData(data: any) {
    let meta = {
      groups: this.getGroups(this.generateTypeChartData(data)),
      subgroups: this.getSubgroups(this.generateTypeChartData(data)),
      // scale: linear / log
      maxTotal: this.getYMax(this.generateTypeChartData(data)),
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
