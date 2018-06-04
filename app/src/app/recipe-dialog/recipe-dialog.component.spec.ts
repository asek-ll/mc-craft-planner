import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDealogComponent } from './recipe-dialog.component';

describe('RecipeDealogComponent', () => {
  let component: RecipeDealogComponent;
  let fixture: ComponentFixture<RecipeDealogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeDealogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDealogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
