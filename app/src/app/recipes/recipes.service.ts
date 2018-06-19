import { Injectable } from '@angular/core';
import { Recipe, ItemStack, RawItemStack } from './recipe';
import { StoreHandler, SimpleStoreHandler } from '../store-handler';
import { DataRequester } from '../data-requester';
import { Item } from '../items/item';
import { StoredItem } from '../stored-item';
import { ItemsService, BatchItemLoader } from '../items/items.service';
import { ItemStackUtils } from '../convertion-utils';

export class RawRecipe extends StoredItem {
  handlerName: string;
  result: RawItemStack[][];
  ingredients: RawItemStack[][];
}

@Injectable()
export class RecipesService extends SimpleStoreHandler<Recipe, RawRecipe> {
  constructor(private dataRequester: DataRequester, private itemsService: ItemsService) {
    super(dataRequester, 'recipes');
  }

  public convertRecipe(json: RawRecipe, loader: BatchItemLoader): Recipe {
    const recipe = new Recipe();

    recipe._id = json._id;

    const convertItemsStacks = (rawPosStacks: RawItemStack[][]) => {
      if (!rawPosStacks) {
        return [];
      }
      return rawPosStacks.map(stack => ItemStackUtils.toItemStacks(stack, loader));
    };

    recipe.result = convertItemsStacks(json.result);
    recipe.ingredients = convertItemsStacks(json.ingredients);
    recipe.handlerName = json.handlerName;

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
          '$elemMatch': {
            'sid': sid,
          }
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

  private ingredientsToRaw(ingredients: ItemStack[][]): RawItemStack[][] {
    return ingredients.map(stacks => ItemStackUtils.toRawStacks(stacks));
  }

  protected toRaw(recipe: Recipe): RawRecipe {
    const rawRecipe = new RawRecipe();
    rawRecipe._id = recipe._id;
    rawRecipe.handlerName = recipe.handlerName;

    rawRecipe.ingredients = this.ingredientsToRaw(recipe.ingredients);
    rawRecipe.result = this.ingredientsToRaw(recipe.result);

    return rawRecipe;
  }

}
