import { useEffect } from 'react'
import { Header } from '../features/navigation/Header'
import { Hero } from '../features/hero/Hero'
import { Projects } from '../features/projects/Projects'
import { Systems } from '../features/systems/Systems'
import { About } from '../features/about/About'
import { Contact } from '../features/contact/Contact'
import styles from './App.module.css'

export default function App() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const showAll = () => items.forEach((item) => item.classList.add('is-revealed'))

    if (!('IntersectionObserver' in window)) {
      showAll()
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.06, rootMargin: '0px 0px -8% 0px' })

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Hero />
        <Projects />
        <Systems />
        <About />
        <Contact />
      </main>
      <footer className={styles.footer} data-reveal>
        <a href="#top" className={styles.footerBrand}><span>a.</span> Ahmed</a>
        <p>Roblox developer — building systems and experiences.</p>
        <span className={styles.copyright}>© {new Date().getFullYear()} AHMED</span>
      </footer>
    </>
  )
}
