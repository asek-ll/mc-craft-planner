import { Component, OnInit } from '@angular/core';
import { PlansService } from '../plan/plans.service';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {

  constructor(
    private planService: PlansService
  ) { }

  ngOnInit() {
  }

}
