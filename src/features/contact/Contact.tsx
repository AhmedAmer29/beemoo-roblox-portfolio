import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../../components/Icon/Icon'
import styles from './Contact.module.css'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

type RecaptchaApi = {
  ready: (callback: () => void) => void
  execute: (sitekey: string, options: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi
  }
}

const formEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim()
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim()

export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [copied, setCopied] = useState(false)
  const [captchaError, setCaptchaError] = useState('')
  const [captchaReady, setCaptchaReady] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!recaptchaSiteKey) return

    let cancelled = false
    let script = document.querySelector<HTMLScriptElement>('script[data-recaptcha-api]')

    const markReady = () => {
      const api = window.grecaptcha
      if (!api) {
        setCaptchaError('reCAPTCHA could not load. Refresh the page and try again.')
        return
      }

      api.ready(() => {
        if (cancelled) return
        setCaptchaError('')
        setCaptchaReady(true)
      })
    }

    const handleLoadError = () => {
      if (!cancelled) setCaptchaError('reCAPTCHA could not load. Check your connection and try again.')
    }

    if (window.grecaptcha) {
      markReady()
    } else if (script) {
      script.addEventListener('load', markReady)
      script.addEventListener('error', handleLoadError)
    } else {
      script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`
      script.async = true
      script.defer = true
      script.dataset.recaptchaApi = 'true'
      script.addEventListener('load', markReady)
      script.addEventListener('error', handleLoadError)
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      script?.removeEventListener('load', markReady)
      script?.removeEventListener('error', handleLoadError)
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!formEndpoint) {
      setFormError('The contact form is not connected yet.')
      setStatus('error')
      return
    }

    if (!recaptchaSiteKey || !captchaReady || !window.grecaptcha) {
      setFormError(captchaError || 'reCAPTCHA is still loading. Please wait a moment and try again.')
      setStatus('error')
      return
    }

    setFormError('')
    setStatus('sending')
    try {
      const token = await new Promise<string>((resolve, reject) => {
        const api = window.grecaptcha
        if (!api) {
          reject(new Error('reCAPTCHA is unavailable. Please refresh and try again.'))
          return
        }
        api.ready(() => {
          api.execute(recaptchaSiteKey, { action: 'submit' }).then(resolve, reject)
        })
      })
      const body = new FormData(form)
      body.set('g-recaptcha-response', token)

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
              href="https://www.roblox.com/search/users?keyword=beemoo29"
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
                  ? recaptchaSiteKey
                    ? captchaReady
                      ? 'Your email stays private. This form uses Formspree and invisible reCAPTCHA.'
                      : captchaError || 'Loading invisible reCAPTCHA…'
                    : 'The reCAPTCHA site key is not configured yet.'
                  : 'The contact form will be ready after the Formspree endpoint is added.'}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
