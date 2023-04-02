import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

const FollowingList = ({ friends }) => {
  if (friends.length === 0) {
    return <FormattedMessage id="no-followed-users" />
  }
  const friendsToList = []
  for (let i = 0; i < 10 && friendsToList.length !== friends.length; i++) {
    friendsToList[i] = friends[i]
  }

  return (
    <ul>
      {friendsToList.map(friend => (
        <li>{friend.username}</li>
      ))}
    </ul>
  )
}

const BlockedList = ({ blocked }) => {
  if (blocked.length === 0) {
    return <FormattedMessage id="no-blocked-users" />
  }
  const blockedUsersToList = []
  for (let i = 0; i < 10 && blockedUsersToList.length !== blocked.length; i++) {
    blockedUsersToList[i] = blocked[i]
  }

  return (
    <ul>
      {blocked.map(blockedUser => (
        <li>{blockedUser.username}</li>
      ))}
    </ul>
  )
}

const SocialsList = () => {
  const { friends, blocked } = useSelector(({ user }) => user.data.user)
  return (
    <div>
      <FollowingList friends={friends} />
      <BlockedList blocked={blocked} />
    </div>
  )
}

export default SocialsList
