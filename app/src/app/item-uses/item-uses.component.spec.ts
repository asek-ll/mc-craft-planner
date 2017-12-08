import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUsesComponent } from './item-uses.component';

describe('ItemUsesComponent', () => {
  let component: ItemUsesComponent;
  let fixture: ComponentFixture<ItemUsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemUsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
