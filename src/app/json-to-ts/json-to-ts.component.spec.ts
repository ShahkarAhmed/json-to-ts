import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonToTsComponent } from './json-to-ts.component';

describe('JsonToTsComponent', () => {
  let component: JsonToTsComponent;
  let fixture: ComponentFixture<JsonToTsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonToTsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonToTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
