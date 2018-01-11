import { Injectable } from '@angular/core';
import { Recipe, ItemStack } from './recipe';
import { StoreHandler, SimpleStoreHandler } from '../store-handler';
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

@Injectable()
export class RecipesService extends SimpleStoreHandler<Recipe, RawRecipe> {

  constructor(private dataRequester: DataRequester, private itemsService: ItemsService) {
    super(dataRequester, 'recipes');
  }

  convertRecipe(json: RawRecipe, loader: BatchItemLoader): Recipe {
    const recipe = new Recipe();

    recipe._id = json._id;

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

  protected convertOne(json: RawRecipe): Promise<Recipe> {
    const loader = this.itemsService.getBatchLoader();
    const recipe = this.convertRecipe(json, loader);
    return loader.process().then(() => recipe);
  }

  convertMultiple(rawRecipes: RawRecipe[]): Promise<Recipe[]> {
    const loader = this.itemsService.getBatchLoader();
    const recipes = rawRecipes.map(rawRecipe => this.convertRecipe(rawRecipe, loader));
    return loader.process().then(() => recipes);
  }

  getRecipesForItemSid(sid: string): Promise<Recipe[]> {
    return this.find({
      'result': {
        '$elemMatch': {
          'sid': sid,
        }
      }
    });
  }

  getRecipesWhereUsesItemSid(sid: string): Promise<Recipe[]> {

    return this.find({
      'ingredients': {
        '$elemMatch': {
          '$elemMatch': {
            'sid': sid,
          }
        }
      }
    });
  }

}
