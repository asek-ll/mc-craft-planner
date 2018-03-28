import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemStack } from '../recipes/recipe';
import { Item } from '../items/item';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  @Input()
  @Output()
  stacks: ItemStack[];

  @Output()
  onItemsChanges: EventEmitter<ItemStack[]> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addNewItem(item: Item) {
    this.stacks.push(new ItemStack(item, 1));
    this.onItemsChanges.emit(this.stacks);
  }

  removeStack(stack: ItemStack) {
    this.stacks.splice(this.stacks.indexOf(stack), 1);
    this.onItemsChanges.emit(this.stacks);
  }

  onStackSizeUpdate() {
    this.onItemsChanges.emit(this.stacks);
  }

}
