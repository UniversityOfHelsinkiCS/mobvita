import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'

const GroupView = () => {
  const dispatch = useDispatch()

  const groups = useSelector(({ groups }) => groups.groups)

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  return (
    <div>
      {groups && groups.map(group => (
        <div>
          <div>{group.groupName}</div>
          <ul>
            {group.students.map(student => <li key={student.userName}>{student.userName}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default GroupView
