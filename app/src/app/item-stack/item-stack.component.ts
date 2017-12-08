import { Component, OnInit, Input } from '@angular/core';
import { ItemStack } from '../recipes/recipe';

@Component({
  selector: 'app-item-stack',
  templateUrl: './item-stack.component.html',
  styleUrls: ['./item-stack.component.css']
})
export class ItemStackComponent implements OnInit {

  @Input() itemStack: ItemStack;

  constructor() { }

  ngOnInit() {
  }

  getTooltip() {
    const item = this.itemStack.item;
    return item.displayName + ' ' + item.sid + ' (' + this.itemStack.size + ')';
  }

}
