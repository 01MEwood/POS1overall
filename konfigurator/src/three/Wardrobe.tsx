// Baut den kompletten Schrank aus der aktuellen Konfiguration im 3D-Raum auf.
// Alle Maße in Metern (1 cm = 0.01 m).

import { RoundedBox } from '@react-three/drei'
import type { ReactNode } from 'react'
import { getBodyColor, getColor } from '../data/catalog'
import { deriveMeasures } from '../pricing/geometry'
import { useConfig } from '../state/store'
import type { ColorOption } from '../data/catalog'
import type { HandleId } from '../types'
import { frontMaterialProps } from './materials'

type Vec3 = [number, number, number]

const REVEAL = 0.003 // Fugenbreite zwischen Fronten
const DOOR_T = 0.019 // Frontstärke

// ---------------------------------------------------------------------------
// Bausteine
// ---------------------------------------------------------------------------

function Corpus({ position, size, color }: { position: Vec3; size: Vec3; color: string }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
    </mesh>
  )
}

function FrontPanel({ position, size, color }: { position: Vec3; size: Vec3; color: ColorOption }) {
  const props = frontMaterialProps(color)
  const radius = Math.min(0.006, size[0] / 2 - 0.001, size[1] / 2 - 0.001, size[2] / 2 - 0.001)
  return (
    <RoundedBox
      position={position}
      args={size}
      radius={Math.max(0.001, radius)}
      smoothness={3}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial {...props} />
    </RoundedBox>
  )
}

function Handle({
  type,
  side,
  doorW,
  doorH,
  cx,
  cy,
  frontZ,
}: {
  type: HandleId
  side: 'left' | 'right'
  doorW: number
  doorH: number
  cx: number
  cy: number
  frontZ: number
}) {
  if (type === 'grifflos') return null

  const innerEdge = side === 'right' ? cx + doorW / 2 : cx - doorW / 2
  const alu = type === 'griffleiste'
  const metal = (
    <meshStandardMaterial color={alu ? '#b6babf' : '#c9ccce'} metalness={0.85} roughness={0.32} />
  )

  if (type === 'griffleiste') {
    // Durchgehende Leiste direkt an der inneren Türkante.
    const x = side === 'right' ? innerEdge - 0.01 : innerEdge + 0.01
    return (
      <mesh position={[x, cy, frontZ + 0.004]} castShadow>
        <boxGeometry args={[0.016, doorH * 0.98, 0.01]} />
        {metal}
      </mesh>
    )
  }

  const x = side === 'right' ? innerEdge - 0.04 : innerEdge + 0.04

  if (type === 'knopf') {
    return (
      <mesh position={[x, cy + doorH * 0.12, frontZ + 0.013]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.026, 20]} />
        {metal}
      </mesh>
    )
  }

  // Stangengriff: senkrechter Bügel
  const length = Math.min(0.3, doorH * 0.45)
  return (
    <mesh position={[x, cy, frontZ + 0.03]} castShadow>
      <cylinderGeometry args={[0.007, 0.007, length, 16]} />
      {metal}
    </mesh>
  )
}

function Door({
  cx,
  cy,
  frontZ,
  width,
  height,
  color,
  handle,
  handleSide,
}: {
  cx: number
  cy: number
  frontZ: number
  width: number
  height: number
  color: ColorOption
  handle: HandleId
  handleSide: 'left' | 'right'
}) {
  return (
    <group>
      <FrontPanel position={[cx, cy, frontZ]} size={[width, height, DOOR_T]} color={color} />
      <Handle
        type={handle}
        side={handleSide}
        doorW={width}
        doorH={height}
        cx={cx}
        cy={cy}
        frontZ={frontZ + DOOR_T / 2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Hauptkomponente
// ---------------------------------------------------------------------------

export function Wardrobe() {
  const config = useConfig((s) => s.config)
  const m = deriveMeasures(config)

  const depthM = config.depth / 100
  const heightM = config.height / 100
  const totalWM = m.totalWidth / 100
  const fillerLM = config.fillerLeft / 100
  const fillerRM = config.fillerRight / 100
  const aufsatzHM = m.aufsatzHeight / 100
  const blendeHM = m.blendeHeight / 100

  const bodyHex = getBodyColor(config.bodyColorId).hex
  const color = getColor(config.materialId, config.colorId)

  const corpusFrontZ = depthM
  const doorZ = corpusFrontZ + DOOR_T / 2 + 0.0015

  const nodes: ReactNode[] = []

  let cursor = -totalWM / 2

  // Linkes Passstück
  if (fillerLM > 0) {
    const x0 = cursor
    const w = fillerLM
    nodes.push(
      <group key="filler-left">
        <Corpus position={[x0 + w / 2, heightM / 2, depthM / 2]} size={[w, heightM, depthM]} color={bodyHex} />
        <FrontPanel
          position={[x0 + w / 2, heightM / 2, doorZ]}
          size={[Math.max(0.01, w - REVEAL), heightM - 2 * REVEAL, DOOR_T]}
          color={color}
        />
      </group>,
    )
  }
  cursor += fillerLM

  // Elemente
  config.elements.forEach((el) => {
    const wM = el.width / 100
    const x0 = cursor
    const cx = x0 + wM / 2

    // Korpus
    nodes.push(
      <Corpus
        key={`corpus-${el.id}`}
        position={[cx, heightM / 2, depthM / 2]}
        size={[wM, heightM, depthM]}
        color={bodyHex}
      />,
    )

    // Türen
    const doorH = heightM - 2 * REVEAL
    const cy = heightM / 2
    if (el.doors === 1) {
      nodes.push(
        <Door
          key={`door-${el.id}`}
          cx={cx}
          cy={cy}
          frontZ={doorZ}
          width={wM - 2 * REVEAL}
          height={doorH}
          color={color}
          handle={config.handleId}
          handleSide="right"
        />,
      )
    } else {
      const doorW = (wM - 3 * REVEAL) / 2
      const leftCX = x0 + REVEAL + doorW / 2
      const rightCX = x0 + wM - REVEAL - doorW / 2
      nodes.push(
        <Door
          key={`door-${el.id}-l`}
          cx={leftCX}
          cy={cy}
          frontZ={doorZ}
          width={doorW}
          height={doorH}
          color={color}
          handle={config.handleId}
          handleSide="right"
        />,
        <Door
          key={`door-${el.id}-r`}
          cx={rightCX}
          cy={cy}
          frontZ={doorZ}
          width={doorW}
          height={doorH}
          color={color}
          handle={config.handleId}
          handleSide="left"
        />,
      )
    }

    // Aufsatzschrank
    if (aufsatzHM > 0) {
      const acy = heightM + aufsatzHM / 2
      nodes.push(
        <group key={`aufsatz-${el.id}`}>
          <Corpus position={[cx, acy, depthM / 2]} size={[wM, aufsatzHM, depthM]} color={bodyHex} />
          <FrontPanel
            position={[cx, acy, doorZ]}
            size={[wM - 2 * REVEAL, aufsatzHM - 2 * REVEAL, DOOR_T]}
            color={color}
          />
          {config.handleId !== 'grifflos' && (
            <mesh
              position={[cx, heightM + REVEAL + 0.05, doorZ + DOOR_T / 2 + 0.013]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.013, 0.013, 0.024, 20]} />
              <meshStandardMaterial color="#c9ccce" metalness={0.85} roughness={0.32} />
            </mesh>
          )}
        </group>,
      )
    }

    cursor += wM
  })

  // Rechtes Passstück
  if (fillerRM > 0) {
    const x0 = cursor
    const w = fillerRM
    nodes.push(
      <group key="filler-right">
        <Corpus position={[x0 + w / 2, heightM / 2, depthM / 2]} size={[w, heightM, depthM]} color={bodyHex} />
        <FrontPanel
          position={[x0 + w / 2, heightM / 2, doorZ]}
          size={[Math.max(0.01, w - REVEAL), heightM - 2 * REVEAL, DOOR_T]}
          color={color}
        />
      </group>,
    )
  }
  cursor += fillerRM

  // Deckenblende
  if (blendeHM > 0) {
    nodes.push(
      <group key="blende">
        <Corpus
          position={[0, heightM + blendeHM / 2, depthM - 0.04]}
          size={[totalWM, blendeHM, 0.08]}
          color={bodyHex}
        />
        <FrontPanel
          position={[0, heightM + blendeHM / 2, doorZ]}
          size={[totalWM - REVEAL, blendeHM - REVEAL, DOOR_T]}
          color={color}
        />
      </group>,
    )
  }

  return <group>{nodes}</group>
}
