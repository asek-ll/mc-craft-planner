import { Component, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Item } from '../items/item';
import { Observable } from 'rxjs/Observable';
import { ItemsService } from '../items/items.service';

@Component({
  selector: 'app-item-picker',
  templateUrl: './item-picker.component.html',
  styleUrls: ['./item-picker.component.css']
})
export class ItemPickerComponent implements OnInit {

  filterControl: FormControl = new FormControl();
  filteredItems: Item[];
  private loadTimerId: number;

  @Output() onAddNewItem: EventEmitter<Item> = new EventEmitter();

  constructor(
    private itemsService: ItemsService,
 ) { }

  ngOnInit() {
    this.filterControl.valueChanges.subscribe( text => this.tryLoad(text) );
  }

  tryLoad(text: string) {
    if (this.loadTimerId) {
      clearTimeout(this.loadTimerId);
    }
    this.loadTimerId = setTimeout( () => this.load(text), 200 as any);
  }

  load(text: string) {
    this.itemsService.find({
      displayName: {
        $regex: {
          pattern: text,
          flags: 'i',
        }
      }
    }, 50).then(items => this.filteredItems = items);
  }

  onItemSelected(item: Item) {
    this.onAddNewItem.emit(item);
  }

}
