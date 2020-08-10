import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { Table } from 'semantic-ui-react'
import Spinner from 'Components/Spinner'
import { useCurrentUser } from 'Utilities/common'

const Leaderboard = () => {
  const { data } = useSelector(({ leaderboard }) => leaderboard)
  const user = useCurrentUser()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getLeaderboards())
  }, [])

  if (!data) return <Spinner />

  return (
    <div className="component-container padding-sides-2">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Snippets</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.leaderboard.map(({ username, number_of_exercises }) => (
            <Table.Row positive={username === user.username} key={username}>
              <Table.Cell>{username}</Table.Cell>
              <Table.Cell>{number_of_exercises}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Leaderboard
