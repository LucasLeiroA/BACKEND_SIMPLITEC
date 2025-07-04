const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { cloudinary } = require('../config/cloudinary');

const getAllByDealer = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id);

        const vehicles = await prisma.vehicle.findMany({
            where: { dealerId },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        res.json(vehicles);
    } catch (error) {
        console.error('Error al obtener vehículos por dealer:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getById = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id);
        const vehicleId = parseInt(req.params.vehicleId);

        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, dealerId },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!vehicle) return res.status(404).json({ error: 'Vehículo no encontrado' });

        res.json(vehicle);
    } catch (error) {
        console.error('Error al obtener vehículo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createVehicle = async (req, res) => {
    try {
        const {
            dealerId,
            brand,
            model,
            year,
            price,
            fuelType,
            transmission,
            doors,
            bodyType,
            stock
        } = req.body;

        const files = req.files || [];
        const imagesUploaded = [];

        for (let i = 0; i < files.length; i++) {
            const result = await cloudinary.uploader.upload(files[i].path, {
                folder: 'vehicles',
            });

            imagesUploaded.push({
                url: result.secure_url,
                publicId: result.public_id,
                order: i + 1,
            });
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                dealerId: Number(dealerId),
                brand,
                model,
                year: Number(year),
                price: Number(price),
                fuelType,
                transmission,
                doors: Number(doors),
                bodyType,
                stock: Number(stock),
                images: {
                    create: imagesUploaded,
                },
            },
            include: {
                images: true,
            },
        });

        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Error al crear vehículo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id)
        const vehicleId = parseInt(req.params.vehicleId)
        const files = req.files || []

        console.log({ dealerId })
        console.log({ vehicleId })

        // Verificamos si existe el vehículo con ese ID y dealer
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, dealerId }
        })

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado' })
        }

        // Eliminar imágenes anteriores si hay nuevas
        const oldImages = await prisma.vehicleImage.findMany({ where: { vehicleId } })

        for (const image of oldImages) {
            if (image.publicId) {
                await cloudinary.uploader.destroy(image.publicId)
            }
        }

        await prisma.vehicleImage.deleteMany({ where: { vehicleId } })

        // Subir nuevas imágenes
        const uploadedImages = []

        for (let i = 0; i < files.length; i++) {
            const result = await cloudinary.uploader.upload(files[i].path, {
                folder: 'vehicles',
            })

            uploadedImages.push({
                vehicleId,
                url: result.secure_url,
                publicId: result.public_id,
                order: req.body.orders?.[i] ? Number(req.body.orders[i]) : i + 1
            })
        }

        if (uploadedImages.length > 0) {
            await prisma.vehicleImage.createMany({ data: uploadedImages })
        }

        // Actualizar vehículo (conversión explícita de tipos numéricos)
        const updatedVehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: {
                brand: req.body.brand,
                model: req.body.model,
                fuelType: req.body.fuelType,
                transmission: req.body.transmission,
                bodyType: req.body.bodyType,
                dealerId: dealerId, // ✅ ya es número
                year: req.body.year ? Number(req.body.year) : undefined,
                price: req.body.price ? Number(req.body.price) : undefined,
                doors: req.body.doors ? Number(req.body.doors) : undefined,
                stock: req.body.stock ? Number(req.body.stock) : undefined,
            },
            include: {
                images: true
            }
        })

        res.json(updatedVehicle)
    } catch (error) {
        console.error('Error al actualizar vehículo:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}


const deleteVehicle = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id);
        const vehicleId = parseInt(req.params.vehicleId);



        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, dealerId },
        });

        if (!vehicle) return res.status(404).json({ error: 'Vehículo no encontrado' });

        const images = await prisma.vehicleImage.findMany({
            where: { vehicleId },
        });

        for (const image of images) {
            if (image.publicId) {
                try {
                    await cloudinary.uploader.destroy(image.publicId);
                } catch (err) {
                    console.warn(`No se pudo eliminar imagen de Cloudinary: ${image.publicId}`);
                }
            }
        }

        await prisma.vehicleImage.deleteMany({ where: { vehicleId } });

        await prisma.vehicle.delete({ where: { id: vehicleId } });

        res.json({ message: 'Vehículo e imágenes eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const filterVehiclesByDealer = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId)
        const {
            fuelType,
            transmission,
            bodyType,
            doors,
            yearMin,
            yearMax,
            priceMin,
            priceMax,
        } = req.query


        console.log(req.query);
        

        const filters = {
            dealerId,
        }

        if (fuelType) {
            filters.fuelType = { in: Array.isArray(fuelType) ? fuelType : [fuelType] }
        }

        if (transmission) {
            filters.transmission = { in: Array.isArray(transmission) ? transmission : [transmission] }
        }

        if (bodyType) {
            filters.bodyType = { in: Array.isArray(bodyType) ? bodyType : [bodyType] }
        }

        if (doors) {
            filters.doors = Number(doors)
        }

        if (yearMin || yearMax) {
            filters.year = {
                ...(yearMin && { gte: Number(yearMin) }),
                ...(yearMax && { lte: Number(yearMax) }),
            }
        }

        if (priceMin || priceMax) {
            filters.price = {
                ...(priceMin && { gte: Number(priceMin) }),
                ...(priceMax && { lte: Number(priceMax) }),
            }
        }

        const vehicles = await prisma.vehicle.findMany({
            where: filters,
            include: {
                images: { orderBy: { order: 'asc' } },
            },
        })
        

        res.json(vehicles)
    } catch (error) {
        console.error('Error al filtrar vehículos:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}





module.exports = {
    getAllByDealer,
    getById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    filterVehiclesByDealer
};
