import { Component, OnInit, Inject } from '@angular/core';
import { Recipe, ItemStack } from '../recipes/recipe';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '../items/item';
import { RecipesService } from '../recipes/recipes.service';
import { PlanRecipe } from '../plan/plan';

@Component({
  selector: 'app-recipe-dealog',
  templateUrl: './recipe-dealog.component.html',
  styleUrls: ['./recipe-dealog.component.css']
})
export class RecipeDealogComponent implements OnInit {

  public recipes: Recipe[] = [];

  constructor(public dialogRef: MatDialogRef<RecipeDealogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: Item,
  public recipesService: RecipesService) {

  }

  ngOnInit() {
    this.recipesService.getRecipesForItemSid(this.data.sid).then(recipes => {
      this.recipes = recipes;
    });
  }

  select(recipe: Recipe) {
    const planRecipe = new PlanRecipe();
    planRecipe.result = recipe.result[0];
    planRecipe.ingredients = [];

    recipe.ingredients.forEach(ingredients => {
      planRecipe.ingredients.push(ingredients[0]);
    });

    this.dialogRef.close(planRecipe);
  }

}
