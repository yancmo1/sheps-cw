export default function TouchButton({ children, onClick, variant = 'primary', size = 'normal', disabled = false }) {
  const cls = [
    'touch-button',
    `touch-button-${variant}`,
    size === 'sm' ? 'touch-button-sm' : '',
  ].filter(Boolean).join(' ')

  return (
    <button className={cls} type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
