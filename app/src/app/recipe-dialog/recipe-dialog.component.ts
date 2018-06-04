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

    planRecipe.ingredients = [];

    recipe.ingredients.forEach(ingredients => {
      planRecipe.ingredients.push(ingredients.getActive());
    });

    this.dialogRef.close(planRecipe);
  }

}
