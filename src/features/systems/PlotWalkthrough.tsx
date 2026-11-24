import { useState } from 'react'
import { plotWalkthrough } from '../../data/plotWalkthrough'
import { CodeBlock } from './CodeBlock'
import styles from './PlotWalkthrough.module.css'

export function PlotWalkthrough() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = plotWalkthrough[selectedIndex]

  return (
    <article className={styles.walkthrough} aria-labelledby="plot-walkthrough-title">
      <header className={styles.heading} data-reveal>
        <p className={styles.eyebrow}>A closer look / PlotService</p>
        <h3 id="plot-walkthrough-title">A plot is more than a piece of land.</h3>
        <p>It connects a player’s data, a place in the world, and the features running inside it. Here’s how I bring those parts together in my startup framework.</p>
      </header>

      <div className={styles.flow} aria-label="Plot lifecycle" data-reveal>
        <span>Choose runtime</span><span>Assign on server</span><span>Resolve on client</span><span>Clean up</span>
      </div>

      <div className={styles.explorer} data-reveal>
        <div className={styles.steps} role="group" aria-label="Explore the PlotService implementation">
          {plotWalkthrough.map((step, index) => (
            <button key={step.id} type="button" aria-pressed={index === selectedIndex}
              aria-controls="plot-walkthrough-detail" onClick={() => setSelectedIndex(index)}>
              <span className={styles.stepCategory}>{step.category}</span>
              <strong>{step.title}</strong>
              <span>{step.teaser}</span>
            </button>
          ))}
        </div>

        <div className={styles.detail} id="plot-walkthrough-detail">
          <div className={styles.explanation} key={`${selected.id}-copy`}>
            <span className={styles.eyebrow}>{selected.category}</span>
            <h4>{selected.title}</h4>
            <p>{selected.description}</p>
            <div className={styles.decision}><strong>Why this choice</strong><p>{selected.decision}</p></div>
          </div>
          <div className={styles.sourceHeader}><span>{selected.file}</span><span>Luau / source excerpt</span></div>
          <div key={`${selected.id}-code`}><CodeBlock code={selected.code} /></div>
        </div>
      </div>

      <p className={styles.sourceNote} data-reveal>Implementation excerpts from my PlotService startup files, trimmed to the relevant functions. The runtime wrapper shares an entry point; requiring Server or Client directly preserves their specific type information.</p>
    </article>
  )
}
