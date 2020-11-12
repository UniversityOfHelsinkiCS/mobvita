import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Placeholder } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import Subheader from 'Components/Subheader'

const Winner = ({ position, name, record, rankingHistory }) => {
  const first = position === 'first'
  const medalHeight = first ? '54px' : '43px'
  const wreadthSource = first ? images.fancyWreadth : images.wreadth
  const wreadthHeight = first ? '95px' : '70px'
  const silverRewardPositioning = first
    ? { top: '-5px', left: '3px' }
    : { top: '-3px', left: '-3px' }
  const goldRewardPositioning = first
    ? { top: '-10px', left: '25px' }
    : { top: '-10px', left: '17px' }
  const bronzeRewardPositioning = first
    ? { top: '-5px', left: '47px' }
    : { top: '-3px', left: '37px' }

  const getMedalAmount = position => {
    if (!name) return null
    return rankingHistory[position - 1] || 0
  }

  return (
    <div className="leaderboard-winner">
      <div className={`leaderboard-winner-graphic ${position}`}>
        <img
          src={images[`${position}Medal`]}
          alt={`${position} position medal`}
          height={medalHeight}
        />
        <img
          src={wreadthSource}
          alt="wreadth"
          height={wreadthHeight}
          className={`leaderboard-wreadth ${position}-wreadth`}
        />
        <div
          className="leaderboard-reward position-silver"
          style={{ position: 'absolute', ...silverRewardPositioning }}
        >
          {getMedalAmount(2)}
        </div>
        <div
          className="leaderboard-reward position-gold"
          style={{ position: 'absolute', ...goldRewardPositioning }}
        >
          {getMedalAmount(1)}
        </div>
        <div
          className="leaderboard-reward position-bronze"
          style={{ position: 'absolute', ...bronzeRewardPositioning }}
        >
          {getMedalAmount(3)}
        </div>
      </div>
      {name ? (
        <div className="flex-column align-center">
          <span className="leaderboard-winner-name">{name}</span>
          <span className="leaderboard-winner-record">{record}</span>
        </div>
      ) : (
        <div className="flex-column">
          <Placeholder style={{ minWidth: '5rem', alignSelf: 'center' }}>
            <Placeholder.Line
              length="very long"
              style={{ position: 'initial', marginBottom: '.7rem' }}
            />
          </Placeholder>
          <Placeholder style={{ minWidth: '2rem', alignSelf: 'center', marginTop: '.5rem' }}>
            <Placeholder.Line length="short" style={{ height: '0', marginTop: '1rem' }} />
          </Placeholder>
        </div>
      )}
    </div>
  )
}

const LastWeeksWinners = () => {
  const previousLeaderboard = useSelector(
    ({ leaderboard }) => leaderboard?.data?.previous_leaderboard
  )

  const lastWeeksWinners = useMemo(
    () =>
      previousLeaderboard?.slice(0, 3).map(winner => ({
        username: winner.username,
        record: `${Math.floor(winner.weekly_time_spent * 10) / 10}h`,
        rankingHistory: winner.leaderboard_history,
      })),
    [previousLeaderboard]
  )

  return (
    <div className="padding-top-2 padding-bottom-2">
      <div className="leaderboard-winner-container">
        <Winner
          position="second"
          name={lastWeeksWinners && lastWeeksWinners[1]?.username}
          record={lastWeeksWinners && lastWeeksWinners[1]?.record}
          rankingHistory={lastWeeksWinners && lastWeeksWinners[1]?.rankingHistory}
        />
        <Winner
          position="first"
          name={lastWeeksWinners && lastWeeksWinners[0]?.username}
          record={lastWeeksWinners && lastWeeksWinners[0]?.record}
          rankingHistory={lastWeeksWinners && lastWeeksWinners[0]?.rankingHistory}
        />
        <Winner
          position="third"
          name={lastWeeksWinners && lastWeeksWinners[2]?.username}
          record={lastWeeksWinners && lastWeeksWinners[2]?.record}
          rankingHistory={lastWeeksWinners && lastWeeksWinners[2]?.rankingHistory}
        />
      </div>
    </div>
  )
}

export default LastWeeksWinners
