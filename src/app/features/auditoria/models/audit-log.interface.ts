export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  UPLOAD_FILE = 'UPLOAD_FILE',
  DOWNLOAD_FILE = 'DOWNLOAD_FILE',
  ACCESS_DENIED = 'ACCESS_DENIED'
}

export interface AuditLog {
  id: number;
  entityName: string; // "Curso", "Atividade", "Usuario", etc.
  entityId: number;
  action: AuditAction;
  userEmail: string;
  timestamp: string; // ISO 8601
  oldValues: string | null; // JSON string
  newValues: string | null; // JSON string
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  endpoint: string | null;
  httpMethod: string | null;
}

export interface AuditLogFilters {
  entityName?: string;
  entityId?: number;
  userEmail?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  size?: number;
  sort?: string; // "timestamp,DESC"
}

