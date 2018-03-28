import { Component, OnInit, SimpleChanges, OnChanges, Output, Input } from '@angular/core';
import { Plan, PlanRecipe, CraftingStep } from './plan';
import { ItemStack, Recipe } from '../recipes/recipe';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { Item } from '../items/item';
import { RecipeDealogComponent } from '../recipe-dealog/recipe-dealog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  public plan: Plan;
  public requiredItems: ItemStack[] = [];
  public results: ItemStack[] = [];

  constructor(public dialog: MatDialog) {
    this.plan = new Plan();
    this.plan.goals = [];
    this.plan.inventory = [];
    this.plan.craftingSteps = [];
  }

  ngOnInit() {
  }

  public recalcPlan(): void {
    const itemsCount: Map<string, number> = new Map();
    const itemsBySid: { [sid: string]: Item } = {};

    const addItems = function (itemStack: ItemStack, count: number) {
      const sid = itemStack.item.sid;
      itemsCount.set(sid, (itemsCount.get(sid) || 0) + count * itemStack.size);
      itemsBySid[sid] = itemStack.item;
    };

    this.plan.goals.forEach(itemStack => {
      addItems(itemStack, -1);
    });

    this.plan.inventory.forEach(itemStack => {
      addItems(itemStack, 1);
    });

    this.plan.craftingSteps.forEach(step => {
      step.recipe.ingredients.forEach(ingredient => {
        addItems(ingredient, - step.count);
      });

      const result = step.recipe.result;
      addItems(result, step.count);
    });

    const required: ItemStack[] = [];
    const results: ItemStack[] = [];

    itemsCount.forEach((value, key) => {
      if (value > 0) {
        results.push(new ItemStack(itemsBySid[key], value));
      }
      if (value < 0) {
        required.push(new ItemStack(itemsBySid[key], -value));
      }
    });

    this.requiredItems = required;
    this.results = results;
  }

  public expandStack(ingredient: ItemStack) {
    this.dialog.open(RecipeDealogComponent, {
      height: '600px',
      width: '800px',
      data: ingredient.item
    }).afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      const step = new CraftingStep();
      step.recipe = result as PlanRecipe;
      step.count = Math.ceil(ingredient.size / step.recipe.result.size);
      this.plan.craftingSteps.push(step);
      this.recalcPlan();
    });
  }

}
