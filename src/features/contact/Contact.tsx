import { useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../../components/Icon/Icon'
import styles from './Contact.module.css'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

const formEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim()

export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [copied, setCopied] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!formEndpoint) {
      setFormError('The contact form is not connected yet.')
      setStatus('error')
      return
    }

    setFormError('')
    setStatus('sending')
    try {
      const body = new FormData(form)

      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      })

      const result = await response.json().catch(() => null) as { errors?: Array<{ message?: string }> } | null
      if (!response.ok) {
        const message = result?.errors?.map((error) => error.message).filter(Boolean).join(' ')
        throw new Error(message || 'Please try again, or reach out to me on Discord.')
      }
      form.reset()
      setStatus('sent')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Please try again, or reach out to me on Discord.')
      setStatus('error')
    }
  }

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText('beemoo29')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className={styles.panel} data-reveal>
        <div className={styles.contactIntro}>
          <p className={styles.eyebrow}>Have a project in mind?</p>
          <h2 id="contact-title">Your next build <span>starts here.</span></h2>
          <p className={styles.description}>
            Tell me what you’re building, where your team needs help, and what the next milestone looks like. I’d love to hear about it.
          </p>
          <div className={styles.socials}>
            <button className={styles.discordButton} onClick={copyDiscord} type="button">
              <span className={styles.discordMark}>D</span>
              <span><small>DISCORD</small><strong>beemoo29</strong></span>
              <span className={styles.copyIcon}><Icon name={copied ? 'check' : 'copy'} size={15} /></span>
            </button>
            <a
              className={styles.robloxLink}
              href="https://www.roblox.com/users/1204264807/profile"
              target="_blank"
              rel="noreferrer"
            >
              Roblox profile
            </a>
          </div>
          <p className={styles.copyStatus} aria-live="polite">{copied ? 'Username copied to clipboard' : ''}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <span>Your name</span>
            <input autoComplete="name" name="name" placeholder="How should I address you?" required />
          </label>
          <label>
            <span>Your email</span>
            <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
          </label>
          <label>
            <span>What are you building?</span>
            <textarea name="message" placeholder="A few details about your project, team, or role…" required rows={4} />
          </label>
          <button className="button buttonPrimary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'sent' ? (
            <div className={`${styles.formNotice} ${styles.formNoticeSuccess}`} role="status" aria-live="polite">
              <span className={styles.formNoticeIcon}><Icon name="check" size={18} /></span>
              <span className={styles.formNoticeCopy}>
                <strong>Message sent!</strong>
                <span>Thanks for reaching out — I’ll be in touch soon.</span>
              </span>
            </div>
          ) : status === 'error' ? (
            <div className={`${styles.formNotice} ${styles.formNoticeError}`} role="alert">
              <span className={styles.formNoticeIcon}><Icon name="close" size={17} /></span>
              <span className={styles.formNoticeCopy}>
                <strong>Couldn’t send your message</strong>
                <span>{formError || 'Please try again, or reach out to me on Discord.'}</span>
              </span>
            </div>
          ) : (
            <p className={styles.formNote} aria-live="polite">
              {status === 'sending'
                ? 'Sending your message…'
                : formEndpoint
                  ? 'Your email stays private. This form sends through Formspree.'
                  : 'The contact form will be ready after the Formspree endpoint is added.'}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
