export interface User {
  id: string
  name: string
  email: string
}

export interface Todo {
  id: string
  // userId: string
  // title: string
  text: string
  completed: boolean
  // createdAt: Date
}

export interface WeatherData {
  tempature: number
  condition: string
  icon: string
}

export interface GalleryImage {
  id: string
  userId: string
  caption: string
  url: string
  uploadedAt: Date
}