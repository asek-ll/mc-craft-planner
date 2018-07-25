import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/item';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe';
import { RulesService } from '../rules/rules.service';
import { Rule } from '../rules/rule';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() item: Item;
  rule: Rule;

  public query: object;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected itemsService: ItemsService,
    public recipeService: RecipesService,
    private rulesService: RulesService
  ) { }

  protected setItemBySid(sid: string) {
    this.itemsService.findOne({ sid }).then(item => {
      this.item = item;
    });
    this.rulesService.getRuleByItemSid(sid).then(rule => {
      this.rule = rule;
    }, () => {
      this.rule = null;
    });
  }

  protected getQueryBySid(sid: string): object {
    return {
      'result': {
        '$elemMatch': {
          '$elemMatch': {
            'sid': sid,
          }
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

  removeRule(rule: Rule) {
    this.rulesService.deleteItem(rule).then(() => {
      this.rule = null;
    });
  }

}
