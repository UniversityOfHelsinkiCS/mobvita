import React from 'react'
import { images } from 'Utilities/common'
import { useLocation } from 'react-router-dom'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { colors } from 'Assets/mui_theme/designTokens'

const Footer = () => {
  const location = useLocation()

  const showResonsiveVoiceMention = location.pathname.includes('stories')
  const showTermsAndConditionsAndBuildVersion =
    location.pathname.includes('home') || location.pathname.includes('welcome')

  return (
    <footer className="footer-wrapper">
      <div className="footer" style={{ backgroundColor: colors.panel }}>
        {/* Left: University of Helsinki logo */}
        <div
          className="footer-item"
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <img
            src={images.universityOfHelsinki}
            alt="University of Helsinki"
            style={{ height: 36 }}
          />
          <div style={{ fontSize: 12, lineHeight: 1.4, color: colors.ink }}>
            © 2020–{new Date().getFullYear()}
            <br />
            University of Helsinki
          </div>
        </div>
        {showResonsiveVoiceMention && (
          <div className="footer-item">
            Powered by {' '}
            <a href="https://tech.yandex.com/dictionary">Yandex.Dictionary</a>, {' '}
            <a href="https://responsivevoice.org">ResponsiveVoice-NonCommercial</a> {' '}
            <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
              <img
                title="ResponsiveVoice Text To Speech"
                src="https://responsivevoice.org/wp-content/uploads/2014/08/95x15.png"
                alt="95x15"
                width="95"
                height="15"
              />
            </a>
          </div>
        )}
        {/* Right: Terms & Conditions */}
        {showTermsAndConditionsAndBuildVersion && (
          <TermsAndConditions
            trigger={
              <button className="footer-button" type="button" data-cy="tc-button" variant="link">
                Terms and Conditions, Privacy Policy
              </button>
            }
          />
        )}
      </div>
    </footer>
  )
}
export default Footer
