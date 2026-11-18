import { StaticImageData } from 'next/image'

export type UserProfile = {
  name: string
  avatar: StaticImageData
  role: string
}

export type CommentType = {
  id: number
  comment: string
  user: UserProfile
  time: string
  reply?: CommentType[]
}

export type CarouselType = {
  title: string
  description: string
  image: StaticImageData
}

export type ContactType = {
  role: string
  name: string
  avatar: StaticImageData
}
