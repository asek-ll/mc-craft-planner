import { Injectable } from '@angular/core';
import { Recipe, ItemStack } from './recipe';
import { StoreHandler } from '../store-handler';
import { DataRequester } from '../data-requester';
import { Item } from '../items/item';
import { StoredItem } from '../stored-item';
import { ItemsService, BatchItemLoader } from '../items/items.service';

class RawItemStack {
  sid: string;
  size: number;
}

class RawRecipe extends StoredItem {
  result: RawItemStack[];
  ingredients: RawItemStack[][];
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

    const convertItemStack = function (items: RawItemStack[]): ItemStack[] {

      if (!items) {
        return null;
      }

      const result: ItemStack[] = [];

      items.forEach(stack => {
        loader.load(stack.sid).then(item => {
          result.push(new ItemStack(item, stack.size));
        });
      });

      return result;
    };

    const convertItemsStacks = function (rawPosStacks: RawItemStack[][]) {
      if (!rawPosStacks) {
        return [];
      }
      return rawPosStacks.map(stack => convertItemStack(stack));
    };

    recipe.result = convertItemStack(json.result);
    recipe.ingredients = convertItemsStacks(json.ingredients);

    return recipe;
  }

  convertRecipes(rawRecipes: RawRecipe[]): Promise<Recipe[]> {
    const loader = this.itemsService.getBatchLoader();
    const recipes = rawRecipes.map(rawRecipe => this.convertRecipe(rawRecipe, loader));
    return loader.process().then(() => recipes);
  }

  getRecipesForItemSid(sid: string): Promise<Recipe[]> {
    return this.rawRecipesService.find({
      'result': {
        '$elemMatch': {
          'sid': sid,
        }
      }
    }).then(rawRecipes => this.convertRecipes(rawRecipes));
  }

  getRecipesWhereUsesItemSid(sid: string): Promise<Recipe[]> {

    return this.rawRecipesService.find({
      'ingredients': {
        '$elemMatch': {
          '$elemMatch': {
            'sid': sid,
          }
        }
      }
    }).then(rawRecipes => this.convertRecipes(rawRecipes));
  }

}
