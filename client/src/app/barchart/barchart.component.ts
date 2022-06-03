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
  domains = DOMAINS3;
  private svg: any;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;
  private tooltip: any;

  private data: ThirdPartyShare[] | undefined;

  constructor() {}

  ngOnInit(): void {
    this.calculateThirdPartyParts();
    this.createSvg();
    this.drawBars(this.data!);
    this.createTooltip();
  }

  private calculateThirdPartyParts() {
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
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('z-index', '1');
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: ThirdPartyShare[]): void {
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.requestDomain))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 100]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    const test = this.svg
      .selectAll('bars')
      .data(d3.sort(data, (d) => d.share))
      .enter()
      .append('rect')
      .attr('x', (d: ThirdPartyShare) => x(d.requestDomain))
      .attr('y', (d: ThirdPartyShare) => y(d.share))
      .attr('width', x.bandwidth())
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
  }
}
