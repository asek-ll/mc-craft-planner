import { StoredItem } from '../stored-item';
import { ItemStack } from '../recipes/recipe';
import { Item } from '../items/item';

export class Plan extends StoredItem {
  title: string;
  goals: ItemStack[];
  inventory: ItemStack[];
  craftingSteps: CraftingStep[];
}

export class PlanRecipe {
  result: ItemStack;
  ingredients: ItemStack[];
}

export class CraftingStep {
  recipe: PlanRecipe;
  count: number;
}
