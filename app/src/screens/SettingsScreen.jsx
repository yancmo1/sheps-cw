import { useRef, useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import {
  exportSessionHistoryCsv,
  exportSessionHistoryJson,
  importSessionHistoryJson,
} from '../progress.js'

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

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="setting-row">
      <div className="setting-label-row">
        <label className="setting-label">{label}</label>
        <span className="setting-value">{value ? 'On' : 'Off'}</span>
      </div>
      <div className="option-group option-group-sm">
        <button
          type="button"
          className={`option-btn${value ? ' option-btn-active' : ''}`}
          onClick={() => onChange(true)}
        >
          On
        </button>
        <button
          type="button"
          className={`option-btn${!value ? ' option-btn-active' : ''}`}
          onClick={() => onChange(false)}
        >
          Off
        </button>
      </div>
    </div>
  )
}

function ThemeRow({ value, onChange }) {
  return (
    <div className="setting-row">
      <div className="setting-label-row">
        <label className="setting-label">Theme</label>
        <span className="setting-value">{value}</span>
      </div>
      <div className="option-group">
        <button
          type="button"
          className={`option-btn${value === 'dark' ? ' option-btn-active' : ''}`}
          onClick={() => onChange('dark')}
        >
          Dark
        </button>
        <button
          type="button"
          className={`option-btn${value === 'light' ? ' option-btn-active' : ''}`}
          onClick={() => onChange('light')}
        >
          Light
        </button>
        <button
          type="button"
          className={`option-btn${value === 'contrast' ? ' option-btn-active' : ''}`}
          onClick={() => onChange('contrast')}
        >
          High Contrast
        </button>
      </div>
    </div>
  )
}

export default function SettingsScreen({ settings, onSave, onBack }) {
  const [local, setLocal] = useState({ ...settings })
  const [dataMessage, setDataMessage] = useState('')
  const importInputRef = useRef(null)

  function update(key, value) {
    const next = { ...local, [key]: value }
    setLocal(next)
    onSave(next)
  }

  function downloadTextFile(fileName, content, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleExportJson() {
    downloadTextFile('ditdit-progress.json', exportSessionHistoryJson(), 'application/json')
    setDataMessage('Exported progress as JSON.')
  }

  function handleExportCsv() {
    downloadTextFile('ditdit-progress.csv', exportSessionHistoryCsv(), 'text/csv')
    setDataMessage('Exported progress as CSV.')
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const shouldOverwrite = window.confirm(
      'Importing a backup replaces your current saved progress. Continue?'
    )
    if (!shouldOverwrite) {
      if (importInputRef.current) {
        importInputRef.current.value = ''
      }
      return
    }

    try {
      const text = await file.text()
      importSessionHistoryJson(text, { overwrite: true })
      setDataMessage('Imported progress backup successfully.')
    } catch (error) {
      setDataMessage(`Import failed: ${error instanceof Error ? error.message : 'invalid file'}`)
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = ''
      }
    }
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
        <SettingRow
          label="Attack"
          value={local.attackMs}
          min={0} max={50} step={1}
          display={`${local.attackMs} ms`}
          onChange={v => update('attackMs', v)}
        />
        <SettingRow
          label="Decay"
          value={local.decayMs}
          min={0} max={50} step={1}
          display={`${local.decayMs} ms`}
          onChange={v => update('decayMs', v)}
        />
        <SettingRow
          label="Frequency Variation"
          value={local.frequencyJitter}
          min={0} max={50} step={1}
          display={`±${local.frequencyJitter} Hz`}
          onChange={v => update('frequencyJitter', v)}
        />
        <ThemeRow
          value={local.theme || 'dark'}
          onChange={v => update('theme', v)}
        />
        <ToggleRow
          label="Large Text"
          value={Boolean(local.largeText)}
          onChange={v => update('largeText', v)}
        />
        <ToggleRow
          label="Reduce Motion"
          value={Boolean(local.reduceMotion)}
          onChange={v => update('reduceMotion', v)}
        />
        <ToggleRow
          label="Large Touch Targets"
          value={Boolean(local.largeTouchTargets)}
          onChange={v => update('largeTouchTargets', v)}
        />

        <div className="settings-data-tools">
          <p className="section-kicker">Data & Backup</p>
          <div className="settings-data-actions">
            <TouchButton size="sm" onClick={handleExportJson}>Export JSON</TouchButton>
            <TouchButton size="sm" onClick={handleExportCsv}>Export CSV</TouchButton>
            <TouchButton size="sm" variant="secondary" onClick={() => importInputRef.current?.click()}>
              Import Backup
            </TouchButton>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="settings-data-input"
              onChange={handleImportFile}
            />
          </div>
          {dataMessage && (
            <p className="setup-hint" role="status" aria-live="polite">{dataMessage}</p>
          )}
        </div>
      </div>
    </section>
  )
}
