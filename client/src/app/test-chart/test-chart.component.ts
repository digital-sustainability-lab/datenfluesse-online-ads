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
        meta: {
          name: '20min.ch',
          totalSent: 0,
          totalRecieved: 0,
        },
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
            recieved: 11,
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
      },
    ];

    for (let link of this.data.links) {
      for (let request of link.requests) {
        link.meta.totalSent += request.sent;
        link.meta.totalRecieved += request.recieved;
      }
      link.pathData = this.generatePathData(link);
    }

    this.createSVG();

    this.update(this.data);
  }

  generatePathData(link: any) {
    const pathData = [];
    const height = -500;
    const topWidth = link.meta.totalRecieved;
    const bottomWidth = link.meta.totalSent;
    var currentBottomX = 0;
    let currentTopX = 0;

    for (let [index, request] of link.requests.entries()) {
      let path = {
        meta: {
          name: link.meta.name,
          color: d3.interpolateRainbow(index / link.requests.length),
        },
        coordinates: [
          { x: -(bottomWidth / 2) + currentBottomX, y: 0 },
          { x: -(bottomWidth / 2) + currentBottomX + request.sent, y: 0 },
          { x: -(topWidth / 2) + currentTopX + request.recieved, y: height },
          { x: -(topWidth / 2) + currentTopX, y: height },
        ],
      };
      currentBottomX += request.sent;
      currentTopX += request.recieved;
      pathData.push(path);
    }
    return pathData;
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
    return 0;
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
        return d.pathData;
      })
      .join('path')
      .attr('d', (d: any) => this.generatePath(d))
      .attr('class', 'requestPath')
      .attr('fill', (d: any) => d.meta.color);

    this.node.attr('class', 'node').attr('r', 10).attr('fill', '#39a');

    this.simulation.nodes(data.nodes).on('tick', this.ticked.bind(this));
    this.simulation.force('link').links(data.links);
    this.simulation.alpha(1).alphaTarget(0).restart();
  }

  generatePath(path: any) {
    let result = 'M ';
    for (let i = 0; i < path.coordinates.length; i++) {
      result += path.coordinates[i].x + ' ' + path.coordinates[i].y + ' ';
      if (i === path.coordinates.length - 1) {
        result += 'z';
      } else {
        result += 'L ';
      }
    }
    return result;
    // return 'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z';
  }

  ticked() {
    this.node
      .attr('cx', (d: any) => {
        return d.x;
      })
      .attr('cy', (d: any) => {
        return d.y;
      });
    this.link.attr('transform', (d: any) => this.getTransformation(d));
  }

  getTransformation(link: any): string {
    let res = '';
    res += 'translate(' + this.calcTranslation(link) + ') ';
    res += 'rotate(' + this.calcRotation(link) + ') ';
    res += 'scale(0.2 ' + this.calcScaleY(link) + ') ';
    return res;
  }

  calcTranslation(link: any): string {
    return link.source.x + ' ' + link.source.y;
  }

  calcRotation(link: any): number {
    let hypotenuse = Math.sqrt(
      Math.pow(link.target.x - link.source.x, 2) +
        Math.pow(link.target.y - link.source.y, 2)
    );
    let opposite = link.target.y - link.source.y;
    let angle = Math.asin(opposite / hypotenuse) * (180 / Math.PI) + 90;
    return angle;
  }

  calcScaleY(link: any): number {
    const distance = Math.sqrt(
      Math.pow(link.source.x - link.target.x, 2) +
        Math.pow(link.source.y - link.target.y, 2)
    );
    return (1 / 500) * distance;
  }

  onResize() {
    d3.select('.svg-content').attr(
      'viewBox',
      '0 0 ' + window.innerWidth + ' ' + window.innerHeight
    );
  }
}
