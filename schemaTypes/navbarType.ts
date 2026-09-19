import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons'

export const navbarType = defineType({
  name: 'navbar',
  title: 'Navbar',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navbar'}
    },
  },
})
