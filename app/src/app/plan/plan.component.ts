import { Component, OnInit } from '@angular/core';
import { Plan } from './plan';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  public plan: Plan;

  constructor() {
    this.plan = new Plan();
    this.plan.goals = [];
    this.plan.inventory = [];
    this.plan.craftingSteps = [];
  }

  ngOnInit() {
  }

}
