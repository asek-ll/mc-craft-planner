import { Component, OnInit, Input } from '@angular/core';
import { ItemStack } from '../recipes/recipe';
import { Item } from '../items/item';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  @Input() stacks: ItemStack[];

  constructor() { }

  ngOnInit() {
  }

  addNewItem(item: Item) {
    this.stacks.push(new ItemStack(item, 1));
  }

  removeStack(stack: ItemStack) {
    this.stacks.splice(this.stacks.indexOf(stack), 1);
  }

}
