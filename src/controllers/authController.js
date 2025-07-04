const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { dealer: true }
        })
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                dealerId: user.dealerId || null,
                dealer: user.dealer
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                dealerId: user.dealerId,
                        dealer: user.dealer
            }
        })
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, role, dealerId } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Ya existe un usuario con ese email' });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role,
                dealerId: role === 'dealer' ? parseInt(dealerId) : null
            }
        });

        res.status(201).json({ message: 'Usuario creado', user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                dealerId: true,
                dealer: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { id: 'asc' }
        });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, dealerId } = req.body;

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                email,
                dealerId: dealerId ? parseInt(dealerId) : null,
            }
        });

        res.json({ message: 'Usuario actualizado', user });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const getUsersByDealerId = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId)
        const users = await prisma.user.findMany({
            where: {
                role: 'dealer',
                dealerId
            },
            select: {
                id: true,
                email: true,
                role: true,
                dealerId: true
            }
        })

        res.json(users)
    } catch (error) {
        console.error('Error al obtener usuarios por dealerId:', error)
        res.status(500).json({ error: 'Error al obtener usuarios' })
    }
}



const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};




module.exports = {
    login,
    register,
    getAllUsers,
    updateUser,
    deleteUser,
    getUsersByDealerId
}