interface IconProps {
  name: string
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}
