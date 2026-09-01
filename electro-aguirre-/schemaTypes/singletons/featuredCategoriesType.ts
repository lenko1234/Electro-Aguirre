import { SparklesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const featuredCategoriesType = defineType({
  name: 'featuredCategories',
  title: 'Destacar Categorías / Marcas',
  type: 'document',
  icon: SparklesIcon,
  fieldsets: [
    { name: 'herramientas', title: '🛠️ Herramientas', options: { collapsible: true, collapsed: false } },
    { name: 'protecciones', title: '⚡ Protecciones Eléctricas', options: { collapsible: true, collapsed: true } },
    { name: 'electricidad', title: '🔧 Electricidad e Instalación', options: { collapsible: true, collapsed: true } },
    { name: 'tableros', title: '📦 Tableros y Distribución', options: { collapsible: true, collapsed: true } },
    { name: 'sistemasModulares', title: '🔌 Sistemas Modulares', options: { collapsible: true, collapsed: true } },
    { name: 'iluminacionHogar', title: '💡 Iluminación Hogar', options: { collapsible: true, collapsed: true } },
    { name: 'iluminacionExterior', title: '🌙 Iluminación Exterior', options: { collapsible: true, collapsed: true } },
    { name: 'ventiladores', title: '🌀 Ventiladores', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // Herramientas
    defineField({
      name: 'featured_UNI_T',
      title: 'Destacar UNI-T',
      type: 'boolean',
      fieldset: 'herramientas',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Jadever',
      title: 'Destacar Jadever',
      type: 'boolean',
      fieldset: 'herramientas',
      initialValue: false,
    }),
    defineField({
      name: 'featured_FullEnergy',
      title: 'Destacar FullEnergy',
      type: 'boolean',
      fieldset: 'herramientas',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Viyilant',
      title: 'Destacar Viyilant',
      type: 'boolean',
      fieldset: 'herramientas',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Baw',
      title: 'Destacar Baw',
      type: 'boolean',
      fieldset: 'herramientas',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Kalop',
      title: 'Destacar Kalop',
      type: 'boolean',
      fieldset: 'herramientas',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Bulit',
      title: 'Destacar Bulit',
      type: 'boolean',
      fieldset: 'herramientas',
      initialValue: false,
    }),

    // Protecciones Eléctricas
    defineField({
      name: 'featured_Sica',
      title: 'Destacar Sica',
      type: 'boolean',
      fieldset: 'protecciones',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Hager',
      title: 'Destacar Hager',
      type: 'boolean',
      fieldset: 'protecciones',
      initialValue: false,
    }),
    defineField({
      name: 'featured_LS',
      title: 'Destacar LS',
      type: 'boolean',
      fieldset: 'protecciones',
      initialValue: false,
    }),

    // Electricidad e Instalación
    defineField({
      name: 'featured_Materiales_Electricos',
      title: 'Destacar Materiales Eléctricos',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Materiales_para_instalaciones',
      title: 'Destacar Materiales para instalaciones',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Cable_canal',
      title: 'Destacar Cable canal',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Bandejas_portacables',
      title: 'Destacar Bandejas portacables',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Cables_y_Conductores',
      title: 'Destacar Cables y Conductores',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Linea_aerea_y_moseteria',
      title: 'Destacar Línea aérea y morsetería',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Terminales_y_uniones',
      title: 'Destacar Terminales y uniones',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Fichas_macho_y_hembra',
      title: 'Destacar Fichas macho y hembra',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Interruptores_conmutadores_e_inversores',
      title: 'Destacar Interruptores, conmutadores e inversores',
      type: 'boolean',
      fieldset: 'electricidad',
      initialValue: false,
    }),

    // Tableros y Distribución
    defineField({
      name: 'featured_Gabinetes',
      title: 'Destacar Gabinetes',
      type: 'boolean',
      fieldset: 'tableros',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Tableros_para_tomas',
      title: 'Destacar Tableros para tomas',
      type: 'boolean',
      fieldset: 'tableros',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Cajas_para_termicas',
      title: 'Destacar Cajas para térmicas',
      type: 'boolean',
      fieldset: 'tableros',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Cajas_estancas',
      title: 'Destacar Cajas estancas',
      type: 'boolean',
      fieldset: 'tableros',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Cajas_para_derivaciones',
      title: 'Destacar Cajas para derivaciones',
      type: 'boolean',
      fieldset: 'tableros',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Distribuidores',
      title: 'Destacar Distribuidores',
      type: 'boolean',
      fieldset: 'tableros',
      initialValue: false,
    }),

    // Sistemas Modulares
    defineField({
      name: 'featured_JELUZ',
      title: 'Destacar JELUZ',
      type: 'boolean',
      fieldset: 'sistemasModulares',
      initialValue: false,
    }),
    defineField({
      name: 'featured_KALOP',
      title: 'Destacar KALOP',
      type: 'boolean',
      fieldset: 'sistemasModulares',
      initialValue: false,
    }),
    defineField({
      name: 'featured_CAMBRE',
      title: 'Destacar CAMBRE',
      type: 'boolean',
      fieldset: 'sistemasModulares',
      initialValue: false,
    }),

    // Iluminación Hogar
    defineField({
      name: 'featured_Lamparas_led',
      title: 'Destacar Lámparas led',
      type: 'boolean',
      fieldset: 'iluminacionHogar',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Tubos_y_Listones_led',
      title: 'Destacar Tubos y Listones led',
      type: 'boolean',
      fieldset: 'iluminacionHogar',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Apliques',
      title: 'Destacar Apliques',
      type: 'boolean',
      fieldset: 'iluminacionHogar',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Empotrables',
      title: 'Destacar Empotrables',
      type: 'boolean',
      fieldset: 'iluminacionHogar',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Colgantes',
      title: 'Destacar Colgantes',
      type: 'boolean',
      fieldset: 'iluminacionHogar',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Spots',
      title: 'Destacar Spots',
      type: 'boolean',
      fieldset: 'iluminacionHogar',
      initialValue: false,
    }),

    // Iluminación Exterior
    defineField({
      name: 'featured_Proyectores_LED',
      title: 'Destacar Proyectores LED',
      type: 'boolean',
      fieldset: 'iluminacionExterior',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Alumbrado_publico',
      title: 'Destacar Alumbrado público',
      type: 'boolean',
      fieldset: 'iluminacionExterior',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Tortugas',
      title: 'Destacar Tortugas',
      type: 'boolean',
      fieldset: 'iluminacionExterior',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Guirnalda',
      title: 'Destacar Guirnalda',
      type: 'boolean',
      fieldset: 'iluminacionExterior',
      initialValue: false,
    }),
    defineField({
      name: 'featured_GRALF',
      title: 'Destacar GRALF',
      type: 'boolean',
      fieldset: 'iluminacionExterior',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Faroles',
      title: 'Destacar Faroles',
      type: 'boolean',
      fieldset: 'iluminacionExterior',
      initialValue: false,
    }),

    // Ventiladores
    defineField({
      name: 'featured_Techo',
      title: 'Destacar Techo',
      type: 'boolean',
      fieldset: 'ventiladores',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Pared',
      title: 'Destacar Pared',
      type: 'boolean',
      fieldset: 'ventiladores',
      initialValue: false,
    }),
    defineField({
      name: 'featured_Pie',
      title: 'Destacar Pie',
      type: 'boolean',
      fieldset: 'ventiladores',
      initialValue: false,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Destacar Categorías / Marcas',
        subtitle: 'Configuración de prioridad en catálogo',
      }
    },
  },
})
