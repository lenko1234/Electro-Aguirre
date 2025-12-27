import { defineField, defineType } from 'sanity'
import { BellIcon } from '@sanity/icons'

export const announcementType = defineType({
    name: 'announcement',
    title: 'Aviso del Header',
    type: 'document',
    icon: BellIcon,
    fields: [
        defineField({
            name: 'text',
            title: 'Texto del Aviso',
            type: 'string',
            description: 'El texto que aparecerá en el ticker del header. Mantenerlo conciso.',
            validation: (Rule) => Rule.required().max(150).warning('El texto es muy largo, intenta ser más conciso'),
        }),
        defineField({
            name: 'icon',
            title: 'Emoji/Icono',
            type: 'string',
            description: 'Emoji opcional para el aviso (ej: ⚡, 🏷️, 🚚, 🎉, ⭐)',
            validation: (Rule) => Rule.max(5),
        }),
        defineField({
            name: 'isActive',
            title: 'Activo',
            type: 'boolean',
            description: 'Solo los avisos activos se mostrarán en el ticker',
            initialValue: true,
        }),
        defineField({
            name: 'order',
            title: 'Orden',
            type: 'number',
            description: 'Orden en que aparecerá en el ticker (menor número = primero)',
            initialValue: 0,
            validation: (Rule) => Rule.required().integer(),
        }),
    ],
    preview: {
        select: {
            text: 'text',
            icon: 'icon',
            isActive: 'isActive',
            order: 'order',
        },
        prepare({ text, icon, isActive, order }) {
            return {
                title: `${icon || '📢'} ${text}`,
                subtitle: `${isActive ? '✅ Activo' : '❌ Inactivo'} • Orden: ${order}`,
            }
        },
    },
})
