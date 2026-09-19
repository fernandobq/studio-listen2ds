import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const featuredPostsType = defineType({
  name: 'featuredPosts',
  title: 'Featured posts',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'posts',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'post'}]})],
    }),
  ],
  preview: {
    select: {heading: 'heading', posts: 'posts'},
    prepare({heading, posts}) {
      const count = Array.isArray(posts) ? posts.length : 0
      return {
        title: heading || 'Featured posts',
        subtitle: `${count} post${count === 1 ? '' : 's'}`,
        media: DocumentTextIcon,
      }
    },
  },
})
