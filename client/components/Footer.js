import React from 'react'
import { useHistory } from 'react-router-dom'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { Button } from 'react-bootstrap'

const Footer = () => {
  const history = useHistory()

  const showResonsiveVoiceMention = history.location.pathname.includes('stories')
  const showTermsAndConditionsAndBuildVersion = history.location.pathname.includes('home')

  return (
    <footer className="footer-wrapper">
      <div className="footer">
        {showTermsAndConditionsAndBuildVersion && (
          <>
            <TermsAndConditions
              trigger={
                <button className="footer-button" type="button" data-cy="tc-button" variant="link">
                  Terms and Conditions, Privacy Policy
                </button>
              }
            />
            <div className="footer-item">
              {/* eslint-disable no-undef */}
              {`Built: ${__VERSION__} (${__COMMIT__})`}
            </div>
          </>
        )}
        <div className="footer-item">© University of Helsinki 2020–2021</div>

        {showResonsiveVoiceMention && (
          <div className="footer-item">
            <a href="https://responsivevoice.org">ResponsiveVoice-NonCommercial</a> licensed under{' '}
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
      </div>
    </footer>
  )
}
export default Footer
