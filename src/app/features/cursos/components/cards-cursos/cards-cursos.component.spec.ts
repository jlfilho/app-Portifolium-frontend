import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCursosComponent } from './cards-cursos.component';

describe('FormCursosComponent', () => {
  let component: FormCursosComponent;
  let fixture: ComponentFixture<FormCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
