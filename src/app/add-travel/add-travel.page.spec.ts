import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTravelPage } from './add-travel.page';

describe('AddTravelPage', () => {
  let component: AddTravelPage;
  let fixture: ComponentFixture<AddTravelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTravelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
