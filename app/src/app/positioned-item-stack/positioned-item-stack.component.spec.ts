import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionedItemStackComponent } from './positioned-item-stack.component';

describe('PositionedItemStackComponent', () => {
  let component: PositionedItemStackComponent;
  let fixture: ComponentFixture<PositionedItemStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionedItemStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionedItemStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
