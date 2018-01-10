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

  public query: object;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected itemsService: ItemsService,
    public recipeService: RecipesService
  ) { }

  protected setItemBySid(sid: string) {
    this.itemsService.findOne({ sid }).then(item => {
      this.item = item;
    });
  }

  protected getQueryBySid(sid: string): object {
    return {
      'result': {
        '$elemMatch': {
          'sid': sid,
        }
      }
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.setItemBySid(params.sid);
      this.query = this.getQueryBySid(params.sid);
    });
  }

}
