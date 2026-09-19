import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const heroType = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'text',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'button',
      type: 'link',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare({title, media}) {
      return {
        title: title || 'Untitled',
        subtitle: 'Hero',
        media: media ?? ImageIcon,
      }
    },
  },
})
