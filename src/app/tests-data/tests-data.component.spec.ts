import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsDataComponent } from './tests-data.component';

describe('TestsDataComponent', () => {
  let component: TestsDataComponent;
  let fixture: ComponentFixture<TestsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
