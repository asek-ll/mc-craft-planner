import { Component, OnInit, ViewChild } from '@angular/core';
import { RulesService } from './rules.service';
import { Rule } from './rule';
import { Router } from '@angular/router';
import { PagedListComponent } from '../paged-list/paged-list.component';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  public query = {};
  @ViewChild(PagedListComponent) pagedList: PagedListComponent;

  constructor(public rulesService: RulesService) { }

  ngOnInit() {
  }

  public removeRule(rule: Rule) {
    this.rulesService.deleteItem(rule).then(() => {
      this.pagedList.loadItemPage(this.pagedList.pageIndex);
    });
  }
}
