import bcrypt from 'bcryptjs';

export async function comparePassword(password, hashed){
    return await bcrypt.compare(password, hashed);
}