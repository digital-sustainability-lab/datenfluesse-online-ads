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

  data1 = { "nodes": [{ "id": "A" }, { "id": "B" }, { "id": "C" }, { "id": "D" }], "links": [{ "source": "A", "target": "B" }, { "source": "B", "target": "C" }, { "source": "C", "target": "A" }, { "source": "D", "target": "A" }] }

  data: any = network

  private svg: any;

  selectedNetwork = "network"

  link: any

  node: any

  margin = { top: 100, right: 30, bottom: 30, left: 40 }

  private tooltip: any;

  simulation: any

  dragSimulation: any

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
    this.svg = d3.select("figure#network")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
  }


  dragged(d: any) {
    console.log(d.fx)
    d.subject.fx = d.x
    d.subject.fy = d.y
    console.log(d, " after")
  }

  dragend(d: any) {
    d.subject.fx = d.x
    d.subject.fy = d.y
  }

  createNetwork() {


    let link = this.svg
      .selectAll("line")
      .data(this.data.links)
      .enter()
      .append("line")
      .attr("class", "links")
      .style("stroke", "#aaa")

    let node = this.svg.append("g")
      .selectAll("circle")
      .data(this.data.nodes)
      .enter()
      .append("circle")
      .attr("r", this.getRadius)
      .call(d3.drag()
        .on('drag', this.dragged)
        .on('end', this.dragend))
      .style("fill", "#69b3a2")
      .on("click", (event: any) => {
        this.selectedNetwork = event.target['__data__'].name
      })



    this.simulation = d3.forceSimulation(this.data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
        .id(function (d: any) { return d.id; })                     // This provide  the id of a node
        .links(this.data.links))
      .force("charge", d3.forceManyBody().strength(-300))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(2000 / 2, 800 / 2))


    this.simulation.nodes(this.data.nodes)
      .on("tick", function () {
        link
          .attr("x1", function (d: any) { return d.source.x; })
          .attr("y1", function (d: any) { return d.source.y; })
          .attr("x2", function (d: any) { return d.target.x; })
          .attr("y2", function (d: any) { return d.target.y; });
        node
          .attr("cx", function (d: any) { return d.x; })
          .attr("cy", function (d: any) { return d.y; })
      })
      .alphaDecay(0)
      .force("link")
      .links(this.data.links);
  }






}
