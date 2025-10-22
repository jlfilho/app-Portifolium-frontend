import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvidenciasService } from './services/evidencias.service';

@NgModule({
  imports: [CommonModule],
  providers: [EvidenciasService]
})
export class EvidenciasModule {}

