/* eslint-disable no-unused-vars */
import React from 'react'
import HomeTour from './tours/HomeTour'
import LibraryTour from './tours/LibraryTour'
import ProgressTour from './tours/ProgressTour'
import AnonymousProgressTour from './tours/AnonymousProgressTour'
import PracticeTour from './tours/PracticeTour'
import LessonsTour from './tours/LessonsTour'
import useRemeasureOnPanelSlide from './useRemeasureOnPanelSlide'

// Root tour dispatcher mounted once near the app root. Each per-tour
// component renders null when not active, so the active tour is chosen
// entirely through `state.tour.name`.
const Tour = () => {
  // Steps inside a sliding panel are re-measured once the panel has finished sliding.
  useRemeasureOnPanelSlide()

  return (
    <>
      <HomeTour />
      <LibraryTour />
      <ProgressTour />
      <AnonymousProgressTour />
      <PracticeTour />
      <LessonsTour />
    </>
  )
}

export default Tour
