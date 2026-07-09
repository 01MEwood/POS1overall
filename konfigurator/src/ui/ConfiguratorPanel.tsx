// Steuer-Panel mit allen Konfigurationsoptionen.

import {
  BODY_COLORS,
  DEPTHS,
  HANDLES,
  HEIGHTS,
  MATERIALS,
  MAX_FILLER,
  MIN_AUFSATZ_HEIGHT,
  PLZ_ZONES,
  WIDTHS,
  getMaterial,
} from '../data/catalog'
import { deriveMeasures } from '../pricing/geometry'
import { PRESETS, useConfig } from '../state/store'
import type { CarcassDepth, CarcassHeight, ElementWidth } from '../types'
import { Chip, Section, Stepper, Swatch } from './controls'

export function ConfiguratorPanel() {
  const store = useConfig()
  const config = store.config
  const m = deriveMeasures(config)

  const material = getMaterial(config.materialId)
  const gap = config.roomHeight - config.height
  const aufsatzPossible = gap >= MIN_AUFSATZ_HEIGHT
  const blendePossible = gap > 0

  return (
    <div className="panel">
      {/* Vorlagen */}
      <Section title="Vorlagen" hint="Schnellstart">
        <div className="chips">
          {PRESETS.map((p) => (
            <Chip key={p.id} active={false} onClick={() => store.applyPreset(p.id)} title={p.description}>
              {p.name}
            </Chip>
          ))}
          <Chip active={false} onClick={() => store.reset()} title="Auf Standard zurücksetzen">
            ↺ Zurücksetzen
          </Chip>
        </div>
      </Section>

      {/* Elemente */}
      <Section title="Elemente" hint={`${m.elementWidth} cm gesamt`}>
        <div className="elements">
          {config.elements.map((el, i) => (
            <div className="element-row" key={el.id}>
              <div className="element-row__head">
                <span className="element-row__idx">Element {i + 1}</span>
                <button
                  type="button"
                  className="linkbtn"
                  onClick={() => store.removeElement(el.id)}
                  disabled={config.elements.length <= 1}
                >
                  entfernen
                </button>
              </div>
              <div className="chips chips--tight">
                {WIDTHS.map((w) => (
                  <Chip
                    key={w}
                    active={el.width === w}
                    onClick={() => store.setElementWidth(el.id, w as ElementWidth)}
                  >
                    {w} cm
                  </Chip>
                ))}
                <span className="chips__sep" />
                <Chip active={el.doors === 1} onClick={() => store.setElementDoors(el.id, 1)}>
                  1 Tür
                </Chip>
                <Chip active={el.doors === 2} onClick={() => store.setElementDoors(el.id, 2)}>
                  2 Türen
                </Chip>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="addbtn"
          onClick={() => store.addElement()}
          disabled={config.elements.length >= 6}
        >
          + Element hinzufügen
        </button>
      </Section>

      {/* Korpus */}
      <Section title="Korpus" hint="vorhandener PAX">
        <label className="field-label">Korpusfarbe</label>
        <div className="swatches">
          {BODY_COLORS.map((c) => (
            <Swatch
              key={c.id}
              active={config.bodyColorId === c.id}
              color={c.hex}
              label={c.name}
              onClick={() => store.setBodyColor(c.id)}
            />
          ))}
        </div>
        <div className="grid2">
          <div>
            <label className="field-label">Höhe</label>
            <div className="chips chips--tight">
              {HEIGHTS.map((h) => (
                <Chip
                  key={h}
                  active={config.height === h}
                  onClick={() => store.setHeight(h as CarcassHeight)}
                >
                  {h} cm
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">Tiefe</label>
            <div className="chips chips--tight">
              {DEPTHS.map((d) => (
                <Chip
                  key={d}
                  active={config.depth === d}
                  onClick={() => store.setDepth(d as CarcassDepth)}
                >
                  {d} cm
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Fronten */}
      <Section title="Fronten" hint={material.short}>
        <label className="field-label">Material</label>
        <div className="chips">
          {MATERIALS.map((mat) => (
            <Chip
              key={mat.id}
              active={config.materialId === mat.id}
              onClick={() => store.setMaterial(mat.id)}
              title={`${mat.description} · ${mat.pricePerM2} €/m²`}
            >
              {mat.name}
            </Chip>
          ))}
        </div>
        <p className="muted-note">{material.description}</p>

        <label className="field-label">Farbe</label>
        <div className="swatches">
          {material.colors.map((c) => (
            <Swatch
              key={c.id}
              active={config.colorId === c.id}
              color={c.hex}
              label={c.name}
              onClick={() => store.setColor(c.id)}
            />
          ))}
        </div>

        <label className="field-label">Griff</label>
        <div className="chips">
          {HANDLES.map((h) => (
            <Chip
              key={h.id}
              active={config.handleId === h.id}
              onClick={() => store.setHandle(h.id)}
              title={h.description}
            >
              {h.name}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Deckenabschluss */}
      <Section title="Deckenabschluss" hint={`Spalt ${Math.max(0, gap)} cm`}>
        <div className="grid2 grid2--center">
          <label className="field-label">Raumhöhe</label>
          <Stepper
            value={config.roomHeight}
            min={210}
            max={320}
            step={1}
            unit=" cm"
            onChange={(v) => store.setRoomHeight(v)}
          />
        </div>
        <div className="chips">
          <Chip active={config.topMode === 'none'} onClick={() => store.setTopMode('none')}>
            Offen
          </Chip>
          <Chip
            active={config.topMode === 'blende'}
            onClick={() => store.setTopMode('blende')}
            disabled={!blendePossible}
            title={blendePossible ? 'Deckenblende schließt den Spalt' : 'Kein Spalt zur Decke'}
          >
            Deckenblende
          </Chip>
          <Chip
            active={config.topMode === 'aufsatz'}
            onClick={() => store.setTopMode('aufsatz')}
            disabled={!aufsatzPossible}
            title={
              aufsatzPossible
                ? 'Aufsatzschränke bis zur Decke'
                : `Erst ab ${MIN_AUFSATZ_HEIGHT} cm Spalt sinnvoll`
            }
          >
            Aufsatzschränke
          </Chip>
        </div>
        {config.topMode !== 'none' && gap <= 0 && (
          <p className="muted-note warn">Raumhöhe ist nicht größer als die Korpushöhe – kein Aufsatz möglich.</p>
        )}
      </Section>

      {/* Passstücke */}
      <Section title="Passstücke" hint="Spalt zur Wand">
        <div className="grid2 grid2--center">
          <label className="field-label">Links</label>
          <Stepper
            value={config.fillerLeft}
            min={0}
            max={MAX_FILLER}
            unit=" cm"
            onChange={(v) => store.setFiller('left', v)}
          />
        </div>
        <div className="grid2 grid2--center">
          <label className="field-label">Rechts</label>
          <Stepper
            value={config.fillerRight}
            min={0}
            max={MAX_FILLER}
            unit=" cm"
            onChange={(v) => store.setFiller('right', v)}
          />
        </div>
      </Section>

      {/* Lieferung & Montage */}
      <Section title="Lieferung & Montage" hint="Großraum Stuttgart">
        <div className="chips">
          <Chip active={config.delivery === 'lieferung'} onClick={() => store.setDelivery('lieferung')}>
            Lieferung
          </Chip>
          <Chip active={config.delivery === 'abholung'} onClick={() => store.setDelivery('abholung')}>
            Abholung
          </Chip>
        </div>

        {config.delivery === 'lieferung' && (
          <>
            <label className="field-label">Liefergebiet</label>
            <div className="zones">
              {PLZ_ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`zone${config.plzZone === z.id ? ' zone--on' : ''}`}
                  onClick={() => store.setPlzZone(z.id)}
                >
                  <span className="zone__name">{z.name}</span>
                  <span className="zone__desc">{z.description}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <label className="toggle">
          <input
            type="checkbox"
            checked={config.montage}
            onChange={(e) => store.setMontage(e.target.checked)}
          />
          <span className="toggle__box" aria-hidden />
          <span className="toggle__text">
            Montage durch das finverk-Team
            <span className="toggle__sub">Fronten, Passstücke & Aufsätze fertig montiert</span>
          </span>
        </label>
      </Section>
    </div>
  )
}
