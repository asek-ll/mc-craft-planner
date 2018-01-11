import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  public recipe: Recipe;

  constructor(
    protected route: ActivatedRoute,
    private recipeService: RecipesService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.recipeService.findOne({
        _id: params.id
      }).then(recipe => {
        this.recipe = recipe;
      });
    });
  }

}
