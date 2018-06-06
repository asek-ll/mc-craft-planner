import { StoredItem } from '../stored-item';
import { Item } from '../items/item';

export class ItemStack {
  constructor(
    public item: Item,
    public size: number
  ) { }
}

export class Recipe extends StoredItem {
  handlerName: string;
  result: ItemStack[][];
  ingredients: ItemStack[][];
}

export class ConfigurableItemStack {
  private index = 0;

  constructor(
    public stacks: ItemStack[]
  ) { }

  getActive(): ItemStack {
    return this.stacks[this.index];
  }

  next() {
    this.index = (this.index + 1) % this.stacks.length;
  }
}

export class ConfigurableRecipe {
  public result: ConfigurableItemStack[];
  public ingredients: ConfigurableItemStack[];

  constructor(public recipe: Recipe) {
    this.result = recipe.result.map(stacks => new ConfigurableItemStack(stacks));
    this.ingredients = recipe.ingredients.map(stacks => new ConfigurableItemStack(stacks));
  }
}
