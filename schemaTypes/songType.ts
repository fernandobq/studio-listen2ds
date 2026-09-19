import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const songType = defineType({
  name: 'song',
  title: 'Song',
  type: 'document',
  icon: PlayIcon,
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
      name: 'album',
      type: 'reference',
      to: [{type: 'album'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'trackNumber',
      title: 'Track number',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'duration',
      type: 'string',
      description: 'Length of the song, e.g. "3:45".',
    }),
    defineField({
      name: 'audioFile',
      title: 'Audio file',
      type: 'file',
      options: {accept: 'audio/*'},
    }),
    defineField({
      name: 'genres',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'genre'}]})],
    }),
    defineField({
      name: 'review',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'links',
      title: 'Streaming links',
      type: 'object',
      fields: [
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          validation: (rule) => rule.uri({scheme: ['http', 'https']}),
        }),
        defineField({
          name: 'spotify',
          title: 'Spotify',
          type: 'url',
          validation: (rule) => rule.uri({scheme: ['http', 'https']}),
        }),
        defineField({
          name: 'appleMusic',
          title: 'Apple Music',
          type: 'url',
          validation: (rule) => rule.uri({scheme: ['http', 'https']}),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'artist.name'},
  },
})
