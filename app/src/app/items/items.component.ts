import { Component, OnInit, Input } from '@angular/core';
import { ItemsService } from './items.service';
import { Item } from './item';
import { PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items: Item[] = [];

  itemsLength = 100;
  pageSize = 15;
  pageSizeOptions = [5, 15];
  pageIndex = 0;
  query = '';

  constructor(
    public itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // this.itemsService.count(this.query).then((count) => {
    //   this.itemsLength = count;
    //   this.pageIndex = 0;
    // });

    // this.loadItemPage(0);


    this.route.params.subscribe(params => {

      this.pageIndex = parseInt(params.page, 10) || 0;
      const query = this.getQuery(params.query || '');

      this.itemsService.count(query).then((count) => {
        this.itemsLength = count;
        this.loadItemPage(query, this.pageIndex);
      });

      // console.log(params);
      // this.setItemBySid(params.sid);
    });
  }

  private getQuery(name: string) {
    return {
      displayName: {
        $regex: {
          pattern: name,
          flags: 'i',
        }
      }
    };
  }

  onItemQueryChange(name: string) {
    this.router.navigate(['items', {
      query: name,
      page: 0
    }]);
  }

  loadItemPage(query: object, pageIndex: number) {
    const skip = pageIndex * this.pageSize;
    this.itemsService.find(query, this.pageSize, skip).then((items) => {
      this.items = items;
      this.pageIndex = pageIndex;
    });
  }

  onPaginatorEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.router.navigate(['items', {
      query: this.query,
      page: event.pageIndex
    }]);
  }

}
