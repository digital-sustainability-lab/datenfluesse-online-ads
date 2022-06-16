import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  data: { share: number; title: string }[] = [
    { share: 0.4, title: 'Foobar' },
    { share: 0.5, title: 'Baz' },
    { share: 0.2, title: 'Bar' },
  ];

  private xScale!: d3.ScaleLinear<number, number, never>;
  private yScale!: d3.ScaleBand<string>;
  constructor() {}

  ngOnInit(): void {
    this.sortData();
    this.xScale = this.createNumericScale();
    this.yScale = this.createDescriptionScale();
    this.drawChart();
    this.createSampleChart();
  }

  private createDescriptionScale() {
    return d3
      .scaleBand()
      .range([0, 200])
      .domain(this.data.map((d) => d.title))
      .padding(0.2)
      .round(true);
  }

  private createNumericScale() {
    return d3
      .scaleLinear()
      .domain([0, d3.max(this.data.map((d) => d.share)) as number])
      .range([0, 500])
      .interpolate(d3.interpolateRound);
  }

  private drawBars() {
    const chart = d3.selectAll('svg#barChart').attr('text-anchor', 'end');
    const bar = chart
      .selectAll('g')
      .data(this.data)
      .join('g')
      .attr(
        'transform',
        (d, i) => `translate(100, ${this.yScale(d.title)! + 115} )`
      );
    bar
      .append('rect')
      .attr('width', (d) => this.xScale(d.share))
      .attr('height', this.yScale.bandwidth() - 30)
      .attr('fill', '#d04a35');
    bar
      .append('text')
      .attr('fill', 'white')
      .attr('x', (d) => this.xScale(d.share) - 3)
      .attr('transform', `translate(0,10)`)
      .attr('dy', '0.35em')
      .text((d) => d.title);
  }

  private drawChart() {
    this.drawBars();
    this.drawXScale();
    this.drawYScale();
  }

  private drawXScale() {
    const barChart = d3.selectAll('svg#barChart');
    barChart
      .append('g')
      .attr('transform', `translate(100, 100)`)
      .call(d3.axisTop(this.xScale))
      .call((g) => g.select('.domain').remove())
      .node();
  }

  private drawYScale() {
    const barChart = d3.selectAll('svg#barChart');
    barChart
      .append('g')
      .attr('transform', `translate(85, 100)`)
      .call(d3.axisLeft(this.yScale))
      .call((g) => g.select('.domain').remove())
      .node();
  }

  private sortData() {
    this.data = d3.sort(this.data, (a) => -a.share);
  }

  private createSampleChart() {
    const data = [4, 8, 15, 16, 23, 42];
    const width = 420;
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data) as number])
      .range([0, width]);
    const y = d3
      .scaleBand()
      .domain(d3.range(data.length) as Iterable<string>)
      .range([0, 20 * data.length]);
    const svg = d3
      .select('figure#sampleChart')
      .append('svg')
      .attr('width', width)
      .attr('height', y.range()[1])
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10')
      .attr('text-anchor', 'end');

    const bar = svg
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', (d, i) => {
        console.log(d);
        console.log(i);
        return `translate(0,${d})`;
      });
    bar
      .append('rect')
      .attr('fill', 'steelblue')
      .attr('width', x)
      .attr('height', y.bandwidth() - 1);
    bar
      .append('text')
      .attr('fill', 'white')
      .attr('x', (d) => x(d) - 3)
      .attr('y', (y.bandwidth() - 1) / 2)
      .attr('dy', '0.35em')
      .text((d) => d);

    return svg.node();
  }
}
