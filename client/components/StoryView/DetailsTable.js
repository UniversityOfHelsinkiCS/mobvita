import React from 'react'
import { Table, ProgressBar } from 'react-bootstrap'
import DifficultyStars from 'Components/DifficultyStars'
import Row from './Row'

export default ({ author, difficulty, elo, sharingInfo, percentCovered, percentCorrect, URL }) => (
  <Table striped width="100%" style={{ tableLayout: 'fixed' }}>
    <colgroup>
      <col width="40%" />
      <col width="60%" />
    </colgroup>
    <tbody>
      {URL && (
        <Row translationId="Source">
          <a href={URL} target="_blank" rel="noopener noreferrer">{URL}</a>
        </Row>
      )}
      {author && (
        <Row translationId="Author">
          {author}
        </Row>
      )}
      <Row translationId="Level">
        <DifficultyStars difficulty={difficulty} />
      </Row>
      <Row translationId="story-rating">
        {elo}
      </Row>
      {sharingInfo && (
        <>
          <Row translationId="Sender">
            {sharingInfo.sender}
          </Row>
          {sharingInfo.message && (
            <Row translationId="Message">
              {sharingInfo.message}
            </Row>
          )}
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
