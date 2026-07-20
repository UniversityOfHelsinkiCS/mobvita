import React, { useState } from 'react'
import AppButton from 'Components/AppButton'
import AppProgressBar from 'Components/AppProgressBar'
import AppTextField from 'Components/ui/AppTextField'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
import AppDialog from 'Components/ui/AppDialog'
import LoginForm from 'Components/AccessControl/LoginForm'
import SignUpForm from 'Components/AccessControl/SignUpForm'
import { images } from 'Utilities/common'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * DesignSystem (/design) — dev-only live gallery of the design system.
 *
 * Renders every ui/ primitive and each pure presentational component in all of its states, inside
 * the real app (real MUI theme, IntlProvider, CSS). Replaces Storybook. Add a row here whenever a
 * new primitive or presentational component lands.
 */
const Section = ({ title, children }) => (
  <section style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.3em', marginBottom: '1em' }}>
      {title}
    </h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
      {children}
    </div>
  </section>
)

const Card = ({ children }) => (
  <div
    style={{
      backgroundColor: colors.card,
      borderRadius: shape.cardRadius,
      padding: shape.cardPadding,
      width: 360,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
)

const DesignSystem = () => {
  const [login, setLogin] = useState({ email: '', password: '', remember: false })
  const [signup, setSignup] = useState({ email: '', username: '', password: '', passwordAgain: '' })
  const [accepted, setAccepted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '2rem', fontFamily: font.family }}>
      <h1>Design System</h1>
      <p style={{ color: '#666' }}>
        Live gallery of <code>ui/</code> primitives and pure presentational components. Dev-only —
        this is where we review new components and token changes against the Figma.
      </p>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <AppButton size="sm" variant="secondary" onClick={() => setPending(p => !p)}>
          Toggle pending
        </AppButton>
        <AppButton size="sm" variant="secondary" onClick={() => setError(e => !e)}>
          Toggle error
        </AppButton>
      </div>

      <Section title="AppButton — variants (current theme)">
        <AppButton variant="primary">Primary</AppButton>
        <AppButton variant="secondary">Secondary</AppButton>
        <AppButton variant="danger">Danger</AppButton>
        <AppButton variant="success">Success</AppButton>
        <AppButton variant="outline-primary">Outline</AppButton>
        <AppButton variant="link">Link</AppButton>
        <AppButton variant="primary" disabled>
          Disabled
        </AppButton>
      </Section>

      <Section title="AppTextField">
        <div style={{ width: 240 }}>
          <AppTextField label="Email" placeholder="you@example.com" />
        </div>
        <div style={{ width: 240 }}>
          <AppTextField label="Password" type="password" placeholder="Password" />
        </div>
        <div style={{ width: 240 }}>
          <AppTextField label="Error state" error placeholder="Invalid" />
        </div>
        <div style={{ width: 240 }}>
          <AppTextField label="Disabled" disabled placeholder="Disabled" />
        </div>
      </Section>

      <Section title="AppMenu (click the burger)">
        <AppMenu
          trigger={
            <img
              src={images.menu2}
              alt="menu"
              style={{ width: 24, height: 24, cursor: 'pointer', display: 'block' }}
            />
          }
          closeIcon={<img src={images.xClose} alt="close" />}
        >
          <AppMenuItem
            icon={<img src={images.helpCircle} alt="" style={{ width: 22, height: 22 }} />}
          >
            Help
          </AppMenuItem>
          <AppMenuItem
            icon={<img src={images.asterisk02} alt="" style={{ width: 22, height: 22 }} />}
          >
            About Revita
          </AppMenuItem>
          <AppMenuItem icon={<img src={images.mail05} alt="" style={{ width: 22, height: 22 }} />}>
            Contact Us
          </AppMenuItem>
          <AppMenuItem
            icon={<img src={images.alertCircle} alt="" style={{ width: 22, height: 22 }} />}
          >
            Terms &amp; Conditions, Privacy Policy
          </AppMenuItem>
        </AppMenu>
      </Section>

      <Section title="AppDialog">
        <AppButton variant="primary" onClick={() => setDialogOpen(true)}>
          Open dialog
        </AppButton>
        <AppDialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Example dialog">
          <p style={{ color: colors.ink }}>
            This is an AppDialog — cream card, ink text, Geologica, rounded corners, close button.
            Long content scrolls inside while the title stays fixed.
          </p>
        </AppDialog>
      </Section>

      <Section title="AppProgressBar">
        <div style={{ width: 300 }}>
          <AppProgressBar now={35} label="35%" />
        </div>
        <div style={{ width: 300 }}>
          <AppProgressBar now={100} label="Done" variant="success" />
        </div>
      </Section>

      <Section title="LoginForm (presentational)">
        <Card>
          <LoginForm
            email={login.email}
            password={login.password}
            onEmailChange={v => setLogin(s => ({ ...s, email: v }))}
            onPasswordChange={v => setLogin(s => ({ ...s, password: v }))}
            onSubmit={() => {}}
            onForgotPassword={() => {}}
            onSwitchToSignUp={() => {}}
            onTryRevita={() => {}}
            rememberMe={login.remember}
            onRememberMeChange={v => setLogin(s => ({ ...s, remember: v }))}
            pending={pending}
            error={error}
            errorMessage="Invalid credentials"
          />
        </Card>
      </Section>

      <Section title="SignUpForm (presentational)">
        <Card>
          <SignUpForm
            email={signup.email}
            username={signup.username}
            password={signup.password}
            passwordAgain={signup.passwordAgain}
            onFieldChange={(name, v) => setSignup(s => ({ ...s, [name]: v }))}
            onSubmit={() => {}}
            onSwitchToLogin={() => {}}
            accepted={accepted}
            onAcceptedChange={setAccepted}
            pending={pending}
            error={error}
            errorMessage="Please check the highlighted fields"
          />
        </Card>
      </Section>
    </div>
  )
}

export default DesignSystem
