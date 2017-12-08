import { StoredItem } from "../stored-item";
import { Item } from "../items/item";

export class ItemStack {
  constructor(
    public item: Item,
    public size: number
  ) { }
}

export class PositionedItemStack {
  x: number;
  y: number;
  items: ItemStack[];
}

export class Recipe extends StoredItem {
  handlerName: string;
  result: PositionedItemStack;
  ingredients: PositionedItemStack[];
  others: PositionedItemStack[];
}
