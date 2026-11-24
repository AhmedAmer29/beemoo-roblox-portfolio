import type { CSSProperties } from 'react'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import styles from './About.module.css'

const principles = [
  {
    title: 'Understand the whole loop',
    text: 'I move comfortably between player-facing moments and the data, inventory, and plot systems supporting them.',
  },
  {
    title: 'Meet the team where it is',
    text: 'I’ve collaborated with other programmers across teams/studios, and I’ve also carried the programming role on my own.',
  },
  {
    title: 'Keep the parts connected',
    text: 'From client interactions to server-owned state, I care about making each piece feel like part of one experience.',
  },
  {
    title: 'Rojo workflows',
    text: 'I have experience using Rojo to organize Roblox project files and keep code in sync with Studio.',
  },
]

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <SectionHeading
        id="about-title"
        eyebrow="03 / Working together"
        title="Useful wherever the team needs me."
        description="Six-plus years across Roblox development means I can follow a feature from the player’s screen into the systems behind it—and collaborate across that whole path."
      />
      <div className={styles.grid}>
        {principles.map((principle, index) => (
          <article className={styles.card} key={principle.title} data-reveal style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties}>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
