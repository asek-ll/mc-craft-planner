import { StoredItem } from '../stored-item';
import { Item } from '../items/item';

export class ItemStack {
  constructor(
    public item: Item,
    public size: number
  ) { }
}

export class Recipe extends StoredItem {
  result: ItemStack[];
  ingredients: ItemStack[][];
}
