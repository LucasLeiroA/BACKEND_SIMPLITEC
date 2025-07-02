const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendLeadEmail } = require('../utils/mailer');


const getLeadsByDealer = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);

        const leads = await prisma.lead.findMany({
            where: { dealerId },
            include: {
                post: true
            }
        });

        res.json(leads);
    } catch (error) {
        console.error('Error al obtener leads:', error);
        res.status(500).json({ error: 'Error al obtener leads' });
    }
};

const createLead = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId);
        const { name, lastname, email, phone, postId } = req.body;

        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            include: { dealer: true }
        });

        if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });

        let leadData = {
            dealerId,
            postId: post.id,
            name,
            lastname,
            email,
            phone
        };

        if (req.user && req.user.role === 'client') {
            const user = await prisma.user.findUnique({ where: { id: req.user.id } });

            leadData = {
                ...leadData,
                name: user.name || name,
                lastname: user.lastname || lastname,
                email: user.email,
            };
        }

        if (post.dealer?.email) {
            const subject = `Nuevo lead para tu publicación: ${post.title}`;
            const html = `
                <h3>Nuevo contacto interesado</h3>
                <p><strong>Nombre:</strong> ${name} ${lastname}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone}</p>
                <p><strong>Publicación:</strong> ${post.title}</p>
            `;

            await sendLeadEmail(post.dealer.email, subject, html);
        }


        const lead = await prisma.lead.create({ data: leadData });

        res.status(201).json(lead);
    } catch (error) {
        console.error('Error al crear lead:', error);
        res.status(500).json({ error: 'Error al crear lead' });
    }
};



module.exports = {
    getLeadsByDealer,
    createLead
};
