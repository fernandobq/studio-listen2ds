import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

function isHomeId(id?: string) {
  return id?.replace(/^drafts\./, '') === 'home'
}

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      hidden: ({document}) => isHomeId(document?._id),
      validation: (rule) =>
        rule.custom((slug, context) => {
          if (isHomeId(context.document?._id)) return true
          return slug?.current ? true : 'Required'
        }),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'pageBuilder',
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
