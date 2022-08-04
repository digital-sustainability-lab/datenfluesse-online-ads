import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as d3 from 'd3';

import { DataService } from '../data.service';

import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subject } from 'rxjs';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-network-new',
  templateUrl: './network-new.component.html',
  styleUrls: ['./network-new.component.css'],
})
export class NetworkNewComponent implements OnInit {
  history: any[] = [];

  alldata: any;

  colors: any;

  toppings = new FormControl('');

  nodeList: any[] = [];

  data: any;

  categories: any;

  svg: any;

  node: any;

  link: any;

  simulation: any;

  width: any = 2000;

  height: any = 1000;

  domain: any;

  radius = 10;

  text_nodes: any;

  text_element: any;

  historyIndex = 0;

  color3p: any;

  currentIds: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  historyNew: number[][] = [];

  constructor(
    private dataService: DataService,
    private networkService: NetworkService
  ) {}

  ngOnInit(): void {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this.initSVGs();
      this.data = JSON.parse(JSON.stringify(data.network));
      this.alldata = JSON.parse(JSON.stringify(data.network));
      this.categories = data.category;
      this.domain = JSON.parse(JSON.stringify(data.domain));
      this.colors = data.color;
      this.color3p = data.color3p;
    });

    this.currentIds.subscribe((ids) => {
      if (ids.length === 0) return;
      this.data = this.filterById(ids);
      let checkBoxNames = this.getNames(this.data);
      this.networkService.updateCheckBox(checkBoxNames);
      this.update(this.data);
      //todo
    });
  }

  navigateSelection(direction: number) {
    this.historyIndex += direction;
    this.currentIds.next(this.historyNew[this.historyIndex]);
  }

  updateHistory(ids: number[]) {
    const idsSet = new Set(ids);
    if (
      this.historyNew.length === 0 ||
      !this.dataIsSame(idsSet, this.historyNew[this.historyIndex])
    ) {
      this.historyNew = this.historyNew.slice(0, this.historyIndex + 1);
      this.historyNew.push([...ids]);
      this.historyIndex = this.historyNew.length - 1;
    }
  }

  private dataIsSame(newIds: any, currentIds: any): boolean {
    let newData = this.filterById([...newIds]);
    let currentData = this.filterById(currentIds);
    if (newData.nodes.length === currentData.nodes.length) {
      for (let newNode of newData.nodes) {
        if (!currentData.nodes.includes(newNode)) return false;
      }
      return true;
    }
    return false;
  }

  onResize(event: any) {
    d3.select('.svg-content').attr(
      'viewBox',
      '0 0 ' + window.innerWidth + ' ' + window.innerHeight
    );
  }

  initSVGs() {
    if (this.svg) d3.selectAll('svg').remove();
    // prettier-ignore
    this.svg = d3
      .select('#network')
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
    this.node = this.svg.append('g').selectAll('.nodes');
    this.text_element = this.svg.append('g').selectAll('text');

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
        d3.forceManyBody().strength(function (d: any) {
          return -500;
        })
      )
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));
  }

  update(data: any) {
    // update links
    this.link = this.link
      .data(data.links, function (d: any) {
        return d.id;
      })
      .join('line');

    // update nodes
    this.node = this.node
      .data(data.nodes, function (d: any) {
        return d.id;
      })
      .join('circle');

    // update text_elements
    this.text_element = this.text_element
      .data(data.nodes, function (d: any) {
        return d.id;
      })
      .join('text')
      .text((node: any) => node.name);

    this.styleNodes();

    //	update update simulation
    this.simulation.nodes(data.nodes).on('tick', this.ticked.bind(this));
    this.simulation.force('link').links(data.links);
    this.simulation.alpha(1).alphaTarget(0).restart();
  }

  private styleNodes() {
    this.link
      .style('stroke', '#aaa')
      .style('stroke-width', '1')
      .style('opacity', 1);
    this.node
      .attr('r', (d: any) => this.getRadius(d))
      .attr('fill', (d: any) => this.getColor(d))
      .style('stroke', (d: any) => this.getOutline(d))
      .on('click', this.selectNode.bind(this))
      .on('mouseover', (d: any) => {
        this.setSelectedNode(d);
        this.node
          .style('fill', (node: any) => {
            if (node.id == d.currentTarget.__data__.id)
              return this.getColor(node);
            if (this.belongsToGroup(d.currentTarget.__data__.id, node))
              return this.getColor(node);
            return '#B8B8B8';
          })
          .style('opacity', (node: any) => {
            if (this.belongsToGroup(d.currentTarget.__data__.id, node))
              return 1;
            return 0.2;
          });
        this.text_element.style('opacity', (node: any) => {
          if (this.belongsToGroup(d.currentTarget.__data__.id, node)) return 1;
          return 0.2;
        });
        this.link
          .style('stroke', (link_d: any) => {
            return link_d.source.id === d.currentTarget.__data__.id ||
              link_d.target.id === d.currentTarget.__data__.id
              ? '#69b3b2'
              : '#b8b8b8';
          })
          .style('stroke-width', (link_d: any) => {
            return link_d.source.id === d.currentTarget.__data__.id ||
              link_d.target.id === d.currentTarget.__data__.id
              ? 4
              : 1;
          })
          .style('opacity', (link_d: any) => {
            return link_d.source.id === d.currentTarget.__data__.id ||
              link_d.target.id === d.currentTarget.__data__.id
              ? 1
              : 0.2;
          });
      })
      .on('mouseout', () => {
        this.node
          .style('fill', (d: any) => this.getColor(d))
          .style('opacity', 1);
        this.link
          .style('stroke', '#aaa')
          .style('stroke-width', '1')
          .style('opacity', 1);

        this.text_element.style('opacity', 1);
      });
  }

  private getNames(data: any): string[] {
    return data.nodes
      .filter((node: any) => this.currentIds.value.includes(node.id))
      .map((node: any) => node.name);
  }

  getOutline(element: any) {
    let name = element.name;
    if (this.categories[name]) {
      return 'transparent';
    }
    if (this.color3p[element.country]) {
      return 'red';
    }
    return 'transparent';
  }

  getColor(element: any) {
    let name = element.name;
    if (this.categories[name]) {
      const category = this.categories[name].categories[0];
      return this.colors[category];
    }
    if (this.color3p[element.country]) {
      return this.color3p[element.country];
    }
    return '#808080';
  }

  setSelectedNode(node: any) {
    if (node.target.__data__.country) {
      this.dataService.setSelectedNode(node.target.__data__);
    } else {
      let name = node.target.__data__.name;
      this.dataService.setSelectedNode(name);
    }
  }

  belongsToGroup(id: any, node: any) {
    if (id == node.id) return true;
    let statement = false;
    this.data.links.forEach((link: any) => {
      if (link.source.id == id && link.target.id == node.id) statement = true;
      if (link.source.id == node.id && link.target.id == id) statement = true;
      return false;
    });
    return statement;
  }

  ticked() {
    this.node
      // set this if we want to trap it within a div
      // .attr("cx", (d: any) => { return d.x = Math.max(this.radius, Math.min(this.width - this.radius, d.x)); })
      // .attr("cy", (d: any) => { return d.y = Math.max(this.radius, Math.min(this.height - this.radius, d.y)); })
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
    this.text_element
      .attr('x', (d: any) => {
        return d.x;
      })
      .attr('y', (d: any) => {
        return d.y;
      });
  }

  selectNode(event: any) {
    let id = event.target.__data__.id;
    this.selectionChanged([...this.currentIds.value, id]);
    this.networkService.handleDisability(
      this.historyIndex,
      this.historyNew.length
    );
  }

  filterExistingLinks(links: any) {
    for (let link of this.data.links) {
      links = links.filter((element: any) => element.id != link.id);
    }
    return links;
  }

  filterExistingNodes(nodes: any) {
    for (let node of this.data.nodes) {
      nodes = nodes.filter((element: any) => element.id != node.id);
    }
    return nodes;
  }

  filterById(ids: number[]): any {
    let links = this.filterLinks(ids);
    return {
      links: links,
      nodes: this.filterNodes(links),
    };
  }

  filterLinks(id: number[]) {
    return JSON.parse(JSON.stringify(this.alldata.links)).filter((el: any) => {
      if (id.includes(el.source)) return true;
      if (id.includes(el.target)) return true;
      return false;
    });
  }

  filterNodes(links: any[]) {
    const ids = links.flatMap((el: any) => {
      return [el.source, el.target];
    });
    return this.alldata.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true;
      return false;
    });
  }

  getRadius(d: any) {
    return d.count + 5;
  }

  selectionChanged(ids: any) {
    this.updateHistory(ids);
    this.currentIds.next(ids);
  }
}
