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
  CHARGE: -1
}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})



export class NetworkComponent implements OnInit {

  data: any = network

  private svg: any;

  selectedNetwork = "network"

  link: any

  node: any

  margin = { top: 100, right: 30, bottom: 30, left: 40 }

  private tooltip: any;

  simulation: any

  constructor() {
    // this.initSimulation({ width: 500, height: 500 })
  }



  ngOnInit(): void {
    this.createSvg()
    this.createNetwork()
    this.animate()

  }

  animate() {

  }

  createSvg() {
    this.svg = d3.select("figure#network")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .append("g")
  }

  getRadius(d: any) {
    return d.count + 10
  }

  dragged(d: any) {
    console.log(d)
    // d.x = d.x, d.y = d.y;
    this.link.filter(function (l: any) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
    this.link.filter(function (l: any) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
  }


  createNetwork() {


    let link = this.svg
      .selectAll("line")
      .data(this.data.links)
      .enter()
      .append("line")
      .attr("class", "links")
      .style("stroke", "#aaa")

    const dragged = function (d: any) {
      link.filter(function (l: any) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
      link.filter(function (l: any) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
    }
    var node = this.svg.append("g")
      .attr("class", "node")
      .selectAll("circle")
      .data(this.data.nodes)
      .enter().append("circle")
      .attr("r", this.getRadius)
      .on("click", (event: any) => {
        this.selectedNetwork = event.target['__data__'].name
      })
      .call(d3.drag().on("drag", dragged));


    // let node = this.svg
    // .selectAll("circle")
    // .data(this.data.nodes)
    // .enter()
    // .append("g")
    // .append("circle")
    // .attr("r", this.getRadius)
    // .style("fill", "#69b3a2")
    // .on("click", function (event: any) {
    //   alert(event.target['__data__'].name)
    // });

    this.simulation = d3.forceSimulation(this.data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
        .id(function (d: any) { return d.id; })                     // This provide  the id of a node
        .links(this.data.links))
      .force("charge", d3.forceManyBody().strength(-300))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(2000 / 2, 800 / 2))     // This force attracts nodes to the center of the svg area


    this.simulation.nodes(this.data.nodes)
      .on("tick", function () {
        link
          .attr("x1", function (d: any) { return d.source.x + 1; })
          .attr("y1", function (d: any) { return d.source.y; })
          .attr("x2", function (d: any) { return d.target.x; })
          .attr("y2", function (d: any) { return d.target.y; });
        node
          .attr("cx", function (d: any) { return d.x; })
          .attr("cy", function (d: any) { return d.y; });
      })

  }







}
