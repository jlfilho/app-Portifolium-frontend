import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuditLogListComponent } from '../../components/audit-log-list/audit-log-list.component';
import { ActionLogListComponent } from '../../components/action-log-list/action-log-list.component';
import { LogExportComponent } from '../../../../components/log-export/log-export.component';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    AuditLogListComponent,
    ActionLogListComponent,
    LogExportComponent
  ],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.css'
})
export class AuditoriaComponent {
  selectedTab = 0;
}

