// eslint-disable-next-line no-unused-vars
import React from 'react'
import { FormattedMessage } from 'react-intl'
import CustomTooltip from 'Components/CustomTooltip'
import AppIcon from 'Components/ui/AppIcon'
import { images } from 'Utilities/common'

/**
 * ChartHeading — the title above an analytics chart, with its explanation on an info icon beside
 * the text. Same shape as the group card's heading: name first, icon second.
 *
 *   titleId - i18n id for the heading text
 *   tooltip - explanation node; the icon is only rendered when there is one
 *
 * The tooltip is `permanent`, so it ignores the user's global "show tooltips" setting — these
 * explain what a chart is measuring, which is not the same as an onboarding hint.
 */
const ChartHeading = ({ titleId, tooltip }) => (
  <div className="progress-page-heading">
    <div className="progress-page-header">
      <FormattedMessage id={titleId} />
    </div>
    {tooltip && (
      <CustomTooltip permanent title={tooltip} placement="top">
        {/* CustomTooltip hands a ref to its child, and AppIcon does not forward one. */}
        <span className="progress-page-info">
          <AppIcon src={images.infoIcon} size={16} color="currentColor" />
        </span>
      </CustomTooltip>
    )}
  </div>
)

export default ChartHeading
