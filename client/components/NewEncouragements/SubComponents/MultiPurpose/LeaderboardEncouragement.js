import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { images, backgroundColors } from 'Utilities/common'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

const LeaderboardEncouragement = () => {

  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const [userRanking, setUserRanking] = useState(null)

  useEffect(() => {
    if (user_rank < 100) {
      setUserRanking(user_rank + 1)
    }
  }, [user_rank])


  return (
    <div>
      {userRanking && userRanking <= 10 ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[1] }}
          >
            <img
              src={images.encTrophy}
              alt="encouraging trophy"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage
                id="leaderboard-ranking-encouragement"
                values={{ userRanking }}
              />
              &nbsp;
              <Link className="interactable" to="/leaderboard">
                <FormattedMessage id="leaderboard-link-encouragement" />
              </Link>
              !
              <br />
              <FormattedMessage id="practice-makes-perfect" />
            </div>
          </div>
        </div>
      ) : (null)}
    </div>)
}

export default LeaderboardEncouragement