import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DOMAINS3 } from '../3DOMAINS';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  data: any;

  margin = { top: 20, right: 30, bottom: 40, left: 300 };
  width = 1000 - this.margin.left - this.margin.right;
  height = 400 - this.margin.top - this.margin.bottom;

  svg: any;

  x: any;

  y: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data = this.dataService.createDomains3Data(DOMAINS3);
    console.log(this.data);
    this.createSVG();
    this.initAxis();
    this.initBars();
  }

  createSVG() {
    this.svg = d3
      .select('#my_dataviz')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  initAxis() {
    this.x = d3.scaleLinear().domain([0, 100]).range([0, this.width]);
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    this.y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(
        this.data.map(function (d: any) {
          return d.name;
        })
      )
      .padding(0.5);
    this.svg.append('g').call(d3.axisLeft(this.y));
  }

  initBars() {
    this.svg
      .selectAll('myRect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', this.x(0))
      .attr('y', (d: any) => {
        return this.y(d.name);
      })
      .attr('width', (d: any) => {
        return this.x(d.value);
      })
      .attr('height', this.y.bandwidth())
      .attr('fill', '#69b3a2');
  }
}
