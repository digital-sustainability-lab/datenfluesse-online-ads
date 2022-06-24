import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { flare } from './flare';

@Component({
  selector: 'app-hierarch-bar',
  templateUrl: './hierarch-bar.component.html',
  styleUrls: ['./hierarch-bar.component.css']
})
export class HierarchBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let test: any = this.create()

  }

  create() {
    debugger
    const svg = d3.select('#my_dataviz')
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)

    this.x.domain([0, this.root.value]);

    svg.append("rect")
      .attr("class", "background")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("cursor", "pointer")
      .on("click", (event, d) => this.up(svg, d));

    svg.append("g")
      .call(this.xAxis);

    svg.append("g")
      .call(this.yAxis);

    this.down(svg, this.root);
  }

  data = flare

  barStep = 27

  barPadding = 3 / this.barStep

  duration = 750

  width = 1000

  height = 894

  bar: any

  color = d3.scaleOrdinal([true, false], ["steelblue", "#aaa"])

  margin = ({ top: 30, right: 30, bottom: 0, left: 100 })

  xAxis = (g: any) => g
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${this.margin.top})`)
    .call(d3.axisTop(this.x).ticks(this.width / 80, "s"))
    .call((g: any) => (g.selection ? g.selection() : g).select(".domain").remove())

  yAxis = (g: any) => g
    .attr("class", "y-axis")
    .attr("transform", `translate(${this.margin.left + 0.5},0)`)
    .call((g: any) => g.append("line")
      .attr("stroke", "currentColor")
      .attr("y1", this.margin.top)
      .attr("y2", this.height - this.margin.bottom))

  x: any = d3.scaleLinear().range([this.margin.left, this.width - this.margin.right])

  root = d3.hierarchy(this.data)
    .sum((d: any) => d.value)
    .sort((a: any, b: any) => b.value - a.value)
    .eachAfter((d: any) => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0)

  // Creates a set of bars for the given data node, at the specified index.
  create_bar(svg: any, down: any, d: any, selector: any) {
    const g = svg.insert("g", selector)
      .attr("class", "enter")
      .attr("transform", `translate(0,${this.margin.top + this.barStep * this.barPadding})`)
      .attr("text-anchor", "end")
      .style("font", "10px sans-serif");
    console.log(d, "")
    this.bar = g.selectAll("g")
      .data(d.children)
      .join("g")
      .attr("cursor", (d: any) => !d.children ? null : "pointer")
      .on("click", (event: any, d: any) => this.down(svg, d));

    this.bar.append("text")
      .attr("x", this.margin.left - 6)
      .attr("y", this.barStep * (1 - this.barPadding) / 2)
      .attr("dy", ".35em")
      .text((d: any) => d.data.name);

    this.bar.append("rect")
      .attr("x", this.x(0))
      .attr("width", (d: any) => this.x(d.value) - this.x(0))
      .attr("height", this.barStep * (1 - this.barPadding));

    return g;
  }

  down(svg: any, d: any) {
    debugger
    if (!d.children || d3.active(svg.node())) return;

    // Rebind the current node to the background.
    svg.select(".background").datum(d);

    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(750);
    const transition2 = transition1.transition();

    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
      .attr("class", "exit");

    // Entering nodes immediately obscure the clicked-on bar, so hide it.
    exit.selectAll("rect")
      .attr("fill-opacity", (p: any) => p === d ? 1 : null);

    // Transition exiting bars to fade out.
    exit.transition(transition1)
      .attr("fill-opacity", 0)
      .remove();

    // Enter the new bars for the clicked-on data.
    // Per above, entering bars are immediately visible.
    const enter = this.create_bar(svg, this.down, d, ".y-axis")
      .attr("fill-opacity", 0);

    // Have the text fade-in, even though the bars are visible.
    enter.transition(transition1)
      .attr("fill-opacity", 1);

    // Transition entering bars to their new y-position.
    enter.selectAll("g")
      .attr("transform", this.stack(d.index))
      .transition(transition1)
      .attr("transform", this.stagger());

    // Update the x-scale domain.
    this.x.domain([0, d3.max(d.children, (d: any) => d.value)]);

    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition2)
      .call(this.xAxis);

    // Transition entering bars to the new x-scale.
    enter.selectAll("g").transition(transition2)
      .attr("transform", (d: any, i: any) => `translate(0,${this.barStep * i})`);

    // Color the bars as parents; they will fade to children if appropriate.
    enter.selectAll("rect")
      .attr("fill", this.color(true))
      .attr("fill-opacity", 1)
      .transition(transition2)
      .attr("fill", (d: any) => this.color(!!d.children))
      .attr("width", (d: any) => this.x(d.value) - this.x(0));
  }

  up(svg: any, d: any) {
    if (!d.parent || !svg.selectAll(".exit").empty()) return;

    // Rebind the current node to the background.
    svg.select(".background").datum(d.parent);

    // Define two sequenced transitions.
    const transition1 = svg.transition().duration(this.duration);
    const transition2 = transition1.transition();

    // Mark any currently-displayed bars as exiting.
    const exit = svg.selectAll(".enter")
      .attr("class", "exit");

    // Update the x-scale domain.
    this.x.domain([0, d3.max(d.parent.children, (d: any) => d.value)]);

    // Update the x-axis.
    svg.selectAll(".x-axis").transition(transition1)
      .call(this.xAxis);

    // Transition exiting bars to the new x-scale.
    exit.selectAll("g").transition(transition1)
      .attr("transform", this.stagger());

    // Transition exiting bars to the parent’s position.
    exit.selectAll("g").transition(transition2)
      .attr("transform", this.stack(d.index));

    // Transition exiting rects to the new scale and fade to parent color.
    exit.selectAll("rect").transition(transition1)
      .attr("width", (d: any) => this.x(d.value) - this.x(0))
      .attr("fill", this.color(true));

    // Transition exiting text to fade out.
    // Remove exiting nodes.
    exit.transition(transition2)
      .attr("fill-opacity", 0)
      .remove();

    // Enter the new bars for the clicked-on data's parent.
    const enter = this.create_bar(svg, this.down, d.parent, ".exit")
      .attr("fill-opacity", 1);

    enter.selectAll("g")
      .attr("transform", (d: any, i: any) => `translate(0,${this.barStep * i})`);

    // Transition entering bars to fade in over the full duration.
    enter.transition(transition2)
      .attr("fill-opacity", 1);

    // Color the bars as appropriate.
    // Exiting nodes will obscure the parent bar, so hide it.
    // Transition entering rects to the new x-scale.
    // When the entering parent rect is done, make it visible!

    let test = enter.selectAll("rect")
      .attr("fill", (d: any) => this.color(!!d.children))
      .attr("fill-opacity", (p: any) => p === d ? 0 : null)
      .transition(transition2)
      .attr("width", (d: any) => this.x(d.value) - this.x(0))
      .on("end", function (p: any) { d3.selectAll('rect').attr("fill-opacity", 1); });



  }

  stack(i: any) {
    let value = 0;
    return (d: any) => {
      const t = `translate(${this.x(value) - this.x(0)},${this.barStep * i})`;
      value += d.value;
      return t;
    };
  }

  stagger() {
    let value = 0;
    return (d: any, i: any) => {
      const t = `translate(${this.x(value) - this.x(0)},${this.barStep * i})`;
      value += d.value;
      return t;
    };
  }

}
