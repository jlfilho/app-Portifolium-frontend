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

export interface ActionLog {
  id: number;
  actionType: ActionType;
  userEmail: string;
  timestamp: string; // ISO 8601
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  endpoint: string | null;
  success: boolean;
  errorMessage: string | null;
  metadata: string | null; // JSON string
}

export interface ActionLogFilters {
  userEmail?: string;
  actionType?: ActionType;
  success?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  size?: number;
  sort?: string; // "timestamp,DESC"
}

