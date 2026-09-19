import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

export const richTextType = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'content',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
  preview: {
    select: {title: 'content.0.children.0.text'},
    prepare({title}) {
      return {
        title: title || 'Rich text',
        subtitle: 'Rich text',
        media: BlockContentIcon,
      }
    },
  },
})
