import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontesFinanciadorasService } from './services/fontes-financiadoras.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    FontesFinanciadorasService
  ]
})
export class FontesFinanciadorasModule { }

