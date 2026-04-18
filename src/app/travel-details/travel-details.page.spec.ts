import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelDetailsPage } from './travel-details.page';

describe('TravelDetailsPage', () => {
  let component: TravelDetailsPage;
  let fixture: ComponentFixture<TravelDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
