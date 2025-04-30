import React from 'react'
import { Table, ProgressBar } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import DifficultyStars from 'Components/DifficultyStars'
import Row from './Row'

export default ({
  author,
  difficulty,
  elo,
  sharingInfo,
  percentCovered,
  percentCorrect,
  URL: UrlString,
  category,
  publicStory,
  date,
}) => (
  <Table striped width="100%" style={{ tableLayout: 'fixed' }}>
    <colgroup>
      <col width="40%" />
      <col width="60%" />
    </colgroup>
    <tbody>
      {UrlString && (
        <Row translationId="Source">
          <a href={UrlString} target="_blank" rel="noopener noreferrer">
            {new URL(UrlString).hostname}
          </a>
        </Row>
      )}
      {!publicStory && date && (
        <Row translationId="date-added">{moment(date).format('YYYY-MM-DD')}</Row>
      )}
      {author && <Row translationId="Author">{author}</Row>}
      {category && (
        <Row translationId="Category">
          <FormattedMessage id={category} />
        </Row>
      )}
      <Row translationId="story-difficulty">
        <DifficultyStars difficulty={difficulty} />
      </Row>
      <Row translationId="story-rating">{elo}</Row>
      {sharingInfo && (
        <>
          <Row translationId="shared-by">{sharingInfo.sender}</Row>
          {sharingInfo.message && <Row translationId="Message">{sharingInfo.message}</Row>}
        </>
      )}
      <Row translationId="part-of-story-covered">
        <ProgressBar
          striped
          variant="info"
          now={percentCovered < 10 ? 10 : percentCovered}
          label={`${percentCovered}%`}
          className="table-progress-bar"
        />
      </Row>
      <Row translationId="exercises-answered-correctly">
        <ProgressBar
          striped
          variant="success"
          now={percentCorrect < 10 ? 10 : percentCorrect}
          label={`${percentCorrect}%`}
          className="table-progress-bar"
        />
      </Row>
    </tbody>
  </Table>
)
