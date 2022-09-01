import { BaseOverlayDispatcher } from '@angular/cdk/overlay/dispatchers/base-overlay-dispatcher';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { image, median } from 'd3';

@Component({
  selector: 'app-test-chart',
  templateUrl: './test-chart.component.html',
  styleUrls: ['./test-chart.component.css'],
})
export class TestChartComponent implements OnInit {
  data: any = {};

  svg: any;

  link: any;

  node: any;

  simulation: any;

  source: any;
  target: any;

  constructor() {}

  ngOnInit(): void {
    this.source = {
      id: 1,
      x: -200,
      y: -300,
    };

    this.target = {
      id: 2,
      x: 100,
      y: 100,
    };

    this.data.nodes = [this.source, this.target];

    this.data.links = [
      {
        id: 4,
        source: this.source,
        target: this.target,
        requests: [
          {
            name: 'document',
            sent: 3,
            recieved: 10,
          },
          {
            name: 'fetch',
            sent: 16,
            recieved: 100,
          },
          {
            name: 'font',
            sent: 8,
            recieved: 35,
          },
          {
            name: 'image',
            sent: 3,
            recieved: 10,
          },
          {
            name: 'other',
            sent: 3,
            recieved: 62,
          },
          {
            name: 'ping',
            sent: 9,
            recieved: 40,
          },
          {
            name: 'preflight',
            sent: 30,
            recieved: 32,
          },
          {
            name: 'script',
            sent: 10,
            recieved: 10,
          },
          {
            name: 'stylesheet',
            sent: 6,
            recieved: 0,
          },
          {
            name: 'xhr',
            sent: 0,
            recieved: 0,
          },
        ],
        meta: {
          name: '20min.ch',
          totalSent: 0,
          totalRecieved: 0,
        },
      },
    ];

    for (let type in this.data.links[0].sent) {
      this.data.links[0].meta.totalSent += this.data.links[0].sent[type];
      this.data.links[0].meta.totalRecieved +=
        this.data.links[0].recieved[type];
    }

    this.createSVG();

    this.update(this.data);
  }

  createSVG() {
    if (this.svg) d3.selectAll('svg').remove();
    // prettier-ignore
    this.svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .classed('svg-content', true)
      // @ts-ignore
      .call(d3.zoom().on('zoom', (event: any) => {
          this.svg.attr('transform', event.transform);
        }))
      .append('g');

    this.link = this.svg.append('g').selectAll('.link');
    this.node = this.svg.append('g').selectAll('.node');

    this.simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .distance(500)
          .id(function (d: any) {
            return d.id;
          })
      )
      .force(
        'charge',
        d3.forceManyBody().strength((d: any) => {
          return this.calcForce(d.count);
        })
      )
      .force(
        'center',
        d3
          .forceCenter(window.innerWidth / 2, window.innerHeight / 2)
          .strength(0.1)
      );
  }

  private calcForce(count: number): number {
    return (Math.log10(count) + 1) * -600;
  }

  update(data: any) {
    this.node = this.node
      .data(data.nodes, (d: any) => {
        return d.id;
      })
      .join('circle');

    this.link = this.link
      .data(data.links, (d: any) => {
        return d.id;
      })
      .join('g')
      .attr('class', 'link');

    this.link
      .selectAll('path')
      .data((d: any) => {
        return d.requests;
      })
      .join('path')
      .attr('d', (d: any) => this.generatePath(d))
      .attr('class', 'requestPath')
      .attr('fill', '#c7e');

    this.node
      .attr('class', 'node')
      .attr('r', (d: any) => 10)
      .attr('fill', (d: any) => '#39a');

    this.simulation.nodes(data.nodes).on('tick', this.ticked.bind(this));
    this.simulation.force('link').links(data.links);
    this.simulation.alpha(1).alphaTarget(0).restart();
  }

  generatePath(link: any) {
    console.log(link);
    return 'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z';
  }

  ticked() {
    this.node
      .attr('cx', (d: any) => {
        return d.x;
      })
      .attr('cy', (d: any) => {
        return d.y;
      });
    this.link
      .attr('x1', function (d: any) {
        return d.source.x;
      })
      .attr('y1', function (d: any) {
        return d.source.y;
      })
      .attr('x2', function (d: any) {
        return d.target.x;
      })
      .attr('y2', function (d: any) {
        return d.target.y;
      });
  }

  onResize() {
    d3.select('.svg-content').attr(
      'viewBox',
      '0 0 ' + window.innerWidth + ' ' + window.innerHeight
    );
  }
}
