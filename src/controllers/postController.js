const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { cloudinary } = require('../config/cloudinary');

// Obtener todas las publicaciones de un dealer
const getAllPosts = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);
        const posts = await prisma.post.findMany({
            where: { dealerId },
            include: {
                vehicles: { include: { vehicle: true } }
            }
        });
        res.json(posts);
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones' });
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        if (isNaN(postId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                vehicles: {
                    include: { vehicle: true }
                }
            }
        });

        if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

        res.json(post);
    } catch (error) {
        console.error('Error al obtener publicación:', error);
        res.status(500).json({ error: 'Error al obtener publicación' });
    }
};

const createPost = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);
        const { title, description, price } = req.body;
        const vehicleIds = JSON.parse(req.body.vehicleIds || '[]');

        const files = req.files || [];
        const imagesUploaded = [];

        for (let i = 0; i < files.length; i++) {
            const result = await cloudinary.uploader.upload(files[i].path, {
                folder: 'posts',
            });

            imagesUploaded.push({
                url: result.secure_url,
                publicId: result.public_id,
            });
        }

        const post = await prisma.post.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                dealerId,
                images: imagesUploaded,
                vehicles: {
                    create: vehicleIds.map(id => ({
                        vehicle: { connect: { id: parseInt(id) } }
                    }))
                }
            },
            include: {
                vehicles: { include: { vehicle: true } }
            }
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Error al crear publicación:', error);
        res.status(500).json({ error: 'Error al crear publicación' });
    }
};



const updatePost = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);
        const postId = parseInt(req.params.postId);
        const files = req.files || [];

        const { title, description, price } = req.body;
        const vehicleIds = JSON.parse(req.body.vehicleIds || '[]');

        const post = await prisma.post.findFirst({
            where: { id: postId, dealerId },
        });

        if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

        const oldImages = post.images || [];
        for (const img of oldImages) {
            if (img.publicId) {
                await cloudinary.uploader.destroy(img.publicId);
            }
        }

        const newImages = [];
        for (let i = 0; i < files.length; i++) {
            const result = await cloudinary.uploader.upload(files[i].path, {
                folder: 'posts',
            });

            newImages.push({
                url: result.secure_url,
                publicId: result.public_id,
            });
        }

        await prisma.postVehicle.deleteMany({ where: { postId } });

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                title,
                description,
                price: parseFloat(price),
                images: newImages,
                vehicles: {
                    create: vehicleIds.map(id => ({
                        vehicle: {
                            connect: { id: parseInt(id) }
                        }
                    }))
                }
            },
            include: {
                vehicles: {
                    include: { vehicle: true }
                }
            }
        });

        res.json(updatedPost);
    } catch (error) {
        console.error('Error al actualizar publicación:', error);
        res.status(500).json({ error: 'Error al actualizar publicación' });
    }
};


const deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

        const images = post.images || [];
        for (const img of images) {
            if (img.publicId) {
                await cloudinary.uploader.destroy(img.publicId);
            }
        }

        await prisma.postVehicle.deleteMany({ where: { postId } });
        await prisma.post.delete({ where: { id: postId } });

        res.json({ message: 'Publicación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar publicación:', error);
        res.status(500).json({ error: 'Error al eliminar publicación' });
    }
};

const searchPosts = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);
        const searchText = req.query.text;

        console.log({dealerId});
        

        const posts = await prisma.post.findMany({
            where: {
                dealerId,
                OR: [
                    { title: { contains: searchText, mode: 'insensitive' } },
                    {
                        vehicles: {
                            some: {
                                vehicle: {
                                    OR: [
                                        { model: { contains: searchText, mode: 'insensitive' } },
                                        { brand: { contains: searchText, mode: 'insensitive' } }
                                    ]
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                vehicles: { include: { vehicle: true } }
            }
        });

        res.json(posts);
    } catch (error) {
        console.error('Error al buscar publicaciones:', error);
        res.status(500).json({ error: 'Error en búsqueda de publicaciones' });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    searchPosts
};
