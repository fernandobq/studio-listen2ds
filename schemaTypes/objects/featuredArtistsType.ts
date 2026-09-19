import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const featuredArtistsType = defineType({
  name: 'featuredArtists',
  title: 'Featured artists',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'artists',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'artist'}]})],
    }),
  ],
  preview: {
    select: {heading: 'heading', artists: 'artists'},
    prepare({heading, artists}) {
      const count = Array.isArray(artists) ? artists.length : 0
      return {
        title: heading || 'Featured artists',
        subtitle: `${count} artist${count === 1 ? '' : 's'}`,
        media: UsersIcon,
      }
    },
  },
})
