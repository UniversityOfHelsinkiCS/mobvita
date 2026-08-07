import React from 'react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import AppToast from 'Components/ui/AppToast'

/**
 * ServerIssuesToast — the "server-issues" network-problem notice, rendered with the shared design-system
 * AppToast content (globe icon + message). The cream card comes from `.Toastify__toast` in custom.scss.
 */
const ServerIssuesToast = () => {
  const intl = useIntl()

  return (
    <AppToast message={intl.formatMessage({ id: 'server-issues' })} icon={images.globe04} iconAlt="network" />
  )
}

export default ServerIssuesToast
