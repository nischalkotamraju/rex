interface IconProps {
  size?: number
  color?: string
  style?: React.CSSProperties
}

function icon(path: string | string[], viewBox = '0 0 24 24') {
  return function Icon({ size = 16, color = 'currentColor', style }: IconProps) {
    const paths = Array.isArray(path) ? path : [path]
    return (
      <svg width={size} height={size} viewBox={viewBox} fill={color} style={{ display: 'block', flexShrink: 0, ...style }}>
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    )
  }
}

export const ClockIcon    = icon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z')
export const CalendarIcon = icon('M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z')
export const ReplyIcon    = icon('M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z')
export const DocumentIcon = icon('M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z')
export const CheckIcon    = icon('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z')
export const SparkleIcon  = ({ size = 16, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block', flexShrink: 0, ...style }}>
    <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"/>
  </svg>
)
