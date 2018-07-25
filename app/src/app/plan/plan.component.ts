import { Component, OnInit, SimpleChanges, OnChanges, Output, Input, ViewChild } from '@angular/core';
import { Plan, PlanRecipe, CraftingStep } from './plan';
import { ItemStack, Recipe } from '../recipes/recipe';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { Item } from '../items/item';
import { RecipeDialogComponent, RecipeDialogConfig } from '../recipe-dialog/recipe-dialog.component';
import { MatDialog, MAT_SORT_HEADER_INTL_PROVIDER_FACTORY } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansService } from './plans.service';
import { crashReporter } from 'electron';
import { RulesService } from '../rules/rules.service';
import { CraftGraphComponent } from '../craft-graph/craft-graph.component';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  @ViewChild(CraftGraphComponent)
  private graphComponent: CraftGraphComponent;

  public plan: Plan;
  public requiredItems: ItemStack[] = [];
  public results: ItemStack[] = [];
  public isGraphVisible = false;

  constructor(
    public dialog: MatDialog,
    protected route: ActivatedRoute,
    private planService: PlansService,
    private ruleService: RulesService,
    private router: Router
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

    if (this.graphComponent && this.isGraphVisible) {
      this.graphComponent.updateGraph();
    }
  }

  public removeStep(step: CraftingStep) {
    const index = this.plan.craftingSteps.indexOf(step);
    this.plan.craftingSteps.splice(index, 1);
    this.recalcPlan();
  }

  private showDialog(item: Item, allowAutoExpand: boolean): Promise<PlanRecipe> {
    const config: RecipeDialogConfig = {
      item,
      allowAutoExpand
    };
    return new Promise((resolve) => {
      this.dialog.open(RecipeDialogComponent, {
        height: '600px',
        width: '800px',
        data: config,
      }).afterClosed().subscribe(result => {
        if (result) {
          resolve(result as PlanRecipe);
        }
      });
    });
  }

  public expandStack(ingredient: ItemStack) {
    this.showDialog(ingredient.item, false).then(result => {
      this.addStep(ingredient, result);
    });
  }

  private addStep(ingredient: ItemStack, recipe: PlanRecipe) {
    const step = new CraftingStep();
    step.recipe = recipe;
    step.count = 1;

    step.recipe.result.forEach(res => {
      if (res.item.sid === ingredient.item.sid) {
        step.count = Math.ceil(ingredient.size / res.size);
      }
    });

    const recipeString = recipe.toString();
    const containsRecipe = this.plan.craftingSteps.some(cstep => {
      return recipeString === cstep.recipe.toString();
    });

    if (containsRecipe) {
      return;
    }

    this.plan.craftingSteps.push(step);

    const stepsWithInputs: Map<string, number[]> = new Map();

    this.plan.craftingSteps.forEach((cstep, stepIndex) => {
      cstep.recipe.ingredients.forEach(stack => {
        const steps = stepsWithInputs.get(stack.item.sid) || [];
        steps.push(stepIndex);
        stepsWithInputs.set(stack.item.sid, steps);
      });
    });

    const parentsMap: Map<number, number[]> = new Map();
    const stepsToComplete: number[] = [];
    this.plan.craftingSteps.forEach((cstep, stepIndex) => {
      const allParents: number[] = [];
      cstep.recipe.result.forEach(stack => {
        const itemParents = stepsWithInputs.get(stack.item.sid) || [];
        allParents.push(...itemParents.filter(parentIndex => parentIndex !== stepIndex));
      });
      parentsMap.set(stepIndex, allParents);
      stepsToComplete.push(stepIndex);
    });

    const sortedSteps: CraftingStep[] = [];
    while (stepsToComplete.length > 0) {
      for (let i = 0; i < stepsToComplete.length; i++) {
        const stepIndex = stepsToComplete[i];
        const parents = parentsMap.get(stepIndex);
        const isResolved = parents.every(parentStepId => {
          return stepsToComplete.indexOf(parentStepId) < 0;
        });
        if (isResolved) {
          sortedSteps.push(this.plan.craftingSteps[stepIndex]);
          stepsToComplete.splice(i, 1);
          break;
        }
      }
    }

    this.plan.craftingSteps = sortedSteps;

    this.recalcPlan();
  }

  public autoExpandStack(stack: ItemStack) {
    this.ruleService.getRulesRecursive(stack.item.sid).then(rules => {
      if (rules.length > 0) {
        rules.forEach(rule => {
          const planRecipe = new PlanRecipe();

          planRecipe.ingredients = rule.ingredients;
          planRecipe.result = rule.result;

          this.addStep(planRecipe.result[0], planRecipe);
        });
      } else {
        this.showDialog(stack.item, true).then(result => {
          this.autoExpandStack(stack);
        });
      }
    });
  }

  public savePlan(plan: Plan) {
    if (plan._id) {
      return this.planService.updateItem(plan);
    }
    this.planService.insertItem(plan).then(savedPlan => {
      this.router.navigate(['/plan/' + savedPlan._id]);
    });
  }

  public toggleGraph() {
    this.isGraphVisible = !this.isGraphVisible;
    if (this.isGraphVisible && this.graphComponent) {
      this.graphComponent.updateGraph();
    }
  }
}
