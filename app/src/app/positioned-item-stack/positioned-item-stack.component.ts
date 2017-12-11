import { Component, OnInit, Input } from '@angular/core';
import { ItemStack } from '../recipes/recipe';

@Component({
  selector: 'app-positioned-item-stack',
  templateUrl: './positioned-item-stack.component.html',
  styleUrls: ['./positioned-item-stack.component.css']
})
export class PositionedItemStackComponent implements OnInit {

  @Input() items: ItemStack[];

  public activeIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  public getActiveStack() {
    return this.items[this.activeIndex];
  }

  public cycleStack() {
    let nextIndex = this.activeIndex + 1;

    if (nextIndex >= this.items.length) {
      nextIndex = 0;
    }

    this.activeIndex = nextIndex;
  }

}
