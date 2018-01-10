import { Component, OnInit } from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items/items.service';
import { RecipesService } from '../recipes/recipes.service';

@Component({
  selector: 'app-item-uses',
  templateUrl: '../item-uses/item-uses.component.html',
  styleUrls: ['../item-uses/item-uses.component.css']
})
export class ItemUsesComponent extends ItemComponent implements OnInit {

  constructor(
    router: Router,
    route: ActivatedRoute,
    itemsService: ItemsService,
    recipeService: RecipesService
  ) {
    super(router, route, itemsService, recipeService);
  }

  protected getQueryBySid(sid: string): object {
    return {
      'ingredients': {
        '$elemMatch': {
          '$elemMatch': {
            'sid': sid,
          }
        }
      }
    };
  }

}
