import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { BarchartTypesSizesService } from '../services/barchart-types-sizes.service';

@Component({
  selector: 'app-barchart-types-sizes',
  templateUrl: './barchart-types-sizes.component.html',
  styleUrls: ['./barchart-types-sizes.component.css', '../../styles.css'],
})
export class BarchartTypesSizesComponent implements OnInit {
  constructor(private typesSizesService: BarchartTypesSizesService) {}

  ngOnInit(): void {
    this.data = this.typesSizesService.getData();
    this.groups = this.typesSizesService.getGroups(this.data.chartData);
    this.subgroups = this.typesSizesService.getSubgroups(this.data.chartData);
    this.createSVG(this.data);
  }

  margin = { top: 30, right: 30, bottom: 70, left: 60 };
  width = 2000 - this.margin.left - this.margin.right;
  height = 1000 - this.margin.top - this.margin.bottom;
  data: any;
  stackedData: any;
  svg: any;
  x: any;
  y: any;
  barValue: any;
  groups: any = [];
  subgroups: any = [];
  color: any;

  createSVG(data: any) {
    if (this.svg) {
      this.svg.remove();
    }

    console.log(data);

    this.svg = d3
      .select('#barchart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.x = d3
      .scaleBand()
      .domain(this.groups)
      .range([0, this.width])
      .padding(0.2);
    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x).tickSizeOuter(0))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    const max = this.typesSizesService.getYMax(data.chartData);

    this.y = d3.scaleLinear().domain([0, max]).range([this.height, 0]);
    this.svg.append('g').call(d3.axisLeft(this.y));

    this.barValue = this.svg
      .selectAll('.barValue')
      .data(data.chartData)
      .enter()
      .append('text');

    this.color = d3
      .scaleOrdinal()
      .domain(this.subgroups)
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

    const stackedData = d3.stack().keys(this.subgroups)(data.chartData);

    this.svg
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join('g')
      .attr('fill', (d: any) => this.color(d.key))
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d: any) => d)
      .join('rect')
      .attr('x', (d: any) => this.x(d.data.name))
      .attr('y', (d: any) => this.y(d[1]))
      .attr('height', (d: any) => {
        return this.y(d[0]) - this.y(d[1]);
      })
      .attr('width', this.x.bandwidth());

    this.barValue = this.svg
      .selectAll('.barValue')
      .data(data.chartData)
      .join('text')
      .attr('y', (d: any) => {
        console.log(d);
        return d;
      })
      .attr('x', (d: any, i: any) => {
        console.log(d);
        console.log(i);
        return 30 + i * 40;
      })
      .text((d: any) => d.name);
  }
}
