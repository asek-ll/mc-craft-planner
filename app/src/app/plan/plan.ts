import { StoredItem } from '../stored-item';
import { ItemStack, Recipe } from '../recipes/recipe';
import { Item } from '../items/item';

export class Plan extends StoredItem {
  title: string;
  goals: ItemStack[];
  inventory: ItemStack[];
  craftingSteps: CraftingStep[];
}

export class CraftingStep {
  result: Item;
  recipe: Recipe;
  count: number;
}
