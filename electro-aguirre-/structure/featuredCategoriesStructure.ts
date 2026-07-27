import {ListItemBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Destacar Categorías / Marcas')
    .schemaType('featuredCategories')
    .child(
      S.editor()
        .title('Destacar Categorías / Marcas')
        .schemaType('featuredCategories')
        .documentId('featuredCategories')
    )
)
