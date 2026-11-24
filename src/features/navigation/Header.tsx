import { useState } from 'react'
import { Icon } from '../../components/Icon/Icon'
import styles from './Header.module.css'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#systems', label: 'Under the hood' },
  { href: '#about', label: 'How I work' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" onClick={closeMenu} aria-label="BeeMoO home">
          <span className={styles.mark}>b.</span>
          <span>BeeMoO</span>
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
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a className={styles.contactLink} href="#contact" onClick={closeMenu}>
            Let’s talk
          </a>
        </nav>
      </div>
    </header>
  )
}
