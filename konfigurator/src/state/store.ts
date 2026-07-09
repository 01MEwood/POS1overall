// Zustand-Store für die aktuelle Konfiguration.

import { create } from 'zustand'
import { getMaterial, MAX_FILLER } from '../data/catalog'
import type {
  BodyColorId,
  CarcassDepth,
  CarcassHeight,
  DeliveryMode,
  ElementWidth,
  HandleId,
  MaterialId,
  PlzZone,
  TopMode,
  WardrobeConfig,
  WardrobeElement,
} from '../types'

let elementCounter = 0
const nextElementId = () => `el-${++elementCounter}`

function makeElement(width: ElementWidth = 100, doors: 1 | 2 = 2): WardrobeElement {
  return { id: nextElementId(), width, doors }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const DEFAULT_CONFIG: WardrobeConfig = {
  bodyColorId: 'weiss',
  height: 236,
  depth: 58,
  roomHeight: 250,
  elements: [makeElement(100, 2), makeElement(100, 2)],
  materialId: 'lack_matt',
  colorId: 'reinweiss',
  handleId: 'grifflos',
  fillerLeft: 0,
  fillerRight: 0,
  topMode: 'none',
  delivery: 'lieferung',
  montage: false,
  plzZone: 'stuttgart',
}

export interface Preset {
  id: string
  name: string
  description: string
  build: () => WardrobeConfig
}

export const PRESETS: Preset[] = [
  {
    id: 'klassik',
    name: 'Zwei-Türer Klassik',
    description: '2 × 100 cm, weiße Lackfronten, grifflos',
    build: () => ({
      ...DEFAULT_CONFIG,
      elements: [makeElement(100, 2), makeElement(100, 2)],
      topMode: 'none',
    }),
  },
  {
    id: 'deckenhoch',
    name: 'Deckenhoch mit Aufsatz',
    description: '3 Elemente + Aufsatzschränke bis zur Decke',
    build: () => ({
      ...DEFAULT_CONFIG,
      elements: [makeElement(100, 2), makeElement(75, 1), makeElement(100, 2)],
      height: 236,
      roomHeight: 270,
      topMode: 'aufsatz',
      fillerLeft: 4,
      fillerRight: 4,
      materialId: 'melamin',
      colorId: 'weiss',
    }),
  },
  {
    id: 'nische',
    name: 'Wandbündig in Nische',
    description: '2 Elemente mit seitlichen Passstücken & Deckenblende',
    build: () => ({
      ...DEFAULT_CONFIG,
      elements: [makeElement(75, 1), makeElement(75, 1)],
      height: 236,
      roomHeight: 250,
      topMode: 'blende',
      fillerLeft: 6,
      fillerRight: 6,
      materialId: 'furnier',
      colorId: 'eiche',
      handleId: 'stangengriff',
    }),
  },
]

interface ConfigStore {
  config: WardrobeConfig
  setBodyColor: (id: BodyColorId) => void
  setHeight: (h: CarcassHeight) => void
  setDepth: (d: CarcassDepth) => void
  setRoomHeight: (cm: number) => void
  addElement: () => void
  removeElement: (id: string) => void
  setElementWidth: (id: string, width: ElementWidth) => void
  setElementDoors: (id: string, doors: 1 | 2) => void
  setMaterial: (id: MaterialId) => void
  setColor: (id: string) => void
  setHandle: (id: HandleId) => void
  setFiller: (side: 'left' | 'right', cm: number) => void
  setTopMode: (mode: TopMode) => void
  setDelivery: (mode: DeliveryMode) => void
  setMontage: (on: boolean) => void
  setPlzZone: (zone: PlzZone) => void
  applyPreset: (id: string) => void
  reset: () => void
}

export const useConfig = create<ConfigStore>((set) => ({
  config: DEFAULT_CONFIG,

  setBodyColor: (id) => set((s) => ({ config: { ...s.config, bodyColorId: id } })),
  setHeight: (h) => set((s) => ({ config: { ...s.config, height: h } })),
  setDepth: (d) => set((s) => ({ config: { ...s.config, depth: d } })),
  setRoomHeight: (cm) =>
    set((s) => ({ config: { ...s.config, roomHeight: clamp(Math.round(cm), 210, 320) } })),

  addElement: () =>
    set((s) =>
      s.config.elements.length >= 6
        ? s
        : { config: { ...s.config, elements: [...s.config.elements, makeElement()] } },
    ),

  removeElement: (id) =>
    set((s) =>
      s.config.elements.length <= 1
        ? s
        : { config: { ...s.config, elements: s.config.elements.filter((e) => e.id !== id) } },
    ),

  setElementWidth: (id, width) =>
    set((s) => ({
      config: {
        ...s.config,
        elements: s.config.elements.map((e) => (e.id === id ? { ...e, width } : e)),
      },
    })),

  setElementDoors: (id, doors) =>
    set((s) => ({
      config: {
        ...s.config,
        elements: s.config.elements.map((e) => (e.id === id ? { ...e, doors } : e)),
      },
    })),

  setMaterial: (id) =>
    set((s) => {
      // Farbe auf die erste Farbe des neuen Materials setzen, falls die
      // aktuelle Farb-ID dort nicht existiert.
      const material = getMaterial(id)
      const colorId = material.colors.some((c) => c.id === s.config.colorId)
        ? s.config.colorId
        : material.colors[0].id
      return { config: { ...s.config, materialId: id, colorId } }
    }),

  setColor: (id) => set((s) => ({ config: { ...s.config, colorId: id } })),
  setHandle: (id) => set((s) => ({ config: { ...s.config, handleId: id } })),

  setFiller: (side, cm) =>
    set((s) => {
      const value = clamp(Math.round(cm), 0, MAX_FILLER)
      return {
        config: {
          ...s.config,
          fillerLeft: side === 'left' ? value : s.config.fillerLeft,
          fillerRight: side === 'right' ? value : s.config.fillerRight,
        },
      }
    }),

  setTopMode: (mode) => set((s) => ({ config: { ...s.config, topMode: mode } })),
  setDelivery: (mode) =>
    set((s) => ({
      config: {
        ...s.config,
        delivery: mode,
        // Ohne Lieferung ist auch keine Montage durch uns möglich.
        montage: mode === 'abholung' ? false : s.config.montage,
      },
    })),
  setMontage: (on) =>
    set((s) => ({
      config: { ...s.config, montage: on, delivery: on ? 'lieferung' : s.config.delivery },
    })),
  setPlzZone: (zone) => set((s) => ({ config: { ...s.config, plzZone: zone } })),

  applyPreset: (id) =>
    set(() => {
      const preset = PRESETS.find((p) => p.id === id)
      return preset ? { config: preset.build() } : {}
    }),

  reset: () => set({ config: DEFAULT_CONFIG }),
}))
