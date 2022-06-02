import { Component, OnInit } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
import * as d3 from 'd3';
import { Domain } from '../interfaces';
import { DOMAINS3 } from '../3DOMAINS';


@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})




export class BarchartComponent implements OnInit {
  domains = DOMAINS3;
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  private tooltip: any;

  private data = [
    { "Framework": "Vue", "Stars": "166443", "Released": "2014" },
    { "Framework": "React", "Stars": "150793", "Released": "2013" },
    { "Framework": "Angular", "Stars": "62342", "Released": "2016" },
    { "Framework": "Backbone", "Stars": "27647", "Released": "2010" },
    { "Framework": "Ember", "Stars": "21471", "Released": "2011" },
  ];

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.domains);
    this.createTooltip();
  }

  private createTooltip() {
    this.tooltip = d3
      .select('figure#bar')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('z-index', '1')
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.name))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.name))
      .attr("y", (d: any) => y(d.name))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => this.height - y(d.name))
      .attr("fill", "#d04a35")
      .on('mouseover', (d: any, i: any) =>
        this.tooltip
          .style('visibility', 'visible')
          .html(this.createThirdPartyList(i))
      )
      .on('mouseout', () => this.tooltip.style('visibility', 'hidden'))
      .on('mousemove', (e: any) =>
        this.tooltip
          .style('left', e.clientX + 'px')
          .style('top', e.pageY + 'px')
      );




  }

  private createThirdPartyList(value: any) {
    debugger
    const domain = this.domains.find((d) => d.name === value.name);
    const names = domain?.thirdParties.map((tp: any) => tp.requestDomain);
    const list = names?.join('</li><li>');
    debugger
    return `<ul><li>${list}</li></ul>`;
  }


}
