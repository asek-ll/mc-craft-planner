import { StoredItem } from '../stored-item';
import { PlanRecipe } from '../plan/plan';
import { ItemStack, RawItemStack } from '../recipes/recipe';

export class Rule extends StoredItem {
  result: ItemStack[];
  ingredients: ItemStack[];
}

export class RawRule extends StoredItem {
  result: RawItemStack[];
  ingredients: RawItemStack[];
}
