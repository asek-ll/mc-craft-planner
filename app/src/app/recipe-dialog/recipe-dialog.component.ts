import { Component, OnInit, Inject } from '@angular/core';
import { Recipe, ItemStack, ConfigurableRecipe } from '../recipes/recipe';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '../items/item';
import { RecipesService } from '../recipes/recipes.service';
import { PlanRecipe } from '../plan/plan';
import { RulesService } from '../rules/rules.service';

export class RecipeDialogConfig {
  item: Item;
  allowAutoExpand: boolean;
}

@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.css']
})
export class RecipeDialogComponent implements OnInit {

  public recipes: ConfigurableRecipe[] = [];
  private unfilteredRecipes: ConfigurableRecipe[] = [];

  public recipeFilter = '';

  constructor(public dialogRef: MatDialogRef<RecipeDialogComponent, PlanRecipe>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDialogConfig,
    public recipesService: RecipesService,
    private ruleService: RulesService) {

  }

  ngOnInit() {
    this.recipesService.getRecipesForItemSid(this.data.item.sid).then(recipes => {
      this.unfilteredRecipes = recipes.map(recipe => new ConfigurableRecipe(recipe));
      this.recipes = this.getFilteredRecipes();
    });
  }

  private getFilteredRecipes(): ConfigurableRecipe[] {
    if (!this.recipeFilter) {
      return this.unfilteredRecipes;
    }
    const recipeFilter = this.recipeFilter.toLowerCase();
    return this.unfilteredRecipes.filter(recipe => {
      if (recipe.recipe.handlerName.toLowerCase().indexOf(recipeFilter) >= 0) {
        return true;
      }

      return recipe.ingredients.some(ingredient => {
        const active = ingredient.getActive();

        if (active.item.displayName.toLowerCase().indexOf(recipeFilter) >= 0) {
          return true;
        }

        return false;
      });
    });
  }

  select(recipe: ConfigurableRecipe) {
    const planRecipe = new PlanRecipe();
    planRecipe.result = [];

    recipe.result.forEach(result => {
      const active = result.getActive();
      if (active) {
        planRecipe.result.push(active);
      }
    });

    const planIngredients = [];

    recipe.ingredients.forEach(ingredients => {
      const active = ingredients.getActive();
      if (active) {
        planIngredients.push(active);
      }
    });

    planRecipe.ingredients = this.compactIngredients(planIngredients);

    if (this.data.allowAutoExpand) {
      this.ruleService.insertItem({
        _id: undefined,
        ingredients: planRecipe.ingredients,
        result: planRecipe.result,
      }).then(() => {
        this.dialogRef.close(planRecipe);
      });
    } else {
      this.dialogRef.close(planRecipe);
    }
  }

  private compactIngredients(stacks: ItemStack[]): ItemStack[] {
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
  public onUpdateRecipeFilter() {
    this.recipes = this.getFilteredRecipes();
  }
}
