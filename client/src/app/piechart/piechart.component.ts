import { Component, OnInit } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
import * as d3 from 'd3';
import { Domain } from '../interfaces';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css'],
})
export class PiechartComponent implements OnInit {
  domains: Domain[] = DOMAINS;

  private svg: any;

  private tooltip: any;

  private margin = 50;
  private witdh = 750;
  private height = 600;

  private radius = Math.min(this.witdh, this.height) / 2 - this.margin;
  private colors: any | undefined;

  constructor() {}

  ngOnInit(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.witdh)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.witdh / 2}, ${this.height / 2})`);
    this.createColors();
    this.drawChart();
    this.createTooltip();
  }

  private createColors() {
    this.colors = d3
      .scaleOrdinal()
      .domain(
        this.domains.map((domain) => domain.thirdParties.length.toString())
      )
      .range(['#c7d3ec', '#a5b8db', '#879cc4', '#677795', '#5a6782']);
  }

  private drawChart() {
    const pie = d3.pie<any>().value((d: any) => Number(d.thirdParties.length));
    this.svg
      .selectAll('pieces')
      .data(pie(this.domains))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px')
      .on('mouseover', (d: any, i: any) =>
        this.tooltip
          .style('visibility', 'visible')
          .html(this.createThirdPartyList(i.data.name))
      )
      .on('mouseout', () => this.tooltip.style('visibility', 'hidden'))
      .on('mousemove', (e: any) =>
        this.tooltip
          .style('left', e.clientX + 'px')
          .style('top', e.pageY + 'px')
      );

    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.domains))
      .enter()
      .append('text')
      .text((d: any) => d.data.name)
      .attr('transform', (d: any) => `translate(${labelLocation.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }

  private createTooltip() {
    this.tooltip = d3
      .select('figure#pie')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('z-index', '1')
      .html('<h1>Hello</h1>');
  }

  private createThirdPartyList(name: string) {
    const domain = this.domains.find((d) => d.name === name);
    const names = domain?.thirdParties.map((tp) => tp.requestDomain);
    const list = names?.join('</li><li>');
    return `<ul><li>${list}</li></ul>`;
  }
}
