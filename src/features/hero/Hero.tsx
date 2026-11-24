import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.heroGrid}>
        <div className={styles.copy} data-reveal>
          <div className={styles.availability}>
            <span className={styles.yearsBadge}>6+ YEARS</span>
            ROBLOX DEVELOPER <span className={styles.separator}>/</span> GENERALIST
          </div>
          <h1 id="hero-title">
            I bring every part of a Roblox game <span>together.</span>
          </h1>
          <p className={styles.intro}>
            I’m Ahmed, a 19-year-old Roblox developer. For 6+ years, I’ve worked across gameplay, UI, player data, plots, and the
            frameworks that connect them. Take a look at what I’ve shipped, then step inside how I build.
          </p>
          <div className={styles.actions}>
            <a className="button buttonPrimary" href="#work">
              Start with shipped work
            </a>
            <a className="button buttonQuiet" href="#systems">
              Step inside the systems
            </a>
          </div>

          <div className={styles.socialProof} data-reveal>
            <div className={styles.avatarStack} aria-hidden="true">
              <span>A</span><span>+</span><span>R</span>
            </div>
            <p><strong>4+ released experiences</strong><br />built with teams/studios</p>
          </div>
        </div>

        <div className={styles.visual} aria-label="A look into Ahmed's connected game systems" data-reveal>
          <div className={styles.visualTopline}>
            <span>SYSTEM MAP</span>
            <span className={styles.version}>AH / 01</span>
          </div>
          <div className={styles.map}>
            <div className={`${styles.node} ${styles.nodeProfile}`}>
              <span className={styles.nodeIcon}>CL</span>
              <span><strong>Client</strong><small>UI, input & listeners</small></span>
            </div>
            <span className={styles.connection} aria-hidden="true" />
            <div className={`${styles.node} ${styles.nodeWorld}`}>
              <span className={styles.nodeIcon}>API</span>
              <span><strong>Shared API</strong><small>One service interface</small></span>
            </div>
            <span className={styles.connection} aria-hidden="true" />
            <div className={`${styles.node} ${styles.nodePlay}`}>
              <span className={styles.nodeIcon}>SV</span>
              <span><strong>Server</strong><small>State & authority</small></span>
            </div>
          </div>
          <div className={styles.visualBottomline}>
            <span>SYSTEMS / UI / GAMEPLAY</span>
            <span>ROBLOX STUDIO</span>
          </div>
        </div>
      </div>

      <div className={styles.metrics}>
        <div data-reveal><strong>6+ years</strong><span>building in Roblox</span></div>
        <div data-reveal><strong>19.9M+</strong><span>reported visits across featured games</span></div>
        <div data-reveal><strong>6+</strong><span>frameworks and tools built</span></div>
      </div>
    </section>
  )
}
