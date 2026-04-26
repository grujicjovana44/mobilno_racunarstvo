import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendDetailsPage } from './friend-details.page';

describe('FriendDetailsPage', () => {
  let component: FriendDetailsPage;
  let fixture: ComponentFixture<FriendDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
