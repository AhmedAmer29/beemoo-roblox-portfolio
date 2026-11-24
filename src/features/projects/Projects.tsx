import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { inProgressProject, projects } from '../../data/projects'
import { ProjectCard } from './ProjectCard'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <SectionHeading
        id="work-title"
        eyebrow="01 / The work"
        title="Start with what shipped."
        description="Selected released experiences built with teams/studios and as a solo programmer."
        aside={<span className={styles.workCount}>4+ RELEASED EXPERIENCES</span>}
      />
      <div className={styles.grid}>
        {projects.map((project, index) => <ProjectCard key={project.title} project={project} revealDelay={`${index * 90}ms`} />)}
      </div>

      <div className={styles.commissionWork} data-reveal>
        <div className={styles.commissionMark} aria-hidden="true">CW</div>
        <div className={styles.commissionCopy}>
          <span className={styles.commissionEyebrow}>BEYOND PUBLISHED GAMES</span>
          <h3>Commission work</h3>
          <p>I’ve also helped teams with existing projects through bug fixes, system additions, integrations, and polish.</p>
        </div>
        <div className={styles.commissionTags} aria-label="Commission work examples">
          <span>Bug fixes</span>
          <span>System additions</span>
          <span>Polish & support</span>
        </div>
      </div>

      <div className={styles.nextProject} data-reveal>
        <div className={styles.nextIcon}><span>DT</span></div>
        <div className={styles.nextCopy}>
          <div className={styles.nextMeta}><span>THE NEXT CHAPTER</span><span>IN DEVELOPMENT</span></div>
          <h3>{inProgressProject.title}</h3>
          <p>{inProgressProject.contribution}</p>
        </div>
        <div className={styles.nextBadge}><i />In development</div>
      </div>

      <div className={styles.exploration} data-reveal>
        <div className={styles.explorationMark} aria-hidden="true">R&amp;D</div>
        <div className={styles.explorationCopy}>
          <span className={styles.explorationEyebrow}>WHAT I’M EXPLORING</span>
          <h3>Grounded worlds and medieval combat</h3>
          <p>I want to create more realistic-style games, including medieval combat systems. I’ve been experimenting with a medieval combat system on my own as a personal project.</p>
        </div>
        <span className={styles.explorationTag}>Personal project</span>
      </div>
    </section>
  )
}
