import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { network } from './network';
import { network_subset } from './network_subset'

@Component({
  selector: 'app-network-new',
  templateUrl: './network-new.component.html',
  styleUrls: ['./network-new.component.css']
})
export class NetworkNewComponent implements OnInit {

  data = network

  data_subset = network_subset

  svg: any

  node: any

  link: any

  simulation: any

  width: any

  height: any

  radius = 10

  text_nodes: any


  constructor() { }

  ngOnInit(): void {
    this.initSVGs()
    this.update(this.data)
    setTimeout(() => {
      this.filterById(3)
      this.update(this.data)
    }, 2000)
  }

  initSVGs() {
    this.svg = d3.select("svg")
      // @ts-ignore
      .call(d3.zoom().on("zoom", (event: any) => {
        this.svg.attr("transform", event.transform)
      }))
    this.width = +this.svg.attr("width"),
      this.height = +this.svg.attr("height"),
      this.radius = 10;


    this.link = this.svg.append("g").selectAll(".link");
    this.node = this.svg.append("g").selectAll("g");


    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink()
        .id(function (d: any) { return d.id; }))
      .force("charge", d3.forceManyBody()
        .strength(function (d: any) { return -500; }))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2));
  }

  update(data: any) {
    //	UPDATE
    this.node = this.node.data(data.nodes, function (d: any) { return d.id; });
    //	EXIT
    this.node.exit().remove();
    //	ENTER
    var newNode = this.node.enter().append("circle")
      .attr("class", "node")
      .attr("r", this.radius)

    newNode.append("title")
      .text(function (d: any) { return "group: " + d.group + "\n" + "id: " + d.id; });
    //	ENTER + UPDATE
    this.node = this.node.merge(newNode);

    //	UPDATE
    this.link = this.link.data(data.links, function (d: any) { return d.id; });
    //	EXIT
    this.link.exit().remove();
    //	ENTER
    let newLink = this.link.enter().append("line")
      .attr("class", "link")
      .attr('class', 'links')
      .style('stroke', '#aaa')

    newLink.append("title")
      .text(function (d: any) { return "source: " + d.source + "\n" + "target: " + d.target; });
    //	ENTER + UPDATE
    this.link = this.link.merge(newLink);
    //	update simulation nodes, links, and alpha
    this.simulation
      .nodes(data.nodes)
      .on("tick", this.ticked.bind(this));
    this.simulation.force("link")
      .links(data.links);
    this.simulation.alpha(1).alphaTarget(0).restart();
  }

  ticked() {
    this.node
      .attr("cx", (d: any) => { return d.x = Math.max(this.radius, Math.min(this.width - this.radius, d.x)); })
      .attr("cy", (d: any) => { return d.y = Math.max(this.radius, Math.min(this.height - this.radius, d.y)); });

    this.link
      .attr("x1", function (d: any) { return d.source.x; })
      .attr("y1", function (d: any) { return d.source.y; })
      .attr("x2", function (d: any) { return d.target.x; })
      .attr("y2", function (d: any) { return d.target.y; });
  }


  filterById(id: number) {
    this.filterLinks(id)
    this.filterNodes(this.data.links)
  }


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
    this.data.nodes = this.data.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true
      return false
    })
  }




}
