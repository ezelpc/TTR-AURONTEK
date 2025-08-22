import { hashPassword } from './hash.js';

// Puedes cambiar estos valores para generar el hash de otro admin
const adminPassword = 'admin123';

(async () => {
  try {
    const hash = await hashPassword(adminPassword);
    console.log(`Hash para contraseña "${adminPassword}":\n${hash}`);
  } catch (err) {
    console.error('Error al generar hash:', err.message);
  }
})();
