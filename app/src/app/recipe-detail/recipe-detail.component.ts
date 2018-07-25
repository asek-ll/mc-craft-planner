import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe, ItemStack } from '../recipes/recipe';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items/items.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  public recipe: Recipe;

  constructor(
    protected route: ActivatedRoute,
    private recipeService: RecipesService,
    private itemsServices: ItemsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.recipeService.findOne({
          _id: params.id
        }).then(recipe => {
          this.recipe = recipe;
        });
      } else {
        const recipe = new Recipe();
        recipe.handlerName = 'Custom recipe';
        recipe.ingredients = [];
        recipe.result = [];

        if (params.sid) {
          this.itemsServices.findOne({ sid: params.sid }).then(item => {
            recipe.result = [[new ItemStack(item, 1)]];
            this.recipe = recipe;
          }, () => {
            this.recipe = recipe;
          });
        } else {
          this.recipe = recipe;
        }
      }
    });
  }

  public addIngredient(ingredients: ItemStack[][]) {
    ingredients.push([]);
  }

  public removeIngredient(ingredients: ItemStack[][], ingredient: ItemStack[]) {
    const index = ingredients.indexOf(ingredient);
    if (index >= 0) {
      ingredients.splice(index, 1);
    }
  }

  public saveRecipe(recipe: Recipe) {
    if (recipe._id) {
      this.recipeService.updateItem(recipe);
    } else {
      this.recipeService.insertItem(recipe).then(savedRecipe => {
        this.router.navigate(['/recipe/' + savedRecipe._id]);
      });
    }
  }

  public deleteRecipe(recipe: Recipe) {
    this.recipeService.deleteItem(recipe).then(() => {
      this.router.navigate(['/recipes']);
    });
  }

}
