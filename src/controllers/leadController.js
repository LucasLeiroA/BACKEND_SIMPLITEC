const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const leadQueue = require('../queues/leadQueue')





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

        if (req.user && req.user.role === 'client') {
            const user = await prisma.user.findUnique({ where: { id: req.user.id } })

            leadData = {
                ...leadData,
                name: user.name || name || 'Sin nombre',
                lastname: user.lastname || lastname || '',
                email: user.email || email
            }
        }

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
                <div style="font-family: 'Segoe UI', sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05)">
                <div style="background-color: #28a745; color: #fff; padding: 20px;">
                    <h2 style="margin: 0;">Nuevo contacto interesado en tu publicación</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Hola <strong>${post.dealer.name}</strong>,</p>
                    <p>Un usuario acaba de generar una nueva consulta para tu publicación <strong>${post.title}</strong>.</p>

                    <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #28a745;">
                    <p style="margin: 0;"><strong>Datos del contacto:</strong></p>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        <li><strong>Nombre:</strong> ${leadData.name} ${leadData.lastname}</li>
                        <li><strong>Email:</strong> ${leadData.email}</li>
                        <li><strong>Teléfono:</strong> ${leadData.phone}</li>
                    </ul>
                    </div>

                    <p>Revisá la sección de leads en tu panel para gestionar esta consulta.</p>

                    <p style="margin-top: 30px;">Saludos,<br/>Equipo SimpliTEC</p>
                </div>
                <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    © ${new Date().getFullYear()} SimpliTEC
                </div>
                </div>
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
                <div style="font-family: 'Segoe UI', sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05)">
                <div style="background-color: #17a2b8; color: #fff; padding: 20px;">
                    <h2 style="margin: 0;">Interesado en uno de tus vehículos</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Hola <strong>${vehicle.dealer.name}</strong>,</p>
                    <p>Un usuario se mostró interesado en el vehículo <strong>${vehicle.brand} ${vehicle.model} (${vehicle.year})</strong>.</p>

                    <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #17a2b8;">
                    <p style="margin: 0;"><strong>Datos del contacto:</strong></p>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        <li><strong>Nombre:</strong> ${leadData.name} ${leadData.lastname}</li>
                        <li><strong>Email:</strong> ${leadData.email}</li>
                        <li><strong>Teléfono:</strong> ${leadData.phone}</li>
                    </ul>
                    </div>

                    <p>Podés ver más detalles en la sección de leads de tu panel de administración.</p>

                    <p style="margin-top: 30px;">Saludos,<br/>Equipo SimpliTEC</p>
                </div>
                <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    © ${new Date().getFullYear()} SimpliTEC
                </div>
                </div>
                `

        }


        if (dealerEmail) {
            console.log({ dealerEmail });

            await leadQueue.add({
                to: dealerEmail,
                subject,
                html
            })
        }

        const lead = await prisma.lead.create({ data: leadData })

        res.status(201).json(lead)
    } catch (error) {
        console.error('Error al crear lead:', error)
        res.status(500).json({ error: 'Error al crear lead' })
    }
}



const respondLead = async (req, res) => {
    try {
        const leadId = parseInt(req.params.leadId)
        const { response } = req.body
        const userId = req.user.id

        if (!response) {
            return res.status(400).json({ error: 'La respuesta es obligatoria' })
        }

        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { dealer: true }
        })
        if (!lead) return res.status(404).json({ error: 'Lead no encontrada' })

        await prisma.lead.update({
            where: { id: leadId },
            data: {
                response,
                responded: true,
                respondedAt: new Date(),
                userReplyId: userId
            }
        })

        if (lead.email) {
            await leadQueue.add({
                to: lead.email,
                subject: '¡Tu consulta ha sido respondida!',
                html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05)">
            <div style="background-color: #007BFF; color: #fff; padding: 20px;">
                <h2 style="margin: 0;">${lead.dealer.name} | Respuesta a tu consulta</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hola <strong>${lead.name} ${lead.lastname}</strong>,</p>

                <p>¡Gracias por comunicarte con nosotros! Nuestro equipo ya respondió a tu mensaje:</p>

                <div style="margin: 20px 0; padding: 15px; background-color: #eaf4ff; border-left: 4px solid #007BFF;">
                    <p style="margin: 0;"><strong>Respuesta de ${lead.dealer.name}:</strong></p>
                    <p style="margin: 8px 0;">${response}</p>
                </div>

                <p>Si querés avanzar con la operación o tenés más consultas, no dudes en contactarnos.</p>

                <p style="margin-top: 30px;">Saludos cordiales,<br/><strong>Equipo ${lead.dealer.name}</strong></p>
            </div>
            <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                © ${new Date().getFullYear()} ${lead.dealer.name} - Todos los derechos reservados.
            </div>
        </div>
        `
            })
        }


        res.json({ message: 'Lead respondida correctamente' })
    } catch (error) {
        console.error('Error al responder lead:', error)
        res.status(500).json({ error: 'Error al responder lead' })
    }
}





module.exports = {
    getLeadsByDealer,
    createLead,
    respondLead

}
