const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllAccessories = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);

        const accessories = await prisma.accessory.findMany({
            where: { dealerId },
            include: {
                vehicle: true 
            }
        });

        res.json(accessories);
    } catch (error) {
        console.error('Error al obtener accesorios:', error);
        res.status(500).json({ error: 'Error al obtener accesorios' });
    }
};

const getAccessoryById = async (req, res) => {
    try {
        const id = parseInt(req.params.accessoryId);

        const accessory = await prisma.accessory.findUnique({
            where: { id },
            include: { vehicle: true }
        });

        if (!accessory) {
            return res.status(404).json({ error: 'Accesorio no encontrado' });
        }

        res.json(accessory);
    } catch (error) {
        console.error('Error al obtener accesorio:', error);
        res.status(500).json({ error: 'Error al obtener accesorio' });
    }
};

const createAccessory = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);
        const { name, description, price, stock, vehicleId } = req.body;

        const accessory = await prisma.accessory.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                dealerId,
                vehicleId: parseInt(vehicleId)
            }
        });

        res.status(201).json(accessory);
    } catch (error) {
        console.error('Error al crear accesorio:', error);
        res.status(500).json({ error: 'Error al crear accesorio' });
    }
};

const updateAccessory = async (req, res) => {
    try {
        const id = parseInt(req.params.accessoryId);
        const { name, description, price, stock, vehicleId } = req.body;

        const exists = await prisma.accessory.findUnique({ where: { id } });
        if (!exists) return res.status(404).json({ error: 'Accesorio no encontrado' });

        const updated = await prisma.accessory.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                vehicleId: parseInt(vehicleId)
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error al actualizar accesorio:', error);
        res.status(500).json({ error: 'Error al actualizar accesorio' });
    }
};

const deleteAccessory = async (req, res) => {
    try {
        const id = parseInt(req.params.accessoryId);

        const exists = await prisma.accessory.findUnique({ where: { id } });
        if (!exists) return res.status(404).json({ error: 'Accesorio no encontrado' });

        await prisma.accessory.delete({ where: { id } });

        res.json({ message: 'Accesorio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar accesorio:', error);
        res.status(500).json({ error: 'Error al eliminar accesorio' });
    }
};

module.exports = {
    getAllAccessories,
    getAccessoryById,
    createAccessory,
    updateAccessory,
    deleteAccessory
};
