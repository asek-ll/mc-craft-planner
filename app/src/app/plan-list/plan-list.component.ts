import { Component, OnInit } from '@angular/core';
import { PlansService } from '../plan/plans.service';
import { Plan } from '../plan/plan';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {

  public plans: Plan[];
  public query = {};

  constructor(
    public planService: PlansService
  ) { }

  ngOnInit() {
    this.planService.find({}).then(plans => {
      this.plans = plans;
    });
  }

}
