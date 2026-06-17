const LOCAL_FOLDER_STORAGE_PREFIX = 'mobvita-library-folders'

export const normalizeLibraryPath = path =>
  (path || '')
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)
    .join('/')

export const getLocalFolderStorageKey = (userId, learningLanguage) => {
  if (!userId || !learningLanguage) return null

  return `${LOCAL_FOLDER_STORAGE_PREFIX}:${userId}:${learningLanguage}`
}

export const getStoredLocalFolders = storageKey => {
  if (!storageKey || typeof window === 'undefined') return []

  try {
    const folders = JSON.parse(window.localStorage.getItem(storageKey) || '[]')

    if (!Array.isArray(folders)) return []

    return folders
      .map(folder => ({
        library: folder.library,
        path: normalizeLibraryPath(folder.path),
      }))
      .filter(folder => folder.library && folder.path)
  } catch {
    return []
  }
}

export const saveStoredLocalFolders = (storageKey, folders) => {
  if (!storageKey || typeof window === 'undefined') return

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(folders))
  } catch {
    // Empty folders are convenience state; blocked storage should not break the library.
  }
}

export const getFoldersForPath = (storiesForLibrary, currentPath, folderPaths = []) => {
  const folderNames = new Set()
  const currentParts = currentPath ? currentPath.split('/') : []

  storiesForLibrary.forEach(story => {
    const path = normalizeLibraryPath(story.path)
    if (!path) return

    const pathParts = path.split('/')
    const storyIsInsideCurrentPath = currentParts.every((part, index) => pathParts[index] === part)

    if (storyIsInsideCurrentPath && pathParts.length > currentParts.length) {
      folderNames.add(pathParts[currentParts.length])
    }
  })

  folderPaths.forEach(folderPath => {
    const path = normalizeLibraryPath(folderPath)
    if (!path) return

    const pathParts = path.split('/')
    const folderIsInsideCurrentPath = currentParts.every((part, index) => pathParts[index] === part)

    if (folderIsInsideCurrentPath && pathParts.length > currentParts.length) {
      folderNames.add(pathParts[currentParts.length])
    }
  })

  return Array.from(folderNames).sort((a, b) => a.localeCompare(b))
}

export const getStoriesForPath = (storiesForLibrary, currentPath) =>
  storiesForLibrary.filter(story => normalizeLibraryPath(story.path) === currentPath)

export const getStoriesInFolder = (storiesForLibrary, folderPath) => {
  const normalizedFolderPath = normalizeLibraryPath(folderPath)

  return storiesForLibrary.filter(story => {
    const storyPath = normalizeLibraryPath(story.path)

    return storyPath === normalizedFolderPath || storyPath.startsWith(`${normalizedFolderPath}/`)
  })
}

export const getLocalFolderPathsForLibrary = (localFolders, libraryIsMutable, activeLibrary) =>
  localFolders
    .filter(folder => libraryIsMutable && folder.library === activeLibrary)
    .map(folder => normalizeLibraryPath(folder.path))

export const addLocalFolder = (localFolders, activeLibrary, folderPath) => {
  const normalizedFolderPath = normalizeLibraryPath(folderPath)
  const folderAlreadyExists = localFolders.some(
    folder =>
      folder.library === activeLibrary &&
      normalizeLibraryPath(folder.path) === normalizedFolderPath,
  )

  if (folderAlreadyExists) return localFolders

  return [
    ...localFolders,
    {
      library: activeLibrary,
      path: normalizedFolderPath,
    },
  ]
}

export const removeLocalFolder = (localFolders, activeLibrary, folderPath) => {
  const normalizedFolderPath = normalizeLibraryPath(folderPath)

  return localFolders.filter(folder => {
    if (folder.library !== activeLibrary) return true

    const currentFolderPath = normalizeLibraryPath(folder.path)
    return (
      currentFolderPath !== normalizedFolderPath &&
      !currentFolderPath.startsWith(`${normalizedFolderPath}/`)
    )
  })
}
