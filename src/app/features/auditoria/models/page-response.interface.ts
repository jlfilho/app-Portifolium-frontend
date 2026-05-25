import { AuditLog } from './audit-log.interface';
import { ActionLog } from './action-log.interface';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // página atual (0-indexed)
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface AuditLogPage extends PageResponse<AuditLog> {}
export interface ActionLogPage extends PageResponse<ActionLog> {}

