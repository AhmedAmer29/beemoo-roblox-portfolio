import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../../components/Icon/Icon'
import styles from './Contact.module.css'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error' | 'captcha'

type RecaptchaApi = {
  ready: (callback: () => void) => void
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    },
  ) => number
  reset: (widgetId?: number) => void
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
  const [formError, setFormError] = useState('')
  const captchaContainer = useRef<HTMLDivElement>(null)
  const captchaToken = useRef('')
  const captchaWidget = useRef<number | null>(null)

  useEffect(() => {
    if (!recaptchaSiteKey || !captchaContainer.current) return

    let cancelled = false
    let script = document.querySelector<HTMLScriptElement>('script[data-recaptcha-api]')

    const renderWidget = () => {
      const api = window.grecaptcha
      if (!api) {
        setCaptchaError('reCAPTCHA could not load. Refresh the page and try again.')
        return
      }

      api.ready(() => {
        if (cancelled || !captchaContainer.current || captchaWidget.current !== null) return

        try {
          captchaWidget.current = api.render(captchaContainer.current, {
            sitekey: recaptchaSiteKey,
            callback: (token) => {
              captchaToken.current = token
              setCaptchaError('')
              setStatus((current) => current === 'captcha' ? 'idle' : current)
            },
            'expired-callback': () => { captchaToken.current = '' },
            'error-callback': () => {
              captchaToken.current = ''
              setCaptchaError('reCAPTCHA could not verify this page. Check the site key and allowed domain.')
            },
          })
        } catch {
          setCaptchaError('reCAPTCHA could not start. Check the site key and allowed domain.')
        }
      })
    }

    const handleLoadError = () => {
      if (!cancelled) setCaptchaError('reCAPTCHA could not load. Check your connection and try again.')
    }

    if (window.grecaptcha) {
      renderWidget()
    } else if (script) {
      script.addEventListener('load', renderWidget)
      script.addEventListener('error', handleLoadError)
    } else {
      script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.recaptchaApi = 'true'
      script.addEventListener('load', renderWidget)
      script.addEventListener('error', handleLoadError)
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      script?.removeEventListener('load', renderWidget)
      script?.removeEventListener('error', handleLoadError)
    }
  }, [])

  function resetCaptcha() {
    captchaToken.current = ''
    if (captchaWidget.current !== null) window.grecaptcha?.reset(captchaWidget.current)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!formEndpoint) {
      setFormError('The contact form is not connected yet.')
      setStatus('error')
      return
    }

    if (recaptchaSiteKey && !captchaToken.current) {
      setStatus('captcha')
      return
    }

    setFormError('')
    setStatus('sending')
    try {
      const body = new FormData(form)
      if (recaptchaSiteKey) body.set('g-recaptcha-response', captchaToken.current)

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
      resetCaptcha()
      setStatus('sent')
    } catch (error) {
      resetCaptcha()
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
          {recaptchaSiteKey ? (
            <div className={styles.captchaField}>
              <div className={styles.captchaWidget} ref={captchaContainer} />
              {captchaError && <p className={styles.captchaError} role="alert">{captchaError}</p>}
            </div>
          ) : (
            <p className={styles.captchaError} role="alert">The reCAPTCHA site key is not configured yet.</p>
          )}
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
          ) : status === 'captcha' ? (
            <div className={`${styles.formNotice} ${styles.formNoticeError}`} role="alert">
              <span className={styles.formNoticeIcon}><Icon name="close" size={17} /></span>
              <span className={styles.formNoticeCopy}>
                <strong>Complete the security check</strong>
                <span>Tick the reCAPTCHA box before sending your message.</span>
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
