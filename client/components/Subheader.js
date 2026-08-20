import React from 'react'
import { FormattedMessage } from 'react-intl'
import CheckIcon from '@mui/icons-material/Check'
import MailIcon from '@mui/icons-material/Mail'
import BlockIcon from '@mui/icons-material/Block'

// `iconName` used to be a semantic-ui icon name; map the names actually used to MUI components.
const ICONS = {
  check: CheckIcon,
  checkmark: CheckIcon,
  mail: MailIcon,
  ban: BlockIcon,
}

const Subheader = ({ imgSource, imgAlt, iconName, translationId, color = '#777' }) => {
  const IconComponent = ICONS[iconName]

  return (
    <div>
      {imgSource && <img src={imgSource} alt={imgAlt} height="18px" />}
      {IconComponent && (
        <IconComponent
          sx={{ color, fontSize: '1em', marginRight: '0.25rem', verticalAlign: 'middle' }}
        />
      )}
      <span
        style={{ color, fontSize: '12px', fontWeight: 600, paddingLeft: IconComponent ? 0 : '.5rem' }}
      >
        <FormattedMessage id={translationId} />
      </span>
      <hr style={{ marginTop: 0 }} />
    </div>
  )
}

export default Subheader
