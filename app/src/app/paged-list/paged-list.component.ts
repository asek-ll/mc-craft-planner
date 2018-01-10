import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

interface ItemService<T> {
  count(query: object): Promise<number>;
  find(query: object, limit?: number, skip?: number): Promise<T[]>;
}

@Component({
  selector: 'app-paged-list',
  templateUrl: './paged-list.component.html',
  styleUrls: ['./paged-list.component.css']
})
export class PagedListComponent implements OnInit {

  @Input() itemsService: ItemService<object>;
  @Input() query: object;
  @Input() paramName = 'page';
  private baseUrl: string;

  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

  items: object[] = [];
  pageSize = 10;
  pageIndex = 0;
  itemsLength = 100;
  pageSizeOptions = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.baseUrl = this.route.snapshot.url.map(segment => {
        return segment.path;
      }).join('/');

      this.pageIndex = parseInt(params[this.paramName], 10) || 0;

      this.itemsService.count(this.query).then((count) => {
        this.itemsLength = count;
        this.loadItemPage(this.pageIndex);
      });
    });
  }

  loadItemPage(pageIndex: number) {
    const skip = pageIndex * this.pageSize;
    this.itemsService.find(this.query, this.pageSize, skip).then((items) => {
      this.items = items;
      this.pageIndex = pageIndex;
    });
  }

  onPaginatorEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.router.navigate([this.baseUrl, {
      [this.paramName]: event.pageIndex
    }]);
  }

}
