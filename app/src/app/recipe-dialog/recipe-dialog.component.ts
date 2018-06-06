import { Component, OnInit, Inject } from '@angular/core';
import { Recipe, ItemStack, ConfigurableRecipe } from '../recipes/recipe';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '../items/item';
import { RecipesService } from '../recipes/recipes.service';
import { PlanRecipe } from '../plan/plan';

@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.css']
})
export class RecipeDialogComponent implements OnInit {

  public recipes: ConfigurableRecipe[] = [];

  constructor(public dialogRef: MatDialogRef<RecipeDialogComponent, PlanRecipe>,
    @Inject(MAT_DIALOG_DATA) public data: Item,
    public recipesService: RecipesService) {

  }

  ngOnInit() {
    this.recipesService.getRecipesForItemSid(this.data.sid).then(recipes => {
      this.recipes = recipes.map(recipe => new ConfigurableRecipe(recipe));
    });
  }

  select(recipe: ConfigurableRecipe) {
    const planRecipe = new PlanRecipe();
    planRecipe.result = [];

    recipe.result.forEach(result => {
      planRecipe.result.push(result.getActive());
    });

    const planIngredients = [];

    recipe.ingredients.forEach(ingredients => {
      planIngredients.push(ingredients.getActive());
    });

    planRecipe.ingredients = this.compactIngredients(planIngredients);


    this.dialogRef.close(planRecipe);
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

}
