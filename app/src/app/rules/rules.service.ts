import { Injectable } from '@angular/core';
import { StoredItem } from '../stored-item';
import { SimpleStoreHandler } from '../store-handler';
import { Rule, RawRule } from './rule';
import { DataRequester } from '../data-requester';
import { BatchItemLoader, ItemsService } from '../items/items.service';
import { ItemStackUtils } from '../convertion-utils';

@Injectable({
  providedIn: 'root'
})
export class RulesService extends SimpleStoreHandler<Rule, RawRule> {

  constructor(
    private dataRequester: DataRequester,
    private itemsService: ItemsService) {
    super(dataRequester, 'auto-expands');
  }

  protected convertOne(json: RawRule): Promise<Rule> {
    const loader = this.itemsService.getBatchLoader();
    const recipe = this.convertRule(json, loader);
    return loader.process().then(() => recipe);
  }
  protected convertMultiple(jsons: RawRule[]): Promise<Rule[]> {
    const loader = this.itemsService.getBatchLoader();
    const recipes = jsons.map(rawRecipe => this.convertRule(rawRecipe, loader));
    return loader.process().then(() => recipes);
  }

  convertRule(rawRule: RawRule, loader: BatchItemLoader): Rule {
    const rule = new Rule();

    rule._id = rawRule._id;

    rule.ingredients = ItemStackUtils.toItemStacks(rawRule.ingredients, loader);
    rule.result = ItemStackUtils.toItemStacks(rawRule.result, loader);

    return rule;
  }

  protected toRaw(rule: Rule): RawRule {
    const rawRule = new RawRule();

    rawRule._id = rule._id;

    rawRule.ingredients = ItemStackUtils.toRawStacks(rule.ingredients);
    rawRule.result = ItemStackUtils.toRawStacks(rule.result);

    return rawRule;
  }

  public getRuleByItemSid(sid: string): Promise<Rule> {
    return this.findOne({
      'result': {
        '$elemMatch': {
          'sid': sid,
        }
      }
    });
  }

  public getRulesRecursive(sid: string): Promise<Rule[]> {
    return new Promise((resolve, reject) => {

      this.getRuleByItemSid(sid).then(rule => {
        const rules: Rule[] = [];
        rules.push(rule);

        const innerPromises = rule.ingredients.map(stack => {
          return this.getRulesRecursive(stack.item.sid).then(innerRules => {
            rules.push(...innerRules);
          });
        });

        Promise.all(innerPromises).then(() => {
          resolve(rules);
        });

      }, () => {
        resolve([]);
      });

    });
  }
}
