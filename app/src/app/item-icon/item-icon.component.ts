import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../items/item';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.css']
})
export class ItemIconComponent implements OnInit {

  @Input() item: Item;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  public getDataSrc() {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png; base64,' + this.item.icon);
  }
}
