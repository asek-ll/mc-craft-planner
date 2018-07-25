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

  private static compactIngredients(stacks: ItemStack[]): ItemStack[] {
    const sidMap: Map<string, ItemStack> = new Map();

    stacks.reduce((map, stack) => {
      const item = stack.item;
      const stored = map.get(item.sid);
      const newValue = stored ? new ItemStack(item, stored.size + stack.size) : stack;

      map.set(item.sid, newValue);

      return map;
    }, sidMap);

    return Array.from(sidMap.values());
  }

  toString(): string {
    return this.result.map(stack => stack.item.sid + 'x' + stack.size).join('&') + '>'
      + this.ingredients.map(stack => stack.item.sid + 'x' + stack.size).join('&');
  }

  compact(): PlanRecipe {
    const result = new PlanRecipe();
    result.ingredients = PlanRecipe.compactIngredients(this.ingredients);
    result.result = this.result;
    return result;
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
