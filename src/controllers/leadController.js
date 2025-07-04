const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { sendLeadEmail } = require('../utils/mailer')

const getLeadsByDealer = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId)

        const leads = await prisma.lead.findMany({
            where: { dealerId },
            include: {
                post: true,
                vehicle: true
            }
        })

        res.json(leads)
    } catch (error) {
        console.error('Error al obtener leads:', error)
        res.status(500).json({ error: 'Error al obtener leads' })
    }
}

const createLead = async (req, res) => {
    try {
        const dealerId = parseInt(req.params.dealerId)
        const { name, lastname, email, phone, postId, vehicleId } = req.body

        // Validación básica
        if (!phone) {
            return res.status(400).json({ error: 'El teléfono es obligatorio' })
        }

        let leadData = {
            dealerId,
            postId: postId ? parseInt(postId) : null,
            vehicleId: vehicleId ? parseInt(vehicleId) : null,
            name: name || 'Sin nombre',
            lastname: lastname || '',
            email: email || '',
            phone
        }

        // Si está logueado como client, completamos sus datos desde la base
        if (req.user && req.user.role === 'client') {
            const user = await prisma.user.findUnique({ where: { id: req.user.id } })

            leadData = {
                ...leadData,
                name: user.name || name || 'Sin nombre',
                lastname: user.lastname || lastname || '',
                email: user.email || email
            }
        }

        // Enviar email al dealer correspondiente (ya sea del post o del vehículo)
        let dealerEmail = ''
        let subject = ''
        let html = ''

        if (postId) {
            const post = await prisma.post.findUnique({
                where: { id: parseInt(postId) },
                include: { dealer: true }
            })

            if (!post) return res.status(404).json({ error: 'Publicación no encontrada' })

            dealerEmail = post.dealer?.email
            subject = `Nuevo lead para tu publicación: ${post.title}`
            html = `
                <h3>Nuevo contacto interesado</h3>
                <p><strong>Nombre:</strong> ${leadData.name} ${leadData.lastname}</p>
                <p><strong>Email:</strong> ${leadData.email}</p>
                <p><strong>Teléfono:</strong> ${leadData.phone}</p>
                <p><strong>Publicación:</strong> ${post.title}</p>
            `
        } else if (vehicleId) {
            const vehicle = await prisma.vehicle.findUnique({
                where: { id: parseInt(vehicleId) },
                include: { dealer: true }
            })

            if (!vehicle) return res.status(404).json({ error: 'Vehículo no encontrado' })

            dealerEmail = vehicle.dealer?.email
            subject = `Nuevo lead para vehículo: ${vehicle.brand} ${vehicle.model}`
            html = `
                <h3>Nuevo contacto interesado</h3>
                <p><strong>Nombre:</strong> ${leadData.name} ${leadData.lastname}</p>
                <p><strong>Email:</strong> ${leadData.email}</p>
                <p><strong>Teléfono:</strong> ${leadData.phone}</p>
                <p><strong>Vehículo:</strong> ${vehicle.brand} ${vehicle.model} (${vehicle.year})</p>
            `
        }

        if (dealerEmail) {
            await sendLeadEmail(dealerEmail, subject, html)
        }

        const lead = await prisma.lead.create({ data: leadData })

        res.status(201).json(lead)
    } catch (error) {
        console.error('Error al crear lead:', error)
        res.status(500).json({ error: 'Error al crear lead' })
    }
}


module.exports = {
    getLeadsByDealer,
    createLead
}
