/**
 * Helper para trabalhar com JWT (JSON Web Token)
 */

export interface JwtPayload {
  sub: string;           // Subject (username)
  exp: number;           // Expiration time (timestamp)
  iat: number;           // Issued at (timestamp)
  authorities?: string[]; // Roles/authorities
  [key: string]: any;    // Outros campos
}

/**
 * Decodifica um JWT token
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT inválido (não tem 3 partes)');
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as JwtPayload;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Verifica se o token está expirado
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return true; // Sem expiração = considerar expirado
  }

  const currentTime = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
  const isExpired = decoded.exp < currentTime;

  if (isExpired) {
    console.warn('⚠️ Token expirado!');
    console.log('Expirou em:', new Date(decoded.exp * 1000));
    console.log('Hora atual:', new Date());
  }

  return isExpired;
}

/**
 * Obtém o tempo restante até expiração (em segundos)
 */
export function getTokenExpirationTime(token: string): number {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = decoded.exp - currentTime;

  return timeLeft > 0 ? timeLeft : 0;
}

/**
 * Obtém informações do usuário do token
 */
export function getTokenInfo(token: string): { username: string; authorities: string[]; expiresIn: number } | null {
  const decoded = decodeToken(token);

  if (!decoded) {
    return null;
  }

  return {
    username: decoded.sub || '',
    authorities: decoded.authorities || [],
    expiresIn: getTokenExpirationTime(token)
  };
}

