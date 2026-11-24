import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Icon } from '../../components/Icon/Icon'
import styles from './Header.module.css'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#systems', label: 'Under the hood' },
  { href: '#about', label: 'How I work' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrollFrame = useRef<number | null>(null)

  function closeMenu() {
    setMenuOpen(false)
  }

  function scrollToAnchor(event: MouseEvent<HTMLAnchorElement>) {
    const href = event.currentTarget.getAttribute('href')
    if (!href?.startsWith('#')) return

    const target = document.getElementById(href.slice(1))
    if (!target) return

    event.preventDefault()
    closeMenu()
    if (window.location.hash !== href) window.history.pushState(null, '', href)

    if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current)

    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'

    const start = window.scrollY
    const style = window.getComputedStyle(target)
    const scrollPadding = Number.parseFloat(window.getComputedStyle(root).scrollPaddingTop) || 0
    const scrollMargin = Number.parseFloat(style.scrollMarginTop) || 0
    const destination = target.getBoundingClientRect().top + start - scrollPadding - scrollMargin
    const distance = destination - start
    const duration = Math.min(1000, Math.max(420, Math.abs(distance) * 0.26))
    const startTime = performance.now()

    function animateScroll(time: number) {
      const progress = Math.min(1, (time - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      window.scrollTo(0, start + distance * eased)

      if (progress < 1) {
        scrollFrame.current = window.requestAnimationFrame(animateScroll)
      } else {
        scrollFrame.current = null
        root.style.scrollBehavior = previousScrollBehavior
      }
    }

    scrollFrame.current = window.requestAnimationFrame(animateScroll)
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" onClick={scrollToAnchor} aria-label="b home">
          <span className={styles.mark}>b.</span>
          <span>b</span>
        </a>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>

        <nav
          id="primary-navigation"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
          aria-label="Primary navigation"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={scrollToAnchor}>
              {link.label}
            </a>
          ))}
          <a className={styles.contactLink} href="#contact" onClick={scrollToAnchor}>
            Let’s talk
          </a>
        </nav>
      </div>
    </header>
  )
}
