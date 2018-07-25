import { Component, OnInit, Inject } from '@angular/core';
import { Recipe, ItemStack, ConfigurableRecipe, ConfigurableItemStack } from '../recipes/recipe';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '../items/item';
import { RecipesService } from '../recipes/recipes.service';
import { PlanRecipe } from '../plan/plan';
import { RulesService } from '../rules/rules.service';

export class RecipeDialogConfig {
  item: Item;
  allowAutoExpand: boolean;
}

export class ConfigurableSelectableItemStack extends ConfigurableItemStack {
  public selected = true;

  constructor(public stacks: ItemStack[]) {
    super(stacks);
  }

}

class ConfigurableSelectableRecipe {
  public result: ConfigurableSelectableItemStack[];
  public ingredients: ConfigurableItemStack[];

  constructor(public recipe: Recipe) {
    this.result = recipe.result.map(stacks => new ConfigurableSelectableItemStack(stacks));
    this.ingredients = recipe.ingredients.map(stacks => new ConfigurableItemStack(stacks));
  }
}

@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.css']
})
export class RecipeDialogComponent implements OnInit {

  public recipes: ConfigurableSelectableRecipe[] = [];
  private unfilteredRecipes: ConfigurableSelectableRecipe[] = [];

  public recipeFilter = '';

  constructor(public dialogRef: MatDialogRef<RecipeDialogComponent, PlanRecipe>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDialogConfig,
    public recipesService: RecipesService,
    private ruleService: RulesService) {

  }

  ngOnInit() {
    this.recipesService.getRecipesForItemSid(this.data.item.sid).then(recipes => {
      this.unfilteredRecipes = recipes.map(recipe => new ConfigurableSelectableRecipe(recipe));
      this.recipes = this.getFilteredRecipes();
    });
  }

  private getFilteredRecipes(): ConfigurableSelectableRecipe[] {
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

  select(recipe: ConfigurableSelectableRecipe) {
    const planRecipe = new PlanRecipe();
    planRecipe.result = [];

    recipe.result.forEach(result => {
      const active = result.getActive();
      if (active && result.selected) {
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

    planRecipe.ingredients = planIngredients;

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

  public onUpdateRecipeFilter() {
    this.recipes = this.getFilteredRecipes();
  }
}
