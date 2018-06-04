import { Component, OnInit, Input } from '@angular/core';
import { ItemStack, ConfigurableItemStack } from '../recipes/recipe';

@Component({
  selector: 'app-positioned-item-stack',
  templateUrl: './positioned-item-stack.component.html',
  styleUrls: ['./positioned-item-stack.component.css']
})
export class PositionedItemStackComponent implements OnInit {

  @Input() item: ConfigurableItemStack;

  constructor() { }

  ngOnInit() {
  }

  public getActiveStack(): ItemStack {
    return this.item.getActive();
  }

  public cycleStack() {
    this.item.next();
  }

}
