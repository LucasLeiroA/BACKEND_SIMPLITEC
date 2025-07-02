const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllDealers = async (req, res) => {
    try {
        const dealers = await prisma.dealer.findMany();
        res.json(dealers);
    } catch (error) {
        console.error('Error al obtener concesionarios:', error);
        res.status(500).json({ error: 'Error al obtener concesionarios' });
    }
};

const getDealerById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const dealer = await prisma.dealer.findUnique({
            where: { id }
        });
        if (!dealer) return res.status(404).json({ error: 'Concesionario no encontrado' });
        res.json(dealer);
    } catch (error) {
        console.error('Error al obtener concesionario:', error);
        res.status(500).json({ error: 'Error al obtener concesionario' });
    }
};

const createDealer = async (req, res) => {
    try {
        const dealer = await prisma.dealer.create({
            data: req.body
        });
        res.status(201).json(dealer);
    } catch (error) {
        console.error('Error al crear concesionario:', error);
        res.status(500).json({ error: 'Error al crear concesionario' });
    }
};

const updateDealer = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const dealerExists = await prisma.dealer.findUnique({ where: { id } });
        if (!dealerExists) return res.status(404).json({ error: 'Concesionario no encontrado' });

        const updated = await prisma.dealer.update({
            where: { id },
            data: req.body
        });

        res.json(updated);
    } catch (error) {
        console.error('Error al actualizar concesionario:', error);
        res.status(500).json({ error: 'Error al actualizar concesionario' });
    }
};

const deleteDealer = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const dealerExists = await prisma.dealer.findUnique({ where: { id } });
        if (!dealerExists) return res.status(404).json({ error: 'Concesionario no encontrado' });

        await prisma.dealer.delete({ where: { id } });

        res.json({ message: 'Concesionario eliminado' });
    } catch (error) {
        console.error('Error al eliminar concesionario:', error);
        res.status(500).json({ error: 'Error al eliminar concesionario' });
    }
};

module.exports = {
    getAllDealers,
    getDealerById,
    createDealer,
    updateDealer,
    deleteDealer
};
