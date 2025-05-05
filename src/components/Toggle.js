import React, { useState } from 'react'

const Toggle = ({
  initial = false,
  onToggle = () => {},
  disabled = false,
  labels = { on: 'On', off: 'Off' }
}) => {
  const [state, setState] = useState(initial)

  const handleClick = () => {
    if (disabled) return
    const next = !state
    setState(next)
    onToggle(next)
  }

  const styles = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '1rem',
    background: state ? '#4caf50' : '#ccc',
    color: '#fff',
    outline: 'none'
  }

  return (
    <button
      type="button"
      style={styles}
      onClick={handleClick}
      disabled={disabled}
    >
      {state ? labels.on : labels.off}
    </button>
  )
}

export default Toggle
