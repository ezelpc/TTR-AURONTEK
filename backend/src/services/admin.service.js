import supabase from '../utils/supabaseClient';
import { comparePassword } from '../utils/hash';
import jwt from 'jsonwebtoken';

export async function loginAdminSistema({ correo, contraseña}){
    const { data: admin, error } = await supabase 
    .from('admins_sistema')
    .select('*')
    .eq('correo', correo)
    .maybeSingle();

    if (error || !admin) {
        throw new Error('Administrador no encontrado');
    }

    const valido = await comparePassword(contraseña, admin.contraseña);
    if (!valido) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
        {
        id: admin.id,
        correo: admin.correo,
        nombre: admin.nombre,
        admin: true
        },
        process.env.JWT,
        { expiresIn: '1h' }
    );

    const { contraseña: _, ...safeAdmin } = admin;

    return { ok: true, mensaje: 'Inicio de sesión exitoso', admin: safeAdmin, token};

}

