// Material-Helfer für die 3D-Fronten.
import * as THREE from 'three'
import type { ColorOption } from '../data/catalog'

export interface FrontMaterialProps {
  color: THREE.ColorRepresentation
  map?: THREE.Texture
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
}

// Prozedurale Holzmaserung, damit Furnier-Fronten als Holz lesbar sind.
// Die Textur wird pro Farbe einmal erzeugt und zwischengespeichert.
const woodCache = new Map<string, THREE.Texture>()

function makeWoodTexture(color: ColorOption): THREE.Texture {
  const cached = woodCache.get(color.id)
  if (cached) return cached

  const w = 256
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = color.hex
  ctx.fillRect(0, 0, w, h)

  // Feine vertikale Maserung
  for (let x = 0; x < w; x++) {
    const n =
      Math.sin(x * 0.09) * 0.5 +
      Math.sin(x * 0.31 + 1.3) * 0.3 +
      Math.sin(x * 0.7 + 4.1) * 0.2
    const shade = Math.round(n * 16)
    ctx.strokeStyle = `rgba(${shade < 0 ? 40 : 255}, ${shade < 0 ? 30 : 250}, ${shade < 0 ? 20 : 235}, ${Math.min(0.14, Math.abs(shade) / 90)})`
    ctx.beginPath()
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, h)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 4
  woodCache.set(color.id, texture)
  return texture
}

export function frontMaterialProps(color: ColorOption): FrontMaterialProps {
  if (color.wood) {
    return {
      color: '#ffffff',
      map: makeWoodTexture(color),
      roughness: color.roughness,
      metalness: color.metalness,
      clearcoat: color.clearcoat,
      clearcoatRoughness: 0.35,
    }
  }
  return {
    color: color.hex,
    roughness: color.roughness,
    metalness: color.metalness,
    clearcoat: color.clearcoat,
    clearcoatRoughness: color.clearcoat > 0.5 ? 0.06 : 0.3,
  }
}
