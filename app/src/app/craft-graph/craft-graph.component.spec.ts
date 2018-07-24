import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftGraphComponent } from './craft-graph.component';

describe('CraftGraphComponent', () => {
  let component: CraftGraphComponent;
  let fixture: ComponentFixture<CraftGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CraftGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraftGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
