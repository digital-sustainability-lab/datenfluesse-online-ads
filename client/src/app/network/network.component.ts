import { Component, EventEmitter, OnInit } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
import * as d3 from 'd3';
import { Domain } from '../interfaces';
import { network } from './network';
import { Node } from './node';
import { Link } from './link';

const FORCES = {
  LINKS: 1 / 50,
  COLLISION: 1,
  CHARGE: -1,
};

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
})
export class NetworkComponent implements OnInit {

  data1 = { "nodes": [{ "id": "A" }, { "id": "B" }, { "id": "C" }, { "id": "D" }], "links": [{ "source": "A", "target": "B" }, { "source": "B", "target": "C" }, { "source": "C", "target": "A" }, { "source": "D", "target": "A" }] }

  data: any = network

  private svg: any;

  selectedNetwork = 'network';

  link: any;

  node: any;

  zoom = d3.zoom()

  margin = { top: 100, right: 30, bottom: 30, left: 40 };

  private tooltip: any;

  simulation: any;

  dragSimulation: any

  handleZoom(e: any) {
    this.svg
      .attr('transform', e.transform)
  }

  initZoom() {
    this.svg
      .call(this.zoom)
  }

  constructor() {
  }

  getRadius(d: any) {
    return d.count + 10
  }

  ngOnInit(): void {
    this.createSvg()
    this.createNetwork()
  }

  createSvg() {

  }


  dragged(d: any) {
    d.subject.fx = d.x
    d.subject.fy = d.y
  }

  dragend(d: any) {
    d.subject.fx = d.x
    d.subject.fy = d.y
  }

  createNetwork() {


    this.svg = d3.select("#network")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      // @ts-ignore
      .call(d3.zoom().on("zoom", (event: any) => {
        this.svg.attr("transform", event.transform)
      }))
      .append('g')










    let link = this.svg
      .selectAll('line')
      .data(this.data.links)
      .enter()
      .append('line')
      .attr('class', 'links')
      .style('stroke', '#aaa')

    let textAndNodes = this.svg.selectAll("g").data(this.data.nodes).enter().append("g").call(d3.drag()
      .on('drag', this.dragged)
      .on('end', this.dragend))



    let circles = textAndNodes.append('circle').attr('r', (d: any) => this.getRadius(d)).attr("fill", "#69b3a2")

    let text = textAndNodes.append('text').text(function (d: any) { return d.name })




    // let node = this.svg
    //   .selectAll("circle")
    //   .data(this.data.nodes)
    //   .enter()
    //   .append("circle")
    //   .attr("r", this.getRadius)
    //   .call(d3.drag()
    //     .on('drag', this.dragged)
    //     .on('end', this.dragend))
    //   .style("fill", "#69b3a2")
    //   .on("click", (event: any) => {
    //     this.selectedNetwork = event.target['__data__'].name
    //   })




    this.simulation = d3.forceSimulation(this.data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()
        .distance(500)                              // This force provides links between nodes
        .id(function (d: any) { return d.id; })                     // This provide  the id of a node
        .links(this.data.links))
      .force("charge", d3.forceManyBody().strength(-200))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(2000 / 2, 800 / 2))


    this.simulation.nodes(this.data.nodes)
      .on("tick", function () {
        link
          .attr("x1", function (d: any) { return d.source.x; })
          .attr("y1", function (d: any) { return d.source.y; })
          .attr("x2", function (d: any) { return d.target.x; })
          .attr("y2", function (d: any) { return d.target.y; });
        textAndNodes
          .attr("transform", function (d: any) {
            return `translate(${d.x},${d.y})`;
          })
      })
      .alphaDecay(0)
      .force("link")
      .links(this.data.links);
  }






}
