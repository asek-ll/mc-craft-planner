import { Component, OnInit, Input } from '@angular/core';
import { Recipe, ConfigurableRecipe } from '../recipes/recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  @Input() recipe: Recipe;
  @Input() configurableRecipe: ConfigurableRecipe;

  constructor() { }

  ngOnInit() {
    if (this.recipe) {
      this.configurableRecipe = new ConfigurableRecipe(this.recipe);
    }
  }

}
