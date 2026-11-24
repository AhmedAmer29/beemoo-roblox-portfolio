import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
  id?: string
  eyebrow: string
  title: string
  description?: string
  aside?: ReactNode
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  aside,
}: SectionHeadingProps) {
  return (
    <div className={styles.heading} data-reveal>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  )
}
