type IconName = 'menu' | 'close' | 'copy' | 'check'

type IconProps = {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  if (name === 'menu') {
    return (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    )
  }
  if (name === 'close') {
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    )
  }
  if (name === 'copy') {
    return (
      <svg {...common}>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}
