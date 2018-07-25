import { Component, OnInit, AfterContentInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as d3 from 'd3';
import { Plan } from '../plan/plan';
import { Item } from '../items/item';
import { ItemStack } from '../recipes/recipe';
import { sankey, SankeyNodeMinimal, SankeyExtraProperties, SankeyLinkMinimal, sankeyLinkHorizontal } from 'd3-sankey';
import { linkHorizontal } from 'd3-shape';

interface Node extends SankeyNodeMinimal<SankeyExtraProperties, SankeyExtraProperties> {
  item: Item;
  id: string;
  value: number;
  count: number;
}

interface Link extends SankeyLinkMinimal<SankeyExtraProperties, SankeyExtraProperties> {
  target: Node;
  source: Node;
  amount: number;
}

@Component({
  selector: 'app-craft-graph',
  templateUrl: './craft-graph.component.html',
  styleUrls: ['./craft-graph.component.css']
})
export class CraftGraphComponent implements OnInit, AfterContentInit {
  @ViewChild('craftGraphCanvas') canvas: ElementRef;
  @Input() plan: Plan;

  private container: d3.Selection<d3.BaseType, {}, null, undefined>;
  d3Sankey: any;

  constructor() { }

  ngOnInit() {
  }

  private getNodesAndLinks(): [Node[], Link[]] {
    const links: { [result: string]: ItemStack[] } = {};
    const items: { [sid: string]: ItemStack } = {};

    this.plan.goals.forEach(goal => {
      const existingItem = items[goal.item.sid];
      if (!existingItem) {
        items[goal.item.sid] = goal;
      }
    });

    this.plan.craftingSteps.forEach(step => {
      if (step.count === 0) {
        return;
      }
      step.recipe.result.forEach(result => {
        links[result.item.sid] = links[result.item.sid] || [];
        step.recipe.ingredients.forEach(ingredient => {
          links[result.item.sid].push(new ItemStack(ingredient.item, ingredient.size * step.count));
        });
      });

      step.recipe.ingredients.forEach(ingredient => {
        const existingItem = items[ingredient.item.sid];
        if (existingItem) {
          items[ingredient.item.sid] = new ItemStack(ingredient.item, existingItem.size + (ingredient.size) * step.count);
        } else {
          items[ingredient.item.sid] = new ItemStack(ingredient.item, ingredient.size * step.count);
        }
      });

    });
    const nodes: Node[] = Object.values(items).map(item => {
      return {
        item: item.item,
        id: item.item.sid,
        count: item.size,
        value: 1,
      };
    });

    const sids: string[] = nodes.map(item => item.item.sid);

    const nodeLinks: Link[] = Object.keys(links).reduce<Link[]>((memo, key) => {
      const deps = links[key] || [];

      deps.forEach(stack => {
        memo.push({
          target: nodes[sids.indexOf(key)],
          source: nodes[sids.indexOf(stack.item.sid)],
          value: 1,
          amount: stack.size,
        });
      });

      return memo;
    }, []);

    return [nodes, nodeLinks];
  }

  public updateGraph() {
    const [nodes, links] = this.getNodesAndLinks();
    this.container.selectAll('*').remove();

    this.d3Sankey({
      nodes: nodes, links: links,
    });

    const linkEl = this.container.selectAll('.link')
      .data(links)
      .enter();

    const horizontalLink = linkHorizontal<any, any>()
      .source(d => [d.source.x1, d.source.y0 + (d.source.y1 - d.source.y0) / 2])
      .target(d => [d.target.x0, d.target.y0 + (d.target.y1 - d.target.y0) / 2]);

    const link = linkEl.append('path')
      .attr('class', 'link')
      .attr('d', horizontalLink)
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('stroke', 'red');

    const linkText = linkEl.append('text')
      .attr('class', 'link-text')
      .attr('x', d => d.source.x1)
      .attr('y', d => d.source.y0 + (d.source.y1 - d.source.y0) / 2 - 6)
      .style('visibility', 'hidden')
      .text(d => d.amount);

    const node = this.container.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        return 'translate(' + d.x0 + ',' + (d.y0 + (d.y1 - d.y0) / 2) + ')';
      })
      .on('mouseover', d => {
        d3.select(d3.event.currentTarget).attr('class', 'node node-hovered');

        const currentId = d.id;
        link.attr('class', l => {
          if (l.target.id === currentId) {
            return 'link hover-link target-hover-link';
          }
          if (l.source.id === currentId) {
            return 'link hover-link source-hover-link';
          }
          return 'link';
        });

        linkText.style('visibility', l => {
          if (l.target.id === currentId) {
            return 'visible';
          }
          return 'hidden';
        });
      })
      .on('mouseout', d => {
        d3.select(d3.event.currentTarget).attr('class', 'node');
        link.attr('class', 'link');
        linkText.style('visibility', 'hidden');
      });

    node.append('image')
      .attr('xlink:href', d => {
        return 'data:image/png; base64,' + d.item.icon;
      })
      .attr('y', -24)
      .attr('width', '48px')
      .attr('height', '48px');

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', null)
      .attr('x', 24)
      .attr('y', 48)
      .text(d => d.item.displayName + ' x ' + d.count);

  }

  ngAfterContentInit() {
    const svg = d3.select(this.canvas.nativeElement);
    const container = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', () => {
        console.log(d3.event);
        container.attr('transform',
          'translate(' + d3.event.transform.x + ' ' + d3.event.transform.y + ')scale(' + d3.event.transform.k + ')');
      });

    svg.call(zoom);

    this.container = container;


    const width = 800;
    const height = 800;
    this.d3Sankey = sankey()
      .size([width, height])
      .nodeWidth(48)
      .nodePadding(10);

    this.updateGraph();
  }

}
