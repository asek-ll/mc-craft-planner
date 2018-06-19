import { Component, OnInit, ViewChild } from '@angular/core';
import { PlansService } from '../plan/plans.service';
import { Plan } from '../plan/plan';
import { PagedListComponent } from '../paged-list/paged-list.component';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {

  public query = {};
  @ViewChild(PagedListComponent) pagedList: PagedListComponent;

  constructor(
    public planService: PlansService
  ) { }

  ngOnInit() {
  }

  public removePlan(plan: Plan) {
    this.planService.deleteItem(plan).then(() => {
      this.pagedList.loadItemPage(this.pagedList.pageIndex);
    });
  }

}
