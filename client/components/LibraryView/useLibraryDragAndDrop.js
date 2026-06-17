import { useState } from 'react'

const STORY_DRAG_MIME_TYPE = 'application/x-mobvita-story-ids'

const getStoryIdStrings = storyIds => storyIds.map(storyId => String(storyId))

const useLibraryDragAndDrop = ({ libraryIsMutable, onMoveStories }) => {
  const [draggedStoryIds, setDraggedStoryIds] = useState([])
  const [dragOverFolderPath, setDragOverFolderPath] = useState(null)

  const clearDragState = () => {
    setDraggedStoryIds([])
    setDragOverFolderPath(null)
  }

  const storyDragDataIsAvailable = e => {
    if (!libraryIsMutable) return false

    const dataTransferTypes = Array.from(e.dataTransfer?.types || [])

    return draggedStoryIds.length > 0 || dataTransferTypes.includes(STORY_DRAG_MIME_TYPE)
  }

  const getDroppedStoryIds = e => {
    const storyIdsJson = e.dataTransfer.getData(STORY_DRAG_MIME_TYPE)

    if (storyIdsJson) {
      try {
        const storyIds = JSON.parse(storyIdsJson)
        if (Array.isArray(storyIds)) return storyIds
      } catch {
        // Fall back to text/plain below.
      }
    }

    const fallbackStoryIds = e.dataTransfer.getData('text/plain')
    if (fallbackStoryIds) {
      return fallbackStoryIds
        .split(',')
        .map(storyId => storyId.trim())
        .filter(Boolean)
    }

    return draggedStoryIds
  }

  const handleFolderDragOver = (folderPath, e) => {
    if (!storyDragDataIsAvailable(e)) return

    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDragOverFolderPath(folderPath)
  }

  const handleFolderDragLeave = (folderPath, e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return

    setDragOverFolderPath(currentFolderPath =>
      currentFolderPath === folderPath ? null : currentFolderPath,
    )
  }

  const handleFolderDrop = (folderPath, e) => {
    if (!libraryIsMutable) return

    const storyIds = getDroppedStoryIds(e)
    if (storyIds.length === 0) return

    e.preventDefault()
    e.stopPropagation()
    onMoveStories(storyIds, folderPath)
    clearDragState()
  }

  const handleStoryDragStart = (storyId, e) => {
    if (!libraryIsMutable) {
      e.preventDefault()
      return
    }

    const storyIdsToMove = getStoryIdStrings([storyId])

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData(STORY_DRAG_MIME_TYPE, JSON.stringify(storyIdsToMove))
    e.dataTransfer.setData('text/plain', storyIdsToMove.join(','))
    setDraggedStoryIds(storyIdsToMove)
  }

  return {
    clearDragState,
    draggedStoryIds,
    dragOverFolderPath,
    handleFolderDragLeave,
    handleFolderDragOver,
    handleFolderDrop,
    handleStoryDragEnd: clearDragState,
    handleStoryDragStart,
  }
}

export default useLibraryDragAndDrop
