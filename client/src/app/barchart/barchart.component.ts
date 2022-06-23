import { Component, OnInit } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
import * as d3 from 'd3';
import { Domain, ThirdParty } from '../interfaces';
import { DOMAINS3 } from '../3DOMAINS';

export interface ThirdPartyShare extends ThirdParty {
  count: number;
  share: number;
}
@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css'],
})
export class BarchartComponent implements OnInit {

  /*private svg: ;
  private margin = {top: 30, right: 30, bottom: 70, left: 60};
  private width = 460 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;*/


  constructor() {}

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }

  private data : Domain[] = DOMAINS.sort(this.compare).reverse();
  private svg:any;
  private margin = 100;
  private width = 900 - (this.margin * 2);
  private height = 800 - (this.margin * 2);

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
    const x = d3.scaleLinear()
    .domain([0, this.getMaxCountAndRound()])
    .range([0, this.width]);

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    //.attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "center");
    
    // Create the Y-axis band scale
    const y = d3.scaleBand()
    .range([0, this.height])
    .domain(data.map(d => d.name)) // based on data
    .padding(0.1);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));


    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", (d: { name: string; }) => y(d.name)) // based on data
    .attr("width", (d: { thirdParties: ThirdParty[] }) => x(d.thirdParties.length)) // based on data
    .attr("height", y.bandwidth() )
    .attr("fill", "#c6a120");
  }

  private getMaxCountAndRound()  {
    var max = 0;
    DOMAINS.forEach(e => {
      if(max < e.thirdParties.length) {
        max = e.thirdParties.length;
      }
    });
    max += 10 - (max % 10);
    return max;
  }

  private compare(a:Domain, b:Domain) {
    console.log("++++++++++++++++++++compare called")
    if ( a.thirdParties.length < b.thirdParties.length ){
      return -1;
    }
    if ( a.thirdParties.length > b.thirdParties.length ){
      return 1;
    }
    return 0;
  }


  /*private calculateThirdPartyParts() {
    const thirdParties: ThirdParty[] = [];
    const aggregatedThirdparties: { [key: string]: number } = {};
    DOMAINS.forEach((domain) => thirdParties.push(...domain.thirdParties));
    thirdParties.forEach((thirdParty) => {
      const d = thirdParty.requestDomain;
      if (!aggregatedThirdparties[d]) aggregatedThirdparties[d] = 0;
      aggregatedThirdparties[d] += 1;
    });
    const thirdPartyShares: ThirdPartyShare[] = [];
    Object.keys(aggregatedThirdparties).forEach((key) => {
      const thirdParty = thirdParties.find(
        (party) => party.requestDomain === key
      );
      if (!thirdParty) {
        console.log('No thirdparty found');
        return;
      }
      const thirdPartyShare: ThirdPartyShare = {
        count: aggregatedThirdparties[key],
        share: aggregatedThirdparties[key] / DOMAINS.length,
        ...thirdParty,
      };
      thirdPartyShares.push(thirdPartyShare);
    });
    console.log(thirdPartyShares);
    this.data = thirdPartyShares;
  }

  

  private createTooltip() {
    this.tooltip = d3
      .select('figure#bar')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-this.width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('z-index', '1');
  }

  private createSvg(): void {
    this.this.svg = d3
      .select('figure#bar')
      .append('this.svg')
      .attr('this.width', this.this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: ThirdPartyShare[]): void {
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.this.width])
      .domain(data.map((d) => d.requestDomain))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 100]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    const test = this.this.svg
      .selectAll('bars')
      .data(d3.sort(data, (d) => d.share))
      .enter()
      .append('rect')
      .attr('x', (d: ThirdPartyShare) => x(d.requestDomain))
      .attr('y', (d: ThirdPartyShare) => y(d.share))
      .attr('this.width', x.bandwidth())
      .attr('height', (d: any) => this.height - y(d.share))
      .attr('fill', '#d04a35')
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

    console.log(test, 'test');
  }

  private createThirdPartyList(value: any) {
    console.log(value);
    const domain = this.data!.find((d) => d.share === value);
    const list = ['names?'].join('</li><li>');
    return `<ul><li>${list}</li></ul>`;
  }*/
}
