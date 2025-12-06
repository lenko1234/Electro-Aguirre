import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const catalogoItemType = defineType({
    name: 'catalogoItem',
    title: 'Item del Catálogo',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Título del Producto',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción Corta',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Imagen',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Categoría',
            type: 'string',
            options: {
                list: [
                    { title: 'Iluminación Hogar', value: 'Iluminación Hogar' },
                    { title: 'Iluminación Industrial', value: 'Iluminación Industrial' },
                    { title: 'Materiales Eléctricos', value: 'Materiales Eléctricos' },
                    { title: 'Herramientas', value: 'Herramientas' },
                    { title: 'Cables y Conductores', value: 'Cables y Conductores' },
                ],
            },
        }),
    ],
})
