import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as d3 from 'd3';
import { network } from './network';
import { network_subset } from './network_subset'

@Component({
  selector: 'app-network-new',
  templateUrl: './network-new.component.html',
  styleUrls: ['./network-new.component.css']
})
export class NetworkNewComponent implements OnInit {

  alldata = JSON.parse(JSON.stringify(network))

  toppings = new FormControl('');

  nodeList: any[] = [];

  data = network

  data_subset = network_subset

  svg: any

  node: any

  link: any

  simulation: any

  width: any = window.innerWidth

  height: any = window.innerHeight

  radius = 10

  text_nodes: any



  constructor() { }

  changeSelection(value: any) {
    this.filterById(this.getIdByName((value)))
    debugger
    this.update(this.data)
  }

  getIdByName(name: string[]) {
    let ids: any = []
    name.forEach(element => {
      let node = this.alldata.nodes.find((el: any) =>
        el.name == element
      )
      if (node) ids.push(node.id)
    });
    return ids
  }

  initNodeList() {
    this.alldata.nodes.forEach((node: any) => {
      if (node.name) {
        this.nodeList.push({ name: node.name, count: node.count })
      }
    })
    this.nodeList.sort(function (a, b) {
      return b.count - a.count;
    });
    this.nodeList.unshift({ name: 'show all' })
  }

  ngOnInit(): void {
    this.initNodeList()
    this.initSVGs()
    this.update(this.data)
  }

  initSVGs() {
    this.svg = d3.select("#network")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      // @ts-ignore
      .call(d3.zoom().on("zoom", (event: any) => {
        this.svg.attr("transform", event.transform)
      }))
      .append('g')



    this.link = this.svg.selectAll(".link");
    this.node = this.svg.selectAll(".nodes");


    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink()
        .distance(500)
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
      .attr("r", (d: any) => this.getRadius(d))

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
    // set this if we want to trap it within a div
    // .attr("cx", (d: any) => { return d.x = Math.max(this.radius, Math.min(this.width - this.radius, d.x)); })
    // .attr("cy", (d: any) => { return d.y = Math.max(this.radius, Math.min(this.height - this.radius, d.y)); });

    this.node
      .attr("cx", (d: any) => { return d.x })
      .attr("cy", (d: any) => { return d.y });

    this.link
      .attr("x1", function (d: any) { return d.source.x; })
      .attr("y1", function (d: any) { return d.source.y; })
      .attr("x2", function (d: any) { return d.target.x; })
      .attr("y2", function (d: any) { return d.target.y; });
  }


  filterById(id: number[]) {
    this.filterLinks(id)
    this.filterNodes(this.data.links)
  }


  filterLinks(id: number[]) {
    debugger
    this.data.links = this.alldata.links.filter((el: any) => {
      if (id.includes(el.source)) return true
      if (id.includes(el.target)) return true
      if (id.includes(el.source.id)) return true
      if (id.includes(el.target.id)) return true
      return false
    })
  }

  filterNodes(links: any[]) {
    const ids = links.flatMap((el: any) => {
      if (el.source.id) {
        return [el.source.id, el.target.id]
      } else {
        return [el.source, el.target]
      }

    })
    debugger
    this.data.nodes = this.alldata.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true
      return false
    })
  }

  getRadius(d: any) {
    return d.count + 5
  }



}