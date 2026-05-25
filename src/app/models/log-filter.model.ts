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

export enum ActionType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE = 'PASSWORD_RESET_COMPLETE',
  FILE_UPLOAD = 'FILE_UPLOAD',
  FILE_DOWNLOAD = 'FILE_DOWNLOAD',
  FILE_DELETE = 'FILE_DELETE',
  EXPORT_REPORT = 'EXPORT_REPORT',
  IMPORT_CSV = 'IMPORT_CSV',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_CHECK_FAILED = 'PERMISSION_CHECK_FAILED',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  SESSION_EXPIRED = 'SESSION_EXPIRED'
}

export interface AuditLogFilter {
  userEmail?: string;
  action?: AuditAction;
  entityName?: string;
  entityId?: number;
  startDate?: string;
  endDate?: string;
}

export interface ActionLogFilter {
  userEmail?: string;
  actionType?: ActionType;
  success?: boolean;
  startDate?: string;
  endDate?: string;
}

