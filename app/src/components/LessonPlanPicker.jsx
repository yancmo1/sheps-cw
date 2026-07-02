import { useState, useRef, useEffect } from 'react'

/**
 * Custom touch-friendly picker for Learning Plans.
 * Replaces native <select> with a dropdown that has proper touch targets (min 48px).
 */
export default function LessonPlanPicker({ value, options, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef(null)
  const toggleRef = useRef(null)

  const selectedOption = options.find(opt => opt.path === value)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
    toggleRef.current?.focus()
  }

  const handleToggleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="plan-picker" ref={pickerRef}>
      <button
        ref={toggleRef}
        type="button"
        className="plan-picker-toggle"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleToggleKeyDown}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="plan-picker-label">{selectedOption?.path || 'Select...'}</span>
        <span className="plan-picker-arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="plan-picker-dropdown" role="listbox">
          {options.map((option) => (
            <button
              key={option.path}
              type="button"
              className={`plan-picker-option${value === option.path ? ' plan-picker-option-active' : ''}`}
              onClick={() => handleSelect(option.path)}
              role="option"
              aria-selected={value === option.path}
            >
              {option.path}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
