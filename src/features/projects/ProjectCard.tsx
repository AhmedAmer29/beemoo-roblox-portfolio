import type { CSSProperties } from 'react'
import type { Project } from '../../types/portfolio'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: Project
  revealDelay?: string
}

export function ProjectCard({ project, revealDelay = '0ms' }: ProjectCardProps) {
  const revealStyle = { '--reveal-delay': revealDelay } as CSSProperties
  const content = (
    <>
      <div className={styles.imageWrap}>
        {project.image ? (
          <img src={project.image} alt={project.imageAlt ?? ''} loading="lazy" />
        ) : (
          <div className={styles.placeholder} aria-hidden="true"><span>DT</span></div>
        )}
        {project.url && <span className={styles.external}>ROBLOX</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.status}><i />{project.status}</span>
          <span>{project.visits}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.contribution}</p>
        <div className={styles.footer}>
          <span>{project.collaboration}</span>
          <span className={styles.viewLink}>Open on Roblox</span>
        </div>
      </div>
    </>
  )

  return project.url ? (
    <a
      className={`${styles.card} ${project.featured ? styles.featured : ''}`}
      data-reveal
      style={revealStyle}
      href={project.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`View ${project.title} on Roblox`}
    >
      {content}
    </a>
  ) : (
    <article className={`${styles.card} ${styles.developmentCard}`} data-reveal style={revealStyle}>
      {content}
    </article>
  )
}
