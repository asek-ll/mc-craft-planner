import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/item';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  item: Item;
  recipes: Recipe[];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected itemsService: ItemsService,
    protected recipeService: RecipesService
  ) { }

  protected setItemBySid(sid: string) {
    this.itemsService.findOne({ sid }).then(item => {
      this.item = item;
    });

    this.recipeService.getRecipesForItemSid(sid).then(recipes => {
      this.recipes = recipes;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.setItemBySid(params.sid);
    });
  }

}
