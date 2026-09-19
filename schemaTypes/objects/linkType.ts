import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

type LinkValue = {
  label?: string
  linkType?: 'path' | 'url'
  path?: string
  url?: string
}

function isLinkFilled(value?: LinkValue) {
  return Boolean(value?.label || value?.linkType || value?.path || value?.url)
}

function isNavbarDocument(document?: {_type?: string}) {
  return document?._type === 'navbar'
}

export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) =>
        rule.custom((label, context) => {
          const parent = context.parent as LinkValue | undefined
          if (isNavbarDocument(context.document) || isLinkFilled(parent)) {
            return label ? true : 'Required'
          }
          return true
        }),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Site path', value: 'path'},
          {title: 'External URL', value: 'url'},
        ],
        layout: 'radio',
      },
      validation: (rule) =>
        rule.custom((linkType, context) => {
          const parent = context.parent as LinkValue | undefined
          if (isNavbarDocument(context.document) || isLinkFilled(parent)) {
            return linkType ? true : 'Required'
          }
          return true
        }),
    }),
    defineField({
      name: 'path',
      title: 'Site path',
      type: 'string',
      description: 'In-site path, e.g. / or /posts.',
      hidden: ({parent}) => (parent as LinkValue | undefined)?.linkType !== 'path',
      validation: (rule) =>
        rule.custom((path, context) => {
          const parent = context.parent as LinkValue | undefined
          if (parent?.linkType !== 'path') return true
          if (!path) return 'Required'
          if (!path.startsWith('/')) return 'Path must start with /'
          return true
        }),
    }),
    defineField({
      name: 'url',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => (parent as LinkValue | undefined)?.linkType !== 'url',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).custom((url, context) => {
          const parent = context.parent as LinkValue | undefined
          if (parent?.linkType !== 'url') return true
          return url ? true : 'Required'
        }),
    }),
  ],
  preview: {
    select: {title: 'label', linkType: 'linkType', path: 'path', url: 'url'},
    prepare({title, linkType, path, url}) {
      return {
        title: title || 'Untitled link',
        subtitle: linkType === 'url' ? url : path,
      }
    },
  },
})
