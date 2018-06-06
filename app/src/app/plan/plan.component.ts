import { Component, OnInit, SimpleChanges, OnChanges, Output, Input } from '@angular/core';
import { Plan, PlanRecipe, CraftingStep } from './plan';
import { ItemStack, Recipe } from '../recipes/recipe';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { Item } from '../items/item';
import { RecipeDialogComponent } from '../recipe-dialog/recipe-dialog.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { PlansService } from './plans.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  public plan: Plan;
  public requiredItems: ItemStack[] = [];
  public results: ItemStack[] = [];

  constructor(
    public dialog: MatDialog,
    protected route: ActivatedRoute,
    private planService: PlansService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.planService.findOne({
          _id: params.id
        }).then(plan => {
          this.plan = plan;
          this.recalcPlan();
        });
      } else {
        this.plan = new Plan();
        this.plan.title = 'Custom plan';
        this.plan.goals = [];
        this.plan.inventory = [];
        this.plan.craftingSteps = [];
      }
    });
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

      let count = 0;

      if (step.recipe.result.length > 0) {
        const stack = step.recipe.result[0];
        const requiredCount = itemsCount.get(stack.item.sid) || 0;

        if (requiredCount < 0) {
          count = Math.ceil(-requiredCount / stack.size);
        }
      }

      step.count = count;

      step.recipe.ingredients.forEach(ingredient => {
        addItems(ingredient, - count);
      });

      step.recipe.result.forEach(ingredient => {
        addItems(ingredient, count);
      });
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

  public removeStep(step: CraftingStep) {
    const index = this.plan.craftingSteps.indexOf(step);
    this.plan.craftingSteps.splice(index, 1);
    this.recalcPlan();
  }

  public expandStack(ingredient: ItemStack) {
    this.dialog.open(RecipeDialogComponent, {
      height: '600px',
      width: '800px',
      data: ingredient.item
    }).afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      const step = new CraftingStep();
      step.recipe = result as PlanRecipe;
      step.count = 1;

      step.recipe.result.forEach(res => {
        if (res.item.sid === ingredient.item.sid) {
          step.count = Math.ceil(ingredient.size / res.size);
        }
      });


      this.plan.craftingSteps.push(step);
      this.recalcPlan();
    });
  }

  private updateOrCreatePlan(plan: Plan): Promise<Plan> {
    if (plan._id) {
      return this.planService.updateItem(plan);
    }
    return this.planService.insertItem(plan);
  }

  public savePlan(plan: Plan) {
    this.updateOrCreatePlan(plan);
  }
}
