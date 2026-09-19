import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const genreType = defineType({
  name: 'genre',
  title: 'Genre',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'generatePage',
      title: 'Generate page',
      type: 'boolean',
      description: 'When enabled, a dedicated page will be generated for this genre.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
