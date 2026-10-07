import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { images } from 'Utilities/common'
import ChatBubble from 'Components/ui/ChatBubble'
import PracticeCompletedEncouragement from '../Encouragements/PracticeCompletedEncouragement'
import GroupStoriesEncouragement from '../Encouragements/GroupStoriesEncouragement'
import ControlledStoriesEncouragement from '../Encouragements/ControlledStoriesEncouragement'

// A story counts as done once its practice coverage (0–100) is full.
const FULL_COVERAGE = 100

// True when the story is shared, visibly, to the group and the user has not finished practising it.
const isUnfinishedInGroup = (story, groupId) => {
  const share = story.groups?.find(g => g.group_id === groupId)
  if (!share || share.hidden) return false
  return !story.has_read || (story.percent_cov ?? 0) < FULL_COVERAGE
}

// The assistant's recommendations, each a ready recommendation bubble or null; callers render the
// ones that fit their view. `practiceCompleted` and the props after it drive the completion bubble.
const useRecommender = ({
  practiceCompleted: showPracticeCompleted = false,
  practiceType,
  continueAction,
  onDismiss,
} = {}) => {
  const groupId = useSelector(({ user }) => user.data?.user?.last_selected_group)
  const group = useSelector(({ groups }) => groups.groups.find(g => g.group_id === groupId))
  const teacherView = useSelector(({ user }) => !!user.data?.teacherView)
  const stories = useSelector(({ stories }) => stories.data)
  // Dismissal lasts while the assistant is mounted; keyed by group so another group still shows.
  // The two bubbles dismiss independently, so they keep separate state.
  const [dismissedGroupId, setDismissedGroupId] = useState(null)
  const [dismissedControlledGroupId, setDismissedControlledGroupId] = useState(null)

  // A teacher in teacher mode is not reminded of stories they shared; in student mode they are.
  const unfinishedGroupStories =
    group && !(group.is_teaching && teacherView)
      ? (stories ?? []).filter(story => isUnfinishedInGroup(story, groupId))
      : []

  // Teacher-controlled stories are a different task to the learner — the exercises are chosen by
  // the teacher and timed, and they have their own practice route — so they get their own bubble.
  const unfinishedRegularStories = unfinishedGroupStories.filter(story => !story.control_story)
  const unfinishedControlledStories = unfinishedGroupStories.filter(story => story.control_story)

  // TEMP DEBUG — remove after diagnosing the missing group-stories bubble.
  console.debug('[useRecommender]', {
    groupId,
    groupIdType: typeof groupId,
    group: group && { name: group.groupName, is_teaching: group.is_teaching },
    teacherView,
    dismissedGroupId,
    storiesTotal: stories?.length,
    sharedToSomeGroup: (stories ?? [])
      .filter(s => s.groups?.length)
      .map(s => ({
        title: s.title,
        groups: s.groups.map(g => ({ id: g.group_id, type: typeof g.group_id, hidden: g.hidden })),
        has_read: s.has_read,
        percent_cov: s.percent_cov,
      })),
    unfinished: unfinishedGroupStories.length,
  })

  const incompleteGroupStories =
    unfinishedRegularStories.length && dismissedGroupId !== groupId ? (
      <ChatBubble
        variant="recommendation"
        icon={images.users01}
        onRemove={() => setDismissedGroupId(groupId)}
        removeDataCy="group-stories-dismiss"
      >
        <GroupStoriesEncouragement stories={unfinishedRegularStories} groupName={group.groupName} />
      </ChatBubble>
    ) : null

  // Built but deliberately not rendered yet: no view asks for this bubble.
  const incompleteControlledStories =
    unfinishedControlledStories.length && dismissedControlledGroupId !== groupId ? (
      <ChatBubble
        variant="recommendation"
        icon={images.target04}
        onRemove={() => setDismissedControlledGroupId(groupId)}
        removeDataCy="controlled-stories-dismiss"
      >
        <ControlledStoriesEncouragement
          stories={unfinishedControlledStories}
          groupName={group.groupName}
        />
      </ChatBubble>
    ) : null

  const practiceCompleted = showPracticeCompleted ? (
    <ChatBubble
      variant="recommendation"
      icon={images.trophy01}
      onRemove={onDismiss}
      removeDataCy="practice-completed-dismiss"
    >
      <PracticeCompletedEncouragement
        layout="chat"
        practiceType={practiceType}
        setShow={onDismiss}
        continueAction={continueAction}
      />
    </ChatBubble>
  ) : null

  return { incompleteGroupStories, incompleteControlledStories, practiceCompleted }
}

// ---- Not yet migrated: the old Recommender's encouragements (SubComponents/*), by view ----
// Data it loaded: getIncompleteStories(lang, { sort_by: 'access' }), getLeaderboards(),
// getStoriesBlueFlashcards(lang, dictLang); also metadata.cachedStories, newVocabulary, flashcards.
// "Unfinished" (state.incomplete): last_snippet_id !== num_snippets - 1; "read through": === it.
// user.enable_recmd disables them (TurnOffRecommendations); RecommendSlider was the carousel.
//
// Home / welcome:
// WelcomeBackEncouragement (HomeView) — greeting + stories covered; when path includes /welcome.
// StreakEncouragement (HomeView) — streak broken/done/undone, links /library, /flashcards; always.
// LeaderboardEncouragement (MultiPurpose) — rank, link /leaderboard; when user_rank <= 10.
// DailyStoriesEncouragement + DailyStoriesDraggable (HomeView) — import daily stories; when
//   metadata.cachedStories is non-empty. Superseded in the library by ChatBot/DailyStoriesBubble.
// LatestIncompleteStory (MultiPurpose) — continue the latest unfinished story; when one exists.
// ConfirmBlueCardsEncouragement (MultiPurpose) — blue-card test of a past story; if storyBlueCards.
// UnseenStoriesInGroup / SharedIncompleteStoryInGroup (HomeView) — unread group / controlled story;
//   shared && !has_read (&& control_story). Superseded by incompleteGroupStories above.
// ReviewStoriesEncouragement (HomeView) — review read-through stories; when one exists.
//
// Progress page / flashcards tab: ConfirmBlueCardsEncouragement, when storyBlueCards is non-empty.
//
// Story practice, after finishing (PracticeCompletedEncouragement is now practiceCompleted):
// StoryCompletedToBluecardsExerciseEncouragement (PracticeView) — blue-card test of this story when
//   creditableWordsNum >= 5, else of a past story with num_of_rewardable_words >= 5.
// LatestIncompleteStory, LeaderboardEncouragement — as on the home view.
// WordsSeenEncouragement (MultiPurpose) — words seen, link /flashcards; when vocabulary_seen > 0.
// NewWordsInteractedExerciseEncouragement (PracticeView) — new words, link /profile/progress; > 0.
// GrammarReviewExerciseEncouragement (PracticeView) — link /profile/progress/grammar; always.
// ExerciseEncouragementHeader (PracticeView) — title row of the old practice popup.
//
// Flashcards, after a deck (handleNewDeck: close encouragements, refetch getFlashcards):
// FlashcardsHeaderChooser — header by result: MasteringNewWords / WellDone (Headers/*).
// TryAnotherBatch — next deck via handleNewDeck; always.
// ListOfRecentStoriesFlashcardsEncouragement — recent unfinished stories; when one exists.
// BackToLibraryFromFlashcards — link /library; always.
//
// Blue-card test, after the test (handleNewDeck refetches getBlueFlashcards + story blue cards):
// FlashcardsHeaderChooser — GoodJobBlueFlashcards when all correct, else SomeIncorrect (retry).
// PreviousStoriesBlueFlashcards — test another story: not current, rewardable words >= 5.
// WordsSeenEncouragement — as above. FlashcardsProgress — /profile/progress/flashcards; always.
//
// Lesson practice, after finishing (PracticeCompletedEncouragement 'lesson' is practiceCompleted):
// GoodJobEncouragement — random praise; always. RedirectHomeEncouragement — take a break, /home.

export default useRecommender
