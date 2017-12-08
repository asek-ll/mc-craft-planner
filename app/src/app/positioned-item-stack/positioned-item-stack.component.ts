import { Component, OnInit, Input } from '@angular/core';
import { PositionedItemStack } from '../recipes/recipe';

@Component({
  selector: 'app-positioned-item-stack',
  templateUrl: './positioned-item-stack.component.html',
  styleUrls: ['./positioned-item-stack.component.css']
})
export class PositionedItemStackComponent implements OnInit {

  @Input() positionedItemStack: PositionedItemStack;

  public activeIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  public getActiveStack() {
    return this.positionedItemStack.items[this.activeIndex];
  }

  public cycleStack() {
    var nextIndex = this.activeIndex + 1;

    if(nextIndex >=this.positionedItemStack.items.length) {
      nextIndex = 0;
    }

    this.activeIndex = nextIndex;
  }

}
