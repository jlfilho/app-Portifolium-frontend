import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissaoUsuarioComponent } from './permissao-usuario.component';

describe('PermissaoUsuarioComponent', () => {
  let component: PermissaoUsuarioComponent;
  let fixture: ComponentFixture<PermissaoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissaoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissaoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
