import { StoredItem } from '../stored-item';
import { ItemStack, RawItemStack } from '../recipes/recipe';
import { Item } from '../items/item';

export class Plan extends StoredItem {
  title: string;
  goals: ItemStack[];
  inventory: ItemStack[];
  craftingSteps: CraftingStep[];
}

export class PlanRecipe {
  result: ItemStack[];
  ingredients: ItemStack[];

  toString(): string {
    return this.result.map(stack => stack.item.sid + 'x' + stack.size).join('&') + '>'
      + this.ingredients.map(stack => stack.item.sid + 'x' + stack.size).join('&');
  }
}

export class CraftingStep {
  recipe: PlanRecipe;
  count: number;
}

export class RawPlanRecipe {
  result: RawItemStack[];
  ingredients: RawItemStack[];
}

export class RawCraftingStep {
  recipe: RawPlanRecipe;
  count: number;
}

export class RawPlan extends StoredItem {
  title: string;
  goals: RawItemStack[];
  inventory: RawItemStack[];
  craftingSteps: RawCraftingStep[];
}
