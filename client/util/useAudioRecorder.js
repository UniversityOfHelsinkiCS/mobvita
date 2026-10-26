import { useState, useRef, useEffect, useCallback } from 'react'

// Records microphone audio with the browser's MediaRecorder (default format: webm, ogg or mp4).
// `recordingBlob` is set when a recording stops; `onError` gets permission or device errors.
const useAudioRecorder = (audioConstraints = true, onError) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingBlob, setRecordingBlob] = useState(null)
  const recorderRef = useRef(null)

  // Asks for the microphone and starts recording; ignored while a recording is running.
  const startRecording = useCallback(() => {
    if (recorderRef.current) return
    navigator.mediaDevices
      .getUserMedia({ audio: audioConstraints })
      .then(stream => {
        const recorder = new MediaRecorder(stream)
        recorder.addEventListener('dataavailable', event => {
          setRecordingBlob(event.data)
          stream.getTracks().forEach(track => track.stop())
          recorderRef.current = null
        })
        recorderRef.current = recorder
        recorder.start()
        setIsRecording(true)
      })
      .catch(error => {
        console.log(error.name, error.message)
        onError?.(error)
      })
  }, [audioConstraints, onError])

  // Stops recording; the blob arrives through `recordingBlob` once the recorder flushes.
  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  // Releases the microphone if the component unmounts mid-recording.
  useEffect(
    () => () => {
      const recorder = recorderRef.current
      if (recorder && recorder.state !== 'inactive') {
        recorder.stream.getTracks().forEach(track => track.stop())
      }
    },
    [],
  )

  return { startRecording, stopRecording, isRecording, recordingBlob }
}

export default useAudioRecorder
