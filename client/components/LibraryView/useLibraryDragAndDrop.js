import { useState } from 'react'

const STORY_DRAG_MIME_TYPE = 'application/x-mobvita-story-ids'
const FOLDER_DRAG_MIME_TYPE = 'application/x-mobvita-folder-path'

const getStoryIdStrings = storyIds => storyIds.map(storyId => String(storyId))

const useLibraryDragAndDrop = ({ libraryIsMutable, onMoveStories, onMoveFolder, canDropFolder }) => {
  const [draggedStoryIds, setDraggedStoryIds] = useState([])
  const [draggedFolderPath, setDraggedFolderPath] = useState(null)
  const [dragOverFolderPath, setDragOverFolderPath] = useState(null)

  const clearDragState = () => {
    setDraggedStoryIds([])
    setDraggedFolderPath(null)
    setDragOverFolderPath(null)
  }

  const storyDragDataIsAvailable = e => {
    if (!libraryIsMutable) return false

    const dataTransferTypes = Array.from(e.dataTransfer?.types || [])

    return draggedStoryIds.length > 0 || dataTransferTypes.includes(STORY_DRAG_MIME_TYPE)
  }

  const folderDragDataIsAvailable = e => {
    if (!libraryIsMutable) return false

    const dataTransferTypes = Array.from(e.dataTransfer?.types || [])

    return Boolean(draggedFolderPath) || dataTransferTypes.includes(FOLDER_DRAG_MIME_TYPE)
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

  // getData is empty during dragover (browsers only expose it on drop), so fall back to the source we
  // stashed in state when the drag started.
  const getDroppedFolderPath = e => e.dataTransfer.getData(FOLDER_DRAG_MIME_TYPE) || draggedFolderPath

  // A folder can be dropped onto a target only when the move is actually allowed (not onto itself, its
  // own descendant, or the parent it already lives in — enforced by the caller's canDropFolder).
  const folderDropIsAllowed = (targetPath, e) => {
    if (!folderDragDataIsAvailable(e)) return false
    const source = getDroppedFolderPath(e)
    if (!source) return true // source unreadable yet — allow; the drop handler re-validates
    return typeof canDropFolder === 'function' ? canDropFolder(source, targetPath) : true
  }

  const handleFolderDragOver = (folderPath, e) => {
    if (!storyDragDataIsAvailable(e) && !folderDropIsAllowed(folderPath, e)) return

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

    // A folder move takes priority — a drag is either a folder or story, never both.
    const folderSource = getDroppedFolderPath(e)
    if (folderSource && typeof onMoveFolder === 'function') {
      e.preventDefault()
      e.stopPropagation()
      if (typeof canDropFolder !== 'function' || canDropFolder(folderSource, folderPath)) {
        onMoveFolder(folderSource, folderPath)
      }
      clearDragState()
      return
    }

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

  const handleFolderDragStart = (folderPath, e) => {
    if (!libraryIsMutable) {
      e.preventDefault()
      return
    }

    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData(FOLDER_DRAG_MIME_TYPE, folderPath)
    setDraggedFolderPath(folderPath)
  }

  return {
    clearDragState,
    draggedStoryIds,
    draggedFolderPath,
    dragOverFolderPath,
    handleFolderDragLeave,
    handleFolderDragOver,
    handleFolderDrop,
    handleFolderDragStart,
    handleStoryDragEnd: clearDragState,
    handleStoryDragStart,
  }
}

export default useLibraryDragAndDrop
