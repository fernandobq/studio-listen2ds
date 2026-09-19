import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const featuredAlbumsType = defineType({
  name: 'featuredAlbums',
  title: 'Featured albums',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'albums',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'album'}]})],
    }),
  ],
  preview: {
    select: {heading: 'heading', albums: 'albums'},
    prepare({heading, albums}) {
      const count = Array.isArray(albums) ? albums.length : 0
      return {
        title: heading || 'Featured albums',
        subtitle: `${count} album${count === 1 ? '' : 's'}`,
        media: ImageIcon,
      }
    },
  },
})
