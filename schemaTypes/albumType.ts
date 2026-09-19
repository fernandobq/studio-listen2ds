import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const albumType = defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  icon: ImageIcon,
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artist',
      type: 'reference',
      to: [{type: 'artist'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release date',
      type: 'date',
    }),
    defineField({
      name: 'genres',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'genre'}]})],
    }),
    defineField({
      name: 'tracklist',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'song'}]})],
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'generatePage',
      title: 'Generate page',
      type: 'boolean',
      description: 'When enabled, a dedicated page will be generated for this album.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'artist.name', media: 'coverImage'},
  },
})
