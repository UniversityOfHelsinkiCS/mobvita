import React from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'

const Footer = () => {
  const smallWindow = useWindowDimensions().width < 640

  if (smallWindow) return null

  return (
    <footer className="footer-wrapper">
      <div className="footer">
        <div>
          © University of Helsinki 2015–2020
        </div>
        <div>
          <a href="https://responsivevoice.org">ResponsiveVoice-NonCommercial</a> licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img title="ResponsiveVoice Text To Speech" src="https://responsivevoice.org/wp-content/uploads/2014/08/95x15.png" alt="95x15" width="95" height="15" /></a>
        </div>
      </div>
    </footer>
  )
}
export default Footer
