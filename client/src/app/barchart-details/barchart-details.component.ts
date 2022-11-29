import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { BehaviorSubject } from 'rxjs';
import { BarchartDetailsService } from '../services/barchart-details.service';

@Component({
  selector: 'app-barchart-details',
  templateUrl: './barchart-details.component.html',
  styleUrls: ['./barchart-details.component.css', '../../styles.css'],
})
export class BarchartDetails implements OnInit {
  margin = { top: 30, right: 30, bottom: 110, left: 60 };
  width = 1500 - this.margin.left - this.margin.right;
  height = 800 - this.margin.top - this.margin.bottom;
  data: any;
  stackedData: any;
  svg: any;
  x: any;
  y: any;
  xLabel: string = '';
  yLabel: string = '';
  barValue: any;
  tooltip: any;
  tooltipDescription: string = '';
  tooltipCategory: string = '';
  description: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private barchartDetailsService: BarchartDetailsService) {}

  ngOnInit(): void {
    this.barchartDetailsService.data.subscribe((data: any) => {
      this.data = data;
      this.description.next(data.meta.description);
      this.xLabel = data.meta.xLabel;
      this.yLabel = data.meta.yLabel;
      this.tooltipDescription = 'Total Payload size (kB):';
      if (data.meta.yLabel.match('request')) {
        this.tooltipDescription = 'Total requests:';
      }
      this.tooltipCategory = 'types';
      if (data.meta.categorization == 'category') {
        this.tooltipCategory = 'categories';
      }
      this.update(this.data);
    });
  }

  update(data: any) {
    d3.selectAll('#barchart > svg').remove();

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

    this.svg
      .append('text')
      .attr('class', 'x label')
      .attr(
        'transform',
        'translate(' +
          (this.width + 20) +
          ',' +
          (this.height + 15) +
          ')rotate(-90)'
      )
      .text(this.xLabel);

    this.y = d3
      .scaleLinear()
      .domain([0, data.meta.maxTotal])
      .range([this.height, 0]);
    this.svg.append('g').call(d3.axisLeft(this.y));

    this.svg
      .append('text')
      .attr('class', 'y label')
      .attr('y', -15)
      .attr('dy', '.75em')
      .text(this.yLabel);

    this.tooltip = d3.select('.infoTooltip');

    let subgroupsReversed = JSON.parse(
      JSON.stringify(data.meta.subgroups)
    ).reverse();

    const stackedData = d3.stack().keys(subgroupsReversed)(data.chartData);

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

    this.tooltip = d3
      .select('#barchart')
      .append('div')
      .style('position', 'fixed')
      .style('visibility', 'hidden')
      .style('background-color', '#dddddd')
      .style('padding', '15px')
      .style('box-shadow', '0 0 5px #888');

    this.svg
      .selectAll('rect')
      .on('mouseover', (e: any) => {
        this.tooltip.style('visibility', 'visible');
        this.fillTooltip(e);
      })
      .on('mousemove', (e: any) => {
        this.handleTooltipPos(e);
      })
      .on('mouseout', (e: any) => {
        this.tooltip.style('visibility', 'hidden');
      });
  }

  fillTooltip(e: any) {
    const data = e.target.__data__.data;

    this.tooltip.selectAll('*').remove();

    this.tooltip.append('h3').text('Page: ' + data.meta.name);

    this.tooltip
      .append('p')
      .style('font-weight', 'bold')
      .text(this.tooltipDescription + data.meta.total);
    this.tooltip
      .append('div')
      .text('Third party request ' + this.tooltipCategory + ':');

    for (let type in data) {
      if (e.target.__data__[1] - e.target.__data__[0] === data[type]) {
        this.tooltip
          .append('div')
          .style('font-weight', 'bold')
          .text(type + ': ' + data[type]);
      } else if (type !== 'meta') {
        this.tooltip.append('div').text(type + ': ' + data[type]);
      }
    }
  }

  handleTooltipPos(e: any) {
    const height = this.tooltip._groups[0][0].clientHeight;
    const width = this.tooltip._groups[0][0].clientWidth;
    if (e.clientY + height > window.innerHeight) {
      this.tooltip.style('top', e.clientY - height - 10 + 'px');
    } else {
      this.tooltip.style('top', e.clientY + 10 + 'px');
    }
    if (e.clientX + width > window.innerWidth) {
      this.tooltip.style('left', e.clientX - width - 10 + 'px');
    } else {
      this.tooltip.style('left', e.clientX + 10 + 'px');
    }
  }
}
