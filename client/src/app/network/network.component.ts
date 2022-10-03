import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../services/data.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
})
/**
 * the network component mainly handles the visual part of the network viz
 */
export class NetworkComponent implements OnInit {
  colors: any;

  data: any;

  categories: any;

  svg: any;

  node: any;

  link: any;

  simulation: any;

  text_element: any;

  color3p: any;

  constructor(
    private dataService: DataService,
    public networkService: NetworkService
  ) {}

  /**
   * sets up the svg subscribes to different observables.
   */
  ngOnInit(): void {
    this.initSVGs();
    // this subscription is mainly to set up some initial values for the visualization
    this.dataService.getCurrentDataSet().subscribe((data: any) => {
      this.networkService.init();
      this.categories = data.category;
      this.colors = data.color;
      this.color3p = data.color3p;
    });

    // this subscription observes if the ids of all the nodes to be shown have changed.
    // some refactoring here would be good as updateIds has nothing to do with the visualization
    this.networkService.currentIds.subscribe((ids: Set<number>) => {
      if (ids.size === 0) return;
      this.networkService.updateIds(ids);
      this.data = this.networkService.generateDataByIds(ids);
      this.update(this.data);
    });
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
    return (Math.log10(count) + 1) * -600;
  }

  /**
   * the update function updates the network graph. all the .exit() and .enter() functions are handled automatically by the d3 integrated .join() function
   * @param data the network data that is generated in network service
   */
  update(data: any) {
    // update links
    this.link = this.link
      .data(data.links, (d: any) => {
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

    //	update simulation
    this.simulation.nodes(data.nodes).on('tick', this.ticked.bind(this));
    this.simulation.force('link').links(data.links);
    this.simulation.alpha(1).alphaTarget(0).restart();
  }

  /**
   * styleNodes is just for breaking apart the big update function.
   * functionality stayed the same
   */
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
            return this.getColor(node) + '33';
          })
          .style('stroke', (node: any) => {
            if (this.belongsToGroup(d.currentTarget.__data__.id, node))
              return this.getOutline(node);
            return this.getOutline(node) + '33';
          });
        // .style('opacity', (node: any) => {
        //   if (this.belongsToGroup(d.currentTarget.__data__.id, node))
        //     return 1;
        //   return 0.2;
        // });
        this.text_element.style('fill', (node: any) => {
          if (this.belongsToGroup(d.currentTarget.__data__.id, node))
            return '#000000';
          return '#00000033';
        });
        this.link
          .style('stroke', (link_d: any) => {
            return link_d.source.id === d.currentTarget.__data__.id ||
              link_d.target.id === d.currentTarget.__data__.id
              ? '#69b3b2'
              : '#b8b8b833';
          })
          .style('stroke-width', (link_d: any) => {
            return link_d.source.id === d.currentTarget.__data__.id ||
              link_d.target.id === d.currentTarget.__data__.id
              ? 4
              : 1;
          });
        // .style('opacity', (link_d: any) => {
        //   return link_d.source.id === d.currentTarget.__data__.id ||
        //     link_d.target.id === d.currentTarget.__data__.id
        //     ? 1
        //     : 0.2;
        // });
      })
      .on('mouseout', () => {
        this.node.style('fill', (d: any) => this.getColor(d));
        this.link.style('stroke', '#aaa').style('stroke-width', '1');
        this.text_element.style('fill', '#000000');
      });
  }

  /**
   * selectNode is the function called when clicking a node
   * @param event the event data is sent to networkService where it gets handled
   */
  selectNode(event: any) {
    this.networkService.selectNode(event);
  }

  ticked() {
    this.node
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

  getOutline(element: any) {
    let name = element.name;
    if (this.categories[name]) {
      return '#ffffff00';
    }
    if (this.color3p[element.country]) {
      return '#ff0000';
    }
    return '#ffffff00';
  }

  getColor(element: any) {
    let name = element.name;
    if (this.categories[name]) {
      const category = this.categories[name].categories[0];
      return this.colors[category];
    }
    // if (this.color3p[element.country]) {
    //   return this.color3p[element.country];
    // }
    return '#808080';
  }

  getRadius(d: any) {
    return d.count + 5;
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
}
