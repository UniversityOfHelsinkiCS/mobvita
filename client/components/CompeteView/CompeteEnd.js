import React from 'react'
import { Modal, Icon, Divider, Segment, Grid } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const CompeteEnd = ({ open, setOpen, playerScore, botScore, exercisesTotal }) => {
  const titleMessage = () => {
    if (playerScore > botScore)
      return (
        <>
          <FormattedMessage id="you-won" /> <Icon name="thumbs up" />
        </>
      )
    if (playerScore < botScore)
      return (
        <>
          <FormattedMessage id="you-lost" /> <Icon name="frown outline" />
        </>
      )

    return <FormattedMessage id="tie-try-again" />
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="tiny">
      <Modal.Header>
        <h2>{titleMessage()}</h2>
      </Modal.Header>
      <Modal.Content>
        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  gap: '2.5em',
                }}
              >
                <h4 style={{ alignSelf: 'center' }}>YOU</h4>

                <div style={{ alignSelf: 'center', fontSize: '36px' }}>
                  {playerScore}/{exercisesTotal}
                </div>
              </div>
            </Grid.Column>

            <Grid.Column verticalAlign="middle">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  gap: '3em',
                }}
              >
                <h4 style={{ alignSelf: 'center' }}>OPPONENT</h4>

                <div style={{ alignSelf: 'center', fontSize: '36px' }}>
                  {botScore}/{exercisesTotal}
                </div>
              </div>
            </Grid.Column>
          </Grid>

          <Divider vertical>VS</Divider>
        </Segment>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
          <Button disabled>{playerScore > botScore ? 'Restart competition' : 'Try again'}</Button>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default CompeteEnd
