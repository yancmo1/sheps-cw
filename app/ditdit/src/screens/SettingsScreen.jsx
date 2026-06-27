import { useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'

function SettingRow({ label, value, min, max, step, display, onChange }) {
  return (
    <div className="setting-row">
      <div className="setting-label-row">
        <label className="setting-label">{label}</label>
        <span className="setting-value">{display}</span>
      </div>
      <input
        type="range"
        className="setting-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

export default function SettingsScreen({ settings, onSave, onBack }) {
  const [local, setLocal] = useState({ ...settings })

  function update(key, value) {
    const next = { ...local, [key]: value }
    setLocal(next)
    onSave(next)
  }

  return (
    <section className="screen" aria-labelledby="settings-title">
      <div className="screen-header">
        <TouchButton variant="secondary" size="sm" onClick={onBack}>← Back</TouchButton>
        <p className="screen-kicker">Dit Dit</p>
      </div>

      <h1 id="settings-title" className="screen-title">Settings</h1>

      <div className="settings-form">
        <SettingRow
          label="Speed"
          value={local.wpm}
          min={5} max={40} step={1}
          display={`${local.wpm} WPM`}
          onChange={v => update('wpm', v)}
        />
        <SettingRow
          label="Farnsworth WPM"
          value={local.farnsworth}
          min={5} max={local.wpm} step={1}
          display={`${local.farnsworth} WPM`}
          onChange={v => update('farnsworth', v)}
        />
        <SettingRow
          label="Tone Frequency"
          value={local.frequency}
          min={300} max={900} step={10}
          display={`${local.frequency} Hz`}
          onChange={v => update('frequency', v)}
        />
        <SettingRow
          label="Volume"
          value={local.volume}
          min={0} max={100} step={5}
          display={`${local.volume}%`}
          onChange={v => update('volume', v)}
        />
      </div>
    </section>
  )
}
