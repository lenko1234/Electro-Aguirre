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
                    { title: 'Iluminación Exterior', value: 'Iluminación Exterior' },
                    { title: 'Materiales Eléctricos', value: 'Materiales Eléctricos' },
                    { title: 'Materiales para instalaciones', value: 'Materiales para instalaciones' },
                    { title: 'Protecciones eléctricas', value: 'Protecciones eléctricas' },
                    { title: 'Herramientas', value: 'Herramientas' },
                    { title: 'Cables y Conductores', value: 'Cables y Conductores' },
                    { title: 'Ventiladores', value: 'Ventiladores' },
                    { title: 'Artefactos Solares', value: 'Artefactos Solares' },
                    { title: 'Agua Caliente', value: 'Agua Caliente' },
                    { title: 'Sistemas modulares', value: 'Sistemas modulares' },
                    { title: 'Línea inteligente. Smart WiFi', value: 'Línea inteligente. Smart WiFi' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subcategorySistemasModulares',
            title: 'Marca (Sistemas modulares)',
            type: 'string',
            options: {
                list: [
                    { title: 'JELUZ', value: 'JELUZ' },
                    { title: 'KALOP', value: 'KALOP' },
                    { title: 'CAMBRE', value: 'CAMBRE' },
                ],
            },
            hidden: ({ parent }) => parent?.category !== 'Sistemas modulares',
            validation: (Rule) => Rule.custom((subcategory, context) => {
                const category = (context.parent as any)?.category;
                if (category === 'Sistemas modulares' && !subcategory) {
                    return 'La marca es requerida para Sistemas modulares';
                }
                return true;
            }),
        }),
        defineField({
            name: 'subcategoryVentiladores',
            title: 'Tipo (Ventiladores)',
            type: 'string',
            options: {
                list: [
                    { title: 'Techo', value: 'Techo' },
                    { title: 'Pared', value: 'Pared' },
                    { title: 'Pie', value: 'Pie' },
                ],
            },
            hidden: ({ parent }) => parent?.category !== 'Ventiladores',
            validation: (Rule) => Rule.custom((subcategory, context) => {
                const category = (context.parent as any)?.category;
                if (category === 'Ventiladores' && !subcategory) {
                    return 'El tipo es requerido para Ventiladores';
                }
                return true;
            }),
        }),
        // Virtual field for compatibility - combines both subcategories
        defineField({
            name: 'subcategory',
            title: 'Subcategoría (auto)',
            type: 'string',
            readOnly: true,
            hidden: true,
        }),
    ],
})
