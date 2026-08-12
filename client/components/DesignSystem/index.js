import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import MicNoneIcon from '@mui/icons-material/MicNone'
import AppButton from 'Components/AppButton'
import AppProgressBar from 'Components/ui/AppProgressBar'
import AppTextField from 'Components/ui/AppTextField'
import AppSearchField from 'Components/ui/AppSearchField'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppRadio from 'Components/ui/AppRadio'
import AppTable from 'Components/ui/AppTable'
import { RadioGroup, FormControlLabel, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
import AppDialog from 'Components/ui/AppDialog'
import AppActionCard from 'Components/ui/AppActionCard'
import ChatBubble from 'Components/ui/ChatBubble'
import ChatInput from 'Components/ui/ChatInput'
import AppToast from 'Components/ui/AppToast'
import AppSelect from 'Components/ui/AppSelect'
import AppSwitch from 'Components/ui/AppSwitch'
import AppThemeSwitch from 'Components/ui/AppThemeSwitch'
import AppTabs from 'Components/ui/AppTabs'
import AppPagination from 'Components/ui/AppPagination'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
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
  const [searchDemo, setSearchDemo] = useState('Kalevala')
  const [tab, setTab] = useState('public')
  const [switchOn, setSwitchOn] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [radioValue, setRadioValue] = useState('a')
  const [pageDemo, setPageDemo] = useState(3)

  // /design is a dev-only tool. Hide it behind a 404 for anyone without full developer scope
  // (same gate as the /dashboard admin page). Wait for the user fetch so we don't flash a 404.
  const developerScope = useSelector(state => state.user?.data?.user?.developer_of_language)
  const userPending = useSelector(state => state.user?.pending)
  if (userPending) return null
  if (developerScope !== 'all') return <Navigate to="/404" replace />

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

      <Section title="Icons — custom SVGs (new)">
        {(() => {
          const newIcons = [
            'menu2',
            'buttonCircle',
            'sendActive',
            'sendInactive',
            'circleSettings',
            'settingsContrast',
            'helpCircle',
            'asterisk02',
            'mail05',
            'alertCircle',
            'xClose',
            'activityHeart',
            'bookmark',
            'bookOpen',
            'cardsIcon',
            'fileCheck',
            'flag01',
            'grid01',
            'iconEdit',
            'trash03',
            'bell04',
            'brush01',
            'logOut01',
            'settings02',
            'user01',
            'users01',
            'edit03',
            'fileCheck03',
            'target04',
            'trophy01',
            'waves',
            'place1',
            'place2',
            'place3',
            'flipBackward',
            'folder',
            'folderPlus',
            'bookOpenGreen',
            'bulb',
            'bulbEmpty',
            'star06',
            'globe',
            'upload',
            'paste',
            'play',
            'star06Pick',
            'lock01',
            'globe02',
            'users01Pick',
            'brush01Pick',
            'globe04',
            'microscope',
            'trophy01Pick',
            'faceCorrect',
            'faceIncorrect',
            'faceNeutral',
            'flip',
            'speaker',
            'wordnest',
            'bulb',
            'bulbEmpty',
            'plusOutline',
            'quick',
            'translate01',
            'dotpoints01',
            'playCircle',
            'arrowRight',
            'checkCircle',
            'question',
            'iconHome',
            'layersThree',
            'libraryBig',
            'rocket',
            'route',
            'universityOfHelsinki',
            'playCircleColored',
            'wavesColored',
            'bookOpenColored',
            'layersThreeColored',
            'libraryBigColored',
            'searchTextfield',
            'star06Colored',
            'users01Colored',
          ]
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {newIcons.map(name => (
                <div
                  key={name}
                  style={{
                    width: 104,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: 12,
                  }}
                >
                  <img src={images[name]} alt={name} style={{ width: 30, height: 30 }} />
                  <span
                    style={{ fontSize: 11, color: '#666', textAlign: 'center', wordBreak: 'break-word' }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          )
        })()}
      </Section>

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

      <Section title="AppSearchField">
        <div style={{ width: 360 }}>
          <AppSearchField
            value={searchDemo}
            onChange={setSearchDemo}
            placeholder="Search stories, essays, words…"
          />
        </div>
        <div style={{ width: 360 }}>
          <AppSearchField value="" onChange={() => {}} placeholder="Empty — no clear button" />
        </div>
        <div style={{ width: 360 }}>
          <AppSearchField value="disabled" onChange={() => {}} disabled />
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

      <Section title="AppSwitch">
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666' }}>
            off <AppSwitch checked={false} readOnly />
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666' }}>
            on <AppSwitch checked readOnly />
          </span>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: colors.ink }}>
            <AppSwitch checked={switchOn} onChange={e => setSwitchOn(e.target.checked)} />
            Interactive
          </label>
          <AppSwitch disabled checked />
        </div>
      </Section>

      <Section title="AppThemeSwitch (light / dark)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666' }}>
            light <AppThemeSwitch checked={false} readOnly />
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666' }}>
            dark <AppThemeSwitch checked readOnly />
          </span>
          <AppThemeSwitch checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
        </div>
      </Section>

      <Section title="AppPagination">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AppPagination page={pageDemo} count={5} onChange={setPageDemo} />
          <AppPagination page={pageDemo} count={12} onChange={setPageDemo} />
        </div>
      </Section>

      <Section title="AppTabs">
        {(() => {
          const tabs = [
            { value: 'public', label: 'Public', icon: <PublicOutlinedIcon /> },
            { value: 'private', label: 'Private', icon: <LockOutlinedIcon /> },
            { value: 'group', label: 'Group', icon: <GroupsOutlinedIcon />, badge: 2 },
          ]
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
              <div>
                <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>
                  Default — hugs its content, so the bar is only as wide as the segments.
                </div>
                <AppTabs tabs={tabs} value={tab} onChange={setTab} />
              </div>
              <div style={{ maxWidth: 620 }}>
                <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>
                  <code>fullWidth</code> — spans its container and splits the segments evenly.
                </div>
                <AppTabs tabs={tabs} value={tab} onChange={setTab} fullWidth />
              </div>
              <div style={{ maxWidth: 620 }}>
                <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>
                  Inner tab panel (<code>bordered</code>) — a green outline so the bar reads when it
                  sits inside a cream card or modal (e.g. Flashcards, the learning-settings modal).
                  Shown on a cream surface, which is the only place the outline earns its keep.
                </div>
                <div style={{ backgroundColor: colors.card, borderRadius: 30, padding: 20 }}>
                  <AppTabs tabs={tabs} value={tab} onChange={setTab} fullWidth bordered />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>
                  Sizes — <code>xs</code> / <code>sm</code> / <code>md</code> (default) /{' '}
                  <code>lg</code>.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                  {['xs', 'sm', 'md', 'lg'].map(s => (
                    <AppTabs key={s} tabs={tabs} value={tab} onChange={setTab} size={s} />
                  ))}
                </div>
              </div>
              <div style={{ maxWidth: 620 }}>
                <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>
                  Long labels (<code>fullWidth</code>) — the bar grows past its container rather
                  than clipping a label, and the cream background always covers every segment. Put
                  it in an <code>overflow-x: auto</code> wrapper so it scrolls, and reach for{' '}
                  <code>size=&quot;sm&quot;</code> to buy room before it comes to that.
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <AppTabs
                    tabs={[
                      { value: 'public', label: 'Group exercise summary' },
                      { value: 'private', label: 'Group vocabulary summary' },
                      { value: 'group', label: 'Group grammar progress' },
                    ]}
                    value={tab}
                    onChange={setTab}
                    fullWidth
                  />
                </div>
              </div>
              <div
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 30,
                  padding: 24,
                  maxWidth: 620,
                  color: '#666',
                }}
              >
                Content for the <strong style={{ color: colors.ink }}>{tab}</strong> tab goes in a
                separate cream block below the tab bar.
              </div>
            </div>
          )
        })()}
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
          <ChatBubble variant="options">
            See-through bubble that holds action content (no background/shadow/padding).
          </ChatBubble>
        </div>
      </Section>

      <Section title="AppToast">
        {/* Preview inside a mock toast card — the real card comes from .Toastify__toast in custom.scss. */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12 }}>
          {[
            { message: 'Every toast is a cream card with ink text.', icon: images.globe04 },
            { message: 'Without an icon, just the message.' },
          ].map(({ message, icon }) => (
            <div
              key={message}
              style={{
                width: 320,
                padding: '14px 16px',
                backgroundColor: '#faf8ed',
                border: '1px solid #b1d3c2',
                borderRadius: 16,
                boxShadow: '0 8px 24px rgba(45, 44, 42, 0.14)',
              }}
            >
              <AppToast message={message} icon={icon} />
            </div>
          ))}
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

      <Section title="AppRadio">
        <RadioGroup
          row
          value={radioValue}
          onChange={e => setRadioValue(e.target.value)}
        >
          <FormControlLabel value="a" control={<AppRadio />} label="Option A" />
          <FormControlLabel value="b" control={<AppRadio />} label="Option B" />
          <FormControlLabel value="c" control={<AppRadio />} label="Option C" disabled />
        </RadioGroup>
      </Section>

      <Section title="AppCheckbox">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppCheckbox defaultChecked /> Checked
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppCheckbox /> Unchecked
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppCheckbox indeterminate /> Indeterminate
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppCheckbox disabled checked /> Disabled
        </label>
      </Section>

      <Section title="AppTable">
        {(() => {
          const rows = [
            { level: 'A1', correct: 8, total: 10 },
            { level: 'A2', correct: 6, total: 10 },
            { level: 'B1', correct: 3, total: 10 },
          ]
          const body = rows.map(row => (
            <TableRow key={row.level}>
              <TableCell>{row.level}</TableCell>
              <TableCell align="right">{row.correct}</TableCell>
              <TableCell align="right">{row.total}</TableCell>
            </TableRow>
          ))
          const head = (
            <TableHead>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell align="right">Correct</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
          )
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
              {[
                { title: 'plain', props: {} },
                { title: 'striped', props: { striped: true } },
                { title: 'striped + bordered + hover', props: { striped: true, bordered: true, hover: true } },
                { title: 'density="standard" (taller rows)', props: { striped: true, density: 'standard' } },
                { title: 'size="auto" (shrinks to content)', props: { bordered: true, size: 'auto' } },
                { title: 'size={260} (raw width)', props: { bordered: true, size: 260 } },
              ].map(({ title, props }) => (
                <div key={title} style={{ maxWidth: 420 }}>
                  <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>{title}</div>
                  <AppTable {...props}>
                    {head}
                    <TableBody>{body}</TableBody>
                  </AppTable>
                </div>
              ))}
              <div style={{ maxWidth: 420 }}>
                <div style={{ fontSize: 13, color: colors.muted, marginBottom: 6 }}>
                  Too many columns — the <code>TableContainer</code> scrolls horizontally
                  , so a wide table never breaks the page
                  layout. This is what the group summary table relies on.
                </div>
                <AppTable striped bordered>
                  <TableHead>
                    <TableRow>
                      {['Email', 'Username', 'XP', 'Snippets', 'Correct %', 'Exercises', 'CEFR'].map(
                        col => <TableCell key={col}>{col}</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {['aino@example.com', 'väinö@example.com'].map(email => (
                      <TableRow key={email}>
                        <TableCell>{email}</TableCell>
                        <TableCell>{email.split('@')[0]}</TableCell>
                        <TableCell align="right">1240</TableCell>
                        <TableCell align="right">86</TableCell>
                        <TableCell align="right">74.5</TableCell>
                        <TableCell align="right">302</TableCell>
                        <TableCell>B1</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </AppTable>
              </div>
            </div>
          )
        })()}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 420 }}>
          <AppProgressBar value={20} />
          <AppProgressBar value={50} label="3 / 6" />
          <AppProgressBar value={80} />
          <AppProgressBar value={100} label="Done" />
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
