import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const artistType = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: UserIcon,
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
      name: 'image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'genres',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'genre'}]})],
    }),
    defineField({
      name: 'website',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'generatePage',
      title: 'Generate page',
      type: 'boolean',
      description: 'When enabled, a dedicated page will be generated for this artist.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'name', media: 'image'},
  },
})
