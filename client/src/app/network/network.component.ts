import { Component, EventEmitter, OnInit } from '@angular/core';
import { DOMAINS } from '../DOMAINS';
import * as d3 from 'd3';
import { Domain } from '../interfaces';
import { network } from '../network-new/network';
import { Node } from './node';
import { Link } from './link';
import { network_subset } from '../network-new/network_subset';

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

  data_subset = network_subset

  private svg: any;

  selectedNetwork = 'network';

  textAndNodes: any

  link: any;

  node: any;

  zoom = d3.zoom()

  margin = { top: 100, right: 30, bottom: 30, left: 40 };

  private tooltip: any;

  simulation: any;

  dragSimulation: any



  filterLinks(id: number) {
    this.data.links = this.data.links.filter((el: any) => {
      if (el.source.id == id) return true
      if (el.target.id == id) return true
      return false
    })
  }

  filterNodes(links: any[]) {
    const ids = links.flatMap((el: any) => {
      return [el.source.id, el.target.id]
    })
    console.log(ids, "links")
    this.data.nodes = this.data.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true
      return false
    })
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
    this.createNetwork(this.data)
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

  checkData(data: any) {

    let node = this.svg
      .select('g')
      .selectAll('g')
      .selectAll('circles')
      .data(data.nodes, (d: any) => { return d })
      .enter()

    let lines = this.svg
      .selectAll('lines')
      .data(data.nodes, (d: any) => { return d })
      .enter()

    node.exit().remove()

    lines.exit().remove()

  }

  width = 800

  height = 900

  assignData(data: any) {

    this.link = this.link
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'links')
      .style('stroke', '#aaa')

    this.textAndNodes = this.textAndNodes.data(data.nodes).enter().append("g").call(d3.drag()
      .on('drag', this.dragged)
      .on('end', this.dragend))

  }


  createNetwork(data: any) {

    this.svg = d3.select("#network")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      // @ts-ignore
      .call(d3.zoom().on("zoom", (event: any) => {
        this.svg.attr("transform", event.transform)
      }))
      .append('g')


    this.link = this.svg
      .selectAll('line')


    this.textAndNodes = this.svg.selectAll("g")

    this.assignData(data)

    let circles = this.textAndNodes.append('circle').attr('r', (d: any) => this.getRadius(d)).attr("fill", "#69b3a2")

    let text = this.textAndNodes.append('text').text(function (d: any) { return d.name })

    this.simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()
        .distance(500)                              // This force provides links between nodes
        .id(function (d: any) { return d.id; })                     // This provide  the id of a node
        .links(data.links))
      .force("charge", d3.forceManyBody().strength(-200))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .alpha(1).restart()


    this.simulation.nodes(data.nodes)
      .on("tick", () => {
        this.link
          .attr("x1", function (d: any) { return d.source.x; })
          .attr("y1", function (d: any) { return d.source.y; })
          .attr("x2", function (d: any) { return d.target.x; })
          .attr("y2", function (d: any) { return d.target.y; });
        this.textAndNodes
          .attr("transform", function (d: any) {
            return `translate(${d.x},${d.y})`;
          })
      })
      .alphaDecay(0)
      .force("link")
      .links(data.links);
  }






}
