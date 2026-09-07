import jwt from 'jsonwebtoken';

/**
 * Genera un token JWT con los datos del usuario.
 * @param {object} payload - Datos a incluir en el token.
 * @returns {string} - Token JWT generado.
 * @throws {Error} cuando JWT_SECRET no está configurado.
 */
export const generarJWT = (payload: any) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET must be configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '8h',
  });
};
