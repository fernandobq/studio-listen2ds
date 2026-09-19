import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'richText'}),
    defineArrayMember({type: 'featuredPosts'}),
    defineArrayMember({type: 'featuredAlbums'}),
    defineArrayMember({type: 'featuredArtists'}),
  ],
})
