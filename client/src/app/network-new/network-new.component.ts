import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as d3 from 'd3';

import { DataService } from '../data.service';

import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

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

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this.initSVGs();
      this.data = JSON.parse(JSON.stringify(data.network));
      this.alldata = JSON.parse(JSON.stringify(data.network));
      this.categories = data.category;
      this.domain = JSON.parse(JSON.stringify(data.domain));
      this.colors = data.color;
      this.color3p = data.color3p;
      this.update(this.data);
      this.updateHistory();
    });
    // this.initNodeList()
  }

  changeSelection(value: number[]) {
    this.filterById(value);
    this.update(this.data);
    this.updateHistory();
  }

  navigateSelection(direction: number) {
    this.historyIndex += direction;
    console.log('going to index: ' + this.historyIndex);
    //this.filterById(this.history[this.historyIndex].ids);
    this.update(this.history[this.historyIndex].data);
  }

  formatData(data: any): any {
    var formatLinks: any[] = [];
    var formatNodes: any[] = [];

    data.links.forEach((link: any) => {
      var tempLink: any = {
        id: link.id,
        source: link.source.id,
        target: link.target.id,
      };
      if (link.name) tempLink.name = link.name;
      formatLinks.push(tempLink);
    });
    data.nodes.forEach((node: any) => {
      var tempNode: any = {
        id: node.id,
        name: node.name,
        country: node.country,
        count: node.count,
      };
      formatNodes.push(tempNode);
    });

    return { links: formatLinks, nodes: formatNodes };
  }

  updateHistory() {
    var newNodes = this.formatData(this.data).nodes;
    if (
      this.historyIndex == 0 ||
      !this.nodesAreSame(newNodes, this.history[this.historyIndex].data.nodes)
    ) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push({
        data: this.formatData(this.data),
      });
      this.historyIndex = this.history.length - 1;
    }
  }

  nodesAreSame(newNodes: any, currentNodes: any): boolean {
    const newIds = newNodes.map((node: any) => node.id);
    const currentIds = currentNodes.map((node: any) => node.id);
    if (newIds.length == currentIds.length) {
      for (const id of newIds) {
        if (!currentIds.includes(id)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  initNodeList() {
    this.alldata.nodes.forEach((node: any) => {
      if (node.name) {
        this.nodeList.push({ name: node.name, count: node.count, id: node.id });
      }
    });
    this.nodeList.sort(function (a, b) {
      return b.count - a.count;
    });
    this.nodeList.unshift({ name: 'show all' });
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
    debugger;
    let id = event.target.__data__.id;
    let linksToAdd = JSON.parse(JSON.stringify(this.alldata.links)).filter(
      (link: any) => link.source == id || link.target == id
    );
    linksToAdd = this.filterExistingLinks(linksToAdd);
    this.data.links.push(...linksToAdd);

    const ids = linksToAdd.flatMap((el: any) => {
      return [el.target, el.source];
    });

    let nodesToAdd = this.alldata.nodes.filter((node: any) => {
      return ids.includes(node.id);
    });

    nodesToAdd = this.filterExistingNodes(nodesToAdd);

    this.data.nodes.push(...nodesToAdd);

    this.update(this.data);
    this.updateHistory();
    // TODO history doesn't work for the navigation
    // let value: number[] = this.history[this.historyIndex].ids;
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

  filterById(id: number[]) {
    this.filterLinks(id);
    this.filterNodes(this.data.links);
  }

  filterLinks(id: number[]) {
    this.data.links = JSON.parse(JSON.stringify(this.alldata.links)).filter(
      (el: any) => {
        if (id.includes(el.source)) return true;
        if (id.includes(el.target)) return true;
        return false;
      }
    );
  }

  filterNodes(links: any[]) {
    const ids = links.flatMap((el: any) => {
      return [el.source, el.target];
    });
    this.data.nodes = this.alldata.nodes.filter((el: any) => {
      if (ids.includes(el.id)) return true;
      return false;
    });
  }

  getRadius(d: any) {
    //return d.count / 2 + 5;
    return d.count + 5;
  }
}
