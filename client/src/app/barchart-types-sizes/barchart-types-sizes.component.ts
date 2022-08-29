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
      .domain(data.meta.groups)
      .range([0, this.width])
      .padding(0.2);
    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x).tickSizeOuter(0))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    this.y = d3
      .scaleLinear()
      .domain([0, data.meta.maxTotal])
      .range([this.height, 0]);
    this.svg.append('g').call(d3.axisLeft(this.y));

    const stackedData = d3.stack().keys(data.meta.subgroups)(data.chartData);

    this.svg
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join('g')
      .attr('fill', (d: any) => {
        return data.meta.color[d.key];
      })
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d: any) => d)
      .join('rect')
      .attr('x', (d: any) => {
        return this.x(d.data.meta.name);
      })
      .attr('y', (d: any) => this.y(d[1]))
      .attr('height', (d: any) => {
        return this.y(d[0]) - this.y(d[1]);
      })
      .attr('width', this.x.bandwidth());

    this.barValue = this.svg
      .selectAll('.barValue')
      .data(data.chartData)
      .join('text')
      // TODO calculation for y and x are bad
      .attr('y', (d: any) => {
        return (
          this.height - (this.height / data.meta.maxTotal) * d.meta.total - 5
        );
      })
      .attr('x', (d: any, i: any) => {
        return this.width * (1 / data.chartData.length) * i + 20;
      })
      .text((d: any) => {
        return d.meta.total;
      })
      .style('font-size', 12)
      .style('text-anchor', 'middle');
  }
}
