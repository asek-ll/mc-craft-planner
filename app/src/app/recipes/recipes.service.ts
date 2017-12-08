import { Injectable } from '@angular/core';
import { Recipe, PositionedItemStack, ItemStack } from './recipe';
import { StoreHandler } from '../store-handler';
import { DataRequester } from '../data-requester';
import { Item } from '../items/item';
import { StoredItem } from '../stored-item';
import { ItemsService, BatchItemLoader } from '../items/items.service';

class RawItemStack {
  sid: string;
  size: number;
}

class RawPositionedItemStack {
  x: number;
  y: number;
  items: RawItemStack[];
}

class RawRecipe extends StoredItem {
  handlerName: string;
  result: RawPositionedItemStack;
  ingredients: RawPositionedItemStack[];
  others: RawPositionedItemStack[];
}

class RawRecipesService extends StoreHandler<RawRecipe> {
  constructor(private dataRequester: DataRequester) {
    super(dataRequester, 'recipes', RawRecipe);
  }
}

@Injectable()
export class RecipesService {
  rawRecipesService: RawRecipesService;

  constructor(private dataRequester: DataRequester, private itemsService: ItemsService) {
    this.rawRecipesService = new RawRecipesService(dataRequester);
  }

  convertRecipe(json: RawRecipe, loader: BatchItemLoader): Recipe {
    const recipe = new Recipe();

    const convertItemStack = function (rawPosStack: RawPositionedItemStack): PositionedItemStack {

      if (!rawPosStack) {
        return null;
      }

      const result = new PositionedItemStack();

      result.x = rawPosStack.x;
      result.y = rawPosStack.y;
      result.items = [];

      rawPosStack.items.forEach(stack => {
        loader.load(stack.sid).then(item => {
          result.items.push(new ItemStack(item, stack.size));
        });
      });

      return result;
    };

    const convertItemsStacks = function (rawPosStacks: RawPositionedItemStack[]) {
      if (!rawPosStacks) {
        return [];
      }
      return rawPosStacks.map(stack => convertItemStack(stack));
    };

    recipe.result = convertItemStack(json.result);
    recipe.ingredients = convertItemsStacks(json.ingredients);
    recipe.others = convertItemsStacks(json.others);

    return recipe;
  }

  convertRecipes(rawRecipes: RawRecipe[]): Promise<Recipe[]> {
    const loader = this.itemsService.getBatchLoader();
    const recipes = rawRecipes.map(rawRecipe => this.convertRecipe(rawRecipe, loader));
    return loader.process().then(() => recipes);
  }

  getRecipesForItemSid(sid: string): Promise<Recipe[]> {
    return this.rawRecipesService.find({
      'result.sid': sid,
    }).then(rawRecipes => this.convertRecipes(rawRecipes));
  }

  getRecipesWhereUsesItemSid(sid: string): Promise<Recipe[]> {
    return this.rawRecipesService.find({
      'ingredients': {
        '$elemMatch': {
          'sid': sid,
        }
      }
    }).then(rawRecipes => this.convertRecipes(rawRecipes));
  }

}
