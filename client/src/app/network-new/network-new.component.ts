import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as d3 from 'd3';
import { network } from './network';
import { colors } from './colors'
import { category_data } from './category_data';
import { DataService } from '../data.service';

@Component({
  selector: 'app-network-new',
  templateUrl: './network-new.component.html',
  styleUrls: ['./network-new.component.css']
})
export class NetworkNewComponent implements OnInit {

  alldata = JSON.parse(JSON.stringify(network))

  colors: any = colors

  toppings = new FormControl('');

  nodeList: any[] = [];

  data = network

  categories: any = category_data

  svg: any

  node: any

  link: any

  simulation: any

  width: any = window.innerWidth

  height: any = window.innerHeight

  radius = 10

  text_nodes: any

  text_element: any



  constructor(private dataService: DataService) { }

  changeSelection(value: any) {
    this.filterById(this.getIdByName((value)))
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



    this.link = this.svg.append('g').selectAll(".link");
    this.node = this.svg.append('g').selectAll(".nodes");
    this.text_element = this.svg.append('g').selectAll("text")


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
    //	UPDATE
    this.node = this.node.data(data.nodes, function (d: any) { return d.id; });

    //	EXIT
    this.node.exit().remove();

    var newNode = this.node.enter().append("circle")
      .attr("class", "node")
      .attr("r", (d: any) => this.getRadius(d))
      .attr("fill", (d: any) => this.getColor(d))
      .on('click', this.selectNode.bind(this))
      .on('mouseover', this.setSelectedNode.bind(this))

    this.text_element = this.text_element.data(data.nodes, function (d: any) { return d.id });

    this.text_element.exit().remove();
    //	ENTER
    let newText = this.text_element.enter().append("text")
      .text((node: any) => node.name)

    this.text_element = this.text_element.merge(newText)



    newNode.append("title")
      .text(function (d: any) { return "group: " + d.group + "\n" + "id: " + d.id; });
    //	ENTER + UPDATE
    this.node = this.node.merge(newNode);

    //	update simulation nodes, links, and alpha
    this.simulation
      .nodes(data.nodes)
      .on("tick", this.ticked.bind(this));
    this.simulation.force("link")
      .links(data.links);
    this.simulation.alpha(1).alphaTarget(0).restart();
  }

  getColor(element: any) {
    let toAdd = 'https://www.'
    if (element.name) {
      element.name = element.name.charAt(0).toUpperCase() + element.name.slice(1)
    }
    let name = toAdd += element.name
    if (this.categories[name]) {
      const category = this.categories[name].categories[0]
      return this.colors[category]
    }
    return '#226a94'
  }

  setSelectedNode(node: any) {
    let toAdd = 'https://www.'
    let name = toAdd += node.target.__data__.name
    this.dataService.setSelectedNode(name);
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
    this.text_element
      .attr("x", (d: any) => { return d.x })
      .attr("y", (d: any) => { return d.y });
  }


  filterById(id: number[]) {
    this.filterLinks(id)
    this.filterNodes(this.data.links)
  }

  selectNode(event: any) {
    let id = event.target.__data__.id
    let linksToAdd = this.alldata.links.filter((link: any) => {
      if (link.source == id) return true
      if (link.source.id == id) return true
      return false
    })
    this.data.links.push(...linksToAdd)
    const ids = linksToAdd.map((el: any) => {
      if (el.source.id) {
        return el.target.id
      } else {
        return el.target
      }
    })
    let nodesToAdd = this.alldata.nodes.filter((node: any) => {
      if (ids.includes(node.id)) return true
      return false
    })
    this.data.nodes.push(...nodesToAdd)
    this.update(this.data)
  }


  filterLinks(id: number[]) {
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
    this.data.nodes = this.alldata.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true
      return false
    })
  }

  getRadius(d: any) {
    return d.count + 5
  }



}
