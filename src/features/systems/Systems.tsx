import { useState } from 'react'
import { Icon } from '../../components/Icon/Icon'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { frameworks } from '../../data/frameworks'
import { CodeBlock } from './CodeBlock'
import { PlotWalkthrough } from './PlotWalkthrough'
import styles from './Systems.module.css'

type Runtime = 'server' | 'client'

export function Systems() {
  const [selectedId, setSelectedId] = useState(frameworks[0].id)
  const [runtime, setRuntime] = useState<Runtime>('server')
  const [copied, setCopied] = useState(false)
  const selected = frameworks.find((framework) => framework.id === selectedId) ?? frameworks[0]
  const code = runtime === 'server' ? selected.serverCode : selected.clientCode
  const runtimeSummary = runtime === 'server' ? selected.serverSummary : selected.clientSummary

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="section sectionTint" id="systems" aria-labelledby="systems-title">
      <SectionHeading
        id="systems-title"
        eyebrow="02 / Under the hood"
        title="One system. Two sides."
        description="The framework isn’t just a folder of modules. It gives server and client code a clear way to work together, while keeping authority and data in the right place."
      />

      <div className={styles.bridge} data-reveal>
        <div className={styles.bridgeNode}>
          <span>01 / CLIENT</span>
          <strong>Reads · listens · displays</strong>
        </div>
        <span className={styles.bridgeLine} aria-hidden="true" />
        <div className={`${styles.bridgeNode} ${styles.bridgeCore}`}>
          <span>ONE FRAMEWORK PATH</span>
          <strong>Typed API · remotes · replication</strong>
        </div>
        <span className={styles.bridgeLine} aria-hidden="true" />
        <div className={styles.bridgeNode}>
          <span>02 / SERVER</span>
          <strong>Validates · owns · updates</strong>
        </div>
      </div>

      <p className={styles.bridgeNote} data-reveal>
        On require, the framework detects its runtime and provides the matching implementation. The call site stays familiar; each side gets the responsibilities it should own.
      </p>

      <div className={styles.layout}>
        <div className={styles.frameworkList} role="tablist" aria-label="Framework examples" aria-orientation="vertical" data-reveal>
          {frameworks.map((framework) => (
            <button
              className={`${styles.frameworkTab} ${framework.id === selected.id ? styles.active : ''}`}
              id={`tab-${framework.id}`}
              key={framework.id}
              type="button"
              role="tab"
              aria-selected={framework.id === selected.id}
              aria-controls="framework-preview"
              onClick={() => setSelectedId(framework.id)}
            >
              <span className={styles.tabText}><strong>{framework.name}</strong><small>{framework.category}</small></span>
              <span className={styles.tabIndicator} aria-hidden="true">{framework.id === selected.id ? '•' : ''}</span>
            </button>
          ))}
        </div>

        <div className={styles.preview} id="framework-preview" role="tabpanel" aria-labelledby={`tab-${selected.id}`} data-reveal>
          <div className={styles.previewTop}>
            <div><span className={styles.windowDot} /><span className={styles.windowDot} /><span className={styles.windowDot} /></div>
            <span>{selected.name} / API</span>
            <span className={styles.language}>{selected.language}</span>
          </div>
          <div className={styles.previewBody} key={selected.id}>
            <div className={styles.previewIntro}>
              <div className={styles.previewIndex}>/ {selected.category}</div>
              <h3>{selected.name}</h3>
              <p>{selected.summary}</p>
              <div className={styles.capabilities}>
                {selected.capabilities.map((capability) => <span key={capability}>{capability}</span>)}
              </div>
            </div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <div className={styles.runtimeSwitch} role="group" aria-label="Choose client or server code">
                  <button type="button" aria-pressed={runtime === 'server'} onClick={() => setRuntime('server')}>Server</button>
                  <button type="button" aria-pressed={runtime === 'client'} onClick={() => setRuntime('client')}>Client</button>
                </div>
                <button className={styles.copyButton} type="button" onClick={copySnippet} aria-label="Copy code snippet">
                  <Icon name={copied ? 'check' : 'copy'} size={14} /> {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className={styles.runtimeView} key={`${selected.id}-${runtime}`}>
                <div className={styles.runtimeDescription}>
                  <span>{runtime === 'server' ? 'SERVER-SIDE' : 'CLIENT-SIDE'}</span>
                  <p>{runtimeSummary}</p>
                </div>
                <CodeBlock code={code} />
              </div>
            </div>
          </div>
          <div className={styles.previewBottom}><span>PERSONAL TOOLING</span><span>LUAU <i>●</i></span></div>
        </div>
      </div>
      <p className={styles.codeNote} data-reveal>Samples are short excerpts and usage patterns from my startup project, lightly edited for readability. Switch between client and server to see how the APIs meet.</p>
      <PlotWalkthrough />
    </section>
  )
}
