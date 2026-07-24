import React, { useState } from 'react'
import MicNoneIcon from '@mui/icons-material/MicNone'
import AppButton from 'Components/AppButton'
import AppProgressBar from 'Components/AppProgressBar'
import AppTextField from 'Components/ui/AppTextField'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
import AppDialog from 'Components/ui/AppDialog'
import AppActionCard from 'Components/ui/AppActionCard'
import ChatBubble from 'Components/ui/ChatBubble'
import ChatInput from 'Components/ui/ChatInput'
import AppSelect from 'Components/ui/AppSelect'
import EloChart from 'Components/HomeView/EloChart'
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
  const [chatMessage, setChatMessage] = useState('')
  const [selectValue, setSelectValue] = useState('')

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

      <Section title="AppButton — design variants (active / disabled)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['tan', 'contrast', 'contrast-outline', 'tan-outline', 'danger', 'link'].map(v => (
            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 130, color: '#666', fontSize: 13 }}>{v}</span>
              <AppButton variant={v}>
                <MicNoneIcon />
                Button L
              </AppButton>
              <AppButton variant={v} disabled>
                <MicNoneIcon />
                Button L
              </AppButton>
            </div>
          ))}
        </div>
      </Section>

      <Section title="AppButton — sizes (sm / md / lg)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <AppButton variant="tan" size="sm">Button</AppButton>
          <AppButton variant="tan">Button</AppButton>
          <AppButton variant="tan" size="lg">Button</AppButton>
        </div>
      </Section>

      <Section title="AppButton — inverse (dark background)">
        <div
          style={{
            display: 'flex',
            gap: 14,
            padding: 24,
            borderRadius: 16,
            backgroundColor: colors.ink,
          }}
        >
          <AppButton variant="inverse">
            <MicNoneIcon />
            Button L
          </AppButton>
          <AppButton variant="inverse" disabled>
            <MicNoneIcon />
            Button L
          </AppButton>
        </div>
      </Section>

      <Section title="AppButton — legacy aliases (should match design variants)">
        <AppButton variant="primary">primary → tan</AppButton>
        <AppButton variant="secondary">secondary → contrast</AppButton>
        <AppButton variant="outline">outline → contrast-outline</AppButton>
        <AppButton variant="link">link</AppButton>
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

      <Section title="AppActionCard">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420 }}>
          <AppActionCard icon={<img src={images.wavesColored} alt="" />}>Dive in</AppActionCard>
          <AppActionCard icon={<img src={images.layersThreeColored} alt="" />}>
            Flashcards
          </AppActionCard>
          <AppActionCard icon={<img src={images.libraryBigColored} alt="" />} disabled>
            Disabled
          </AppActionCard>
        </div>
      </Section>

      <Section title="AppSelect — variants (active / disabled)">
        {(() => {
          const opts = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' },
          ]
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['tan', 'contrast', 'contrast-outline', 'tan-outline'].map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 130, color: '#666', fontSize: 13 }}>{v}</span>
                  <div style={{ width: 220 }}>
                    <AppSelect
                      variant={v}
                      value={selectValue}
                      onChange={setSelectValue}
                      options={opts}
                    />
                  </div>
                  <div style={{ width: 220 }}>
                    <AppSelect variant={v} disabled options={opts} />
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </Section>

      <Section title="AppSelect — inverse (dark background)">
        <div style={{ padding: 24, borderRadius: 16, backgroundColor: colors.ink, width: 300 }}>
          <AppSelect
            variant="inverse"
            value={selectValue}
            onChange={setSelectValue}
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' },
            ]}
          />
        </div>
      </Section>

      <Section title="ChatBubble variants">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: 340,
            padding: 16,
            backgroundColor: colors.card,
            borderRadius: 16,
          }}
        >
          <ChatBubble variant="bot">Hi! I&apos;m Vita. Ask me anything.</ChatBubble>
          <ChatBubble variant="user">How is my progress?</ChatBubble>
          <ChatBubble variant="hint">A hint to help you along.</ChatBubble>
          <ChatBubble variant="note">Feedback note about your sentence.</ChatBubble>
          <ChatBubble variant="user-note" onRemove={() => {}}>
            My own note (removable).
          </ChatBubble>
        </div>
      </Section>

      <Section title="ChatInput">
        <div style={{ width: 340, padding: 16, backgroundColor: colors.card, borderRadius: 16 }}>
          <ChatInput
            value={chatMessage}
            onChange={setChatMessage}
            onSubmit={() => setChatMessage('')}
            placeholder="Ask Assistant…"
          />
        </div>
      </Section>

      <Section title="Progress card (EloChart — connected)">
        <div style={{ width: 380 }}>
          <EloChart width="100%" />
        </div>
      </Section>

      <Section title="AppCheckbox">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppCheckbox defaultChecked /> Checked
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppCheckbox /> Unchecked
        </label>
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
