import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { unshareStory, removeStory } from 'Utilities/redux/storiesReducer'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import ShareStory from './ShareStory'
import { CustomButton, LinkButton } from './Buttons'
import DetailsTable from './DetailsTable'

const StoryDetails = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const story = useSelector(state => state.stories.data.find(story => story._id === id))
  const {
    oid: userId,
    last_selected_group: selectedGroupId,
    last_selected_library: selectedLibrary,
    email: userEmail,
  } = useSelector(state => state.user.data.user)
  const groups = useSelector(state => state.groups.groups)

  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  if (!story) return null

  const handleDelete = () => {
    if (selectedLibrary === 'group') dispatch(unshareStory(selectedGroupId, id))
    else dispatch(removeStory(id))
    history.push('/library')
  }

  const {
    title,
    percent_cov: percentCovered,
    percent_perf: percentCorrect,
    URL,
    sharing_info: sharingInfo,
    author,
    elo_score: elo,
    difficulty,
    user,
    public: publicStory,
    groups: groupsSharedWith,
    category,
    date,
  } = story

  const selectedGroup = groups.find(group => group.group_id === selectedGroupId)

  const inGroupLibrary = selectedLibrary === 'group'
  const userOwnsStory = user === userId
  const userIsATeacherOfSharedStory =
    selectedGroup?.is_teaching &&
    groupsSharedWith?.some(group => group.group_id === selectedGroupId)

  const showShareButton = !publicStory && userOwnsStory && userEmail !== 'anonymous_email'
  const showDeleteButton = !publicStory && (userOwnsStory || userIsATeacherOfSharedStory)

  const storyGroupSharingInfo = inGroupLibrary
    ? groupsSharedWith.find(g => g.group_id === selectedGroupId)
    : null

  return (
    <main className="application-content pt-nm">
      <ShareStory story={story} isOpen={shareModalOpen} setOpen={setShareModalOpen} />
      <ConfirmationWarning
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        action={handleDelete}
      >
        {inGroupLibrary ? (
          <FormattedMessage
            id="remove-story-from-group-warning"
            values={{ group: selectedGroup?.groupName }}
          />
        ) : (
          <FormattedMessage id="story-remove-confirm" />
        )}
      </ConfirmationWarning>
      <div className="space-between pb-sm">
        <button type="button" onClick={() => history.goBack()} style={{ border: 'none' }}>
          <Icon name="arrow left" />
          <FormattedMessage id="Back" />
        </button>
        <div className="gap-col-sm">
          <CustomButton
            condition={showShareButton}
            onClick={() => setShareModalOpen(true)}
            variant="outline-secondary"
            translationId="Share"
            size="sm"
          />
          <CustomButton
            condition={showDeleteButton}
            onClick={() => setDeleteModalOpen(true)}
            variant="outline-danger"
            translationId="Delete"
            size="sm"
          />
        </div>
      </div>
      <h1 className="pt-lg pb-sm" style={{ fontSize: '18px' }}>
        {title}
      </h1>
      <DetailsTable
        author={author}
        difficulty={difficulty}
        elo={elo}
        sharingInfo={inGroupLibrary ? storyGroupSharingInfo : sharingInfo}
        percentCovered={percentCovered}
        percentCorrect={percentCorrect}
        URL={URL}
        category={category}
        publicStory={publicStory}
        date={date}
      />
      <div className="flex-col gap-row-sm">
        <div className="gap-col-sm gap-row-sm">
          <LinkButton
            variant="secondary"
            to={`/stories/${story._id}/preview`}
            translationId="preview"
          />
          <LinkButton to={`/stories/${id}/practice`} translationId="practice" />
          <LinkButton
            variant={percentCovered === 0 ? 'outline-danger' : 'secondary'}
            disabled={percentCovered === 0}
            to={`/stories/${story._id}/review`}
            translationId="review"
          />
          <LinkButton
            variant="primary"
            to={`/flashcards/fillin/${id}/`}
            translationId="Flashcards"
          />
          <LinkButton
            variant="secondary"
            to={`/stories/${story._id}/compete`}
            translationId="compete"
          />
        </div>
      </div>
    </main>
  )
}

export default StoryDetails
