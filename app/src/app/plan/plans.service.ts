import { Injectable } from '@angular/core';
import { StoreHandler, SimpleStoreHandler } from '../store-handler';
import { Plan, RawPlan, RawCraftingStep, RawPlanRecipe, CraftingStep, PlanRecipe } from './plan';
import { DataRequester } from '../data-requester';
import { ItemStack } from '../recipes/recipe';
import { RecipesService } from '../recipes/recipes.service';
import { BatchItemLoader, ItemsService } from '../items/items.service';
import { ItemStackUtils } from '../convertion-utils';

@Injectable()
export class PlansService extends SimpleStoreHandler<Plan, RawPlan> {

  constructor(
    private dataRequester: DataRequester,
    private itemsService: ItemsService
  ) {
    super(dataRequester, 'plans');
  }

  protected convertOne(json: RawPlan): Promise<Plan> {
    const loader = this.itemsService.getBatchLoader();
    const recipe = this.convertPlan(json, loader);
    return loader.process().then(() => recipe);
  }

  convertPlan(rawPlan: RawPlan, loader: BatchItemLoader): Plan {
    const plan =  new Plan();

    plan._id = rawPlan._id;
    plan.title = rawPlan.title;

    plan.inventory = ItemStackUtils.toItemStacks(rawPlan.inventory, loader);
    plan.goals = ItemStackUtils.toItemStacks(rawPlan.goals, loader);
    plan.craftingSteps = rawPlan.craftingSteps.map(step => this.convertCraftingSteps(step, loader));

    return plan;
  }

  convertCraftingSteps(rawSteps: RawCraftingStep, loader: BatchItemLoader): CraftingStep {
    const step = new CraftingStep();

    step.count = rawSteps.count;
    step.recipe = new PlanRecipe();
    step.recipe.ingredients = ItemStackUtils.toItemStacks(rawSteps.recipe.ingredients, loader);
    step.recipe.result = ItemStackUtils.toItemStacks(rawSteps.recipe.result, loader);

    return step;
  }

  protected convertMultiple(rawPlans: RawPlan[]): Promise<Plan[]> {
    const loader = this.itemsService.getBatchLoader();
    const recipes = rawPlans.map(rawRecipe => this.convertPlan(rawRecipe, loader));
    return loader.process().then(() => recipes);
  }

  protected toRaw(plan: Plan): RawPlan {
    const rawPlan = new RawPlan();

    rawPlan._id = plan._id;
    rawPlan.title = plan.title;
    rawPlan.inventory = ItemStackUtils.toRawStacks(plan.inventory);
    rawPlan.goals = ItemStackUtils.toRawStacks(plan.goals);

    rawPlan.craftingSteps = plan.craftingSteps.map(step => {
      const rawStep = new RawCraftingStep();

      rawStep.count = step.count;
      rawStep.recipe = new RawPlanRecipe();

      rawStep.recipe.ingredients = ItemStackUtils.toRawStacks(step.recipe.ingredients);
      rawStep.recipe.result = ItemStackUtils.toRawStacks(step.recipe.result);

      return rawStep;
    });

    return rawPlan;
  }

}
