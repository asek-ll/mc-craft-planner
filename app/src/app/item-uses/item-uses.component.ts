import { Component, OnInit } from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items/items.service';
import { RecipesService } from '../recipes/recipes.service';

@Component({
  selector: 'app-item-uses',
  templateUrl: '../item/item.component.html',
  styleUrls: ['../item/item.component.css']
})
export class ItemUsesComponent extends ItemComponent {

  constructor(
    router: Router,
    route: ActivatedRoute,
    itemsService: ItemsService,
    recipeService: RecipesService
  ) {
    super(router, route, itemsService, recipeService);
  }

  protected setItemBySid(sid: string) {
    this.itemsService.findOne({ sid }).then(item => {
      this.item = item;
    });

    this.recipeService.getRecipesWhereUsesItemSid(sid).then(recipes => {
      this.recipes = recipes;
    });
  }

}
