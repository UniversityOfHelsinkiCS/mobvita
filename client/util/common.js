/**
 * Insert common items here
 */
import revitaLogoTransparent from 'Assets/revita_logo_transparent.png'

export const images = {
  revitaLogoTransparent,
}

export const capitalize = (word)=> {
  const firstLetter = word.slice(0,1).toUpperCase()
  const wordEnd = word.slice(1, word.length)
  return `${firstLetter}${wordEnd}`
}

export const colors = {

}

export * from '@root/config/common'
