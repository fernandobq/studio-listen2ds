import type {StructureResolver} from 'sanity/structure'
import {DocumentIcon, HomeIcon, MenuIcon} from '@sanity/icons'

const SINGLETON_TYPES = new Set(['navbar'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Navbar')
        .id('navbar')
        .icon(MenuIcon)
        .child(S.document().schemaType('navbar').documentId('navbar').title('Navbar')),
      S.listItem()
        .title('Home')
        .id('home')
        .icon(HomeIcon)
        .child(S.document().schemaType('page').documentId('home').title('Home')),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((item) => !SINGLETON_TYPES.has(item.getId() ?? ''))
        .map((item) => {
          if (item.getId() !== 'page') return item
          return S.listItem()
            .title('Pages')
            .id('page')
            .schemaType('page')
            .icon(DocumentIcon)
            .child(
              S.documentTypeList('page')
                .title('Pages')
                .filter('_id != "home" && _id != "drafts.home"'),
            )
        }),
    ])
