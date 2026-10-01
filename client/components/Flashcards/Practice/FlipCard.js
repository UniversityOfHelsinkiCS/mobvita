import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFlip } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-flip'

// Matches react-card-flip's default turn, which the card's own timings were tuned against (the
// back's verdict appears mid-turn, the front's 500ms after it).
const FLIP_SPEED_MS = 600

/**
 * FlipCard — the two faces of a flashcard, turned with Swiper's flip effect.
 *
 * Same contract as the react-card-flip it replaces: `isFlipped` drives it and the two children are
 * front then back, both always mounted (FlashcardBack relies on that to gate its verdict).
 *
 * It lives inside the deck's own Swiper, so `allowTouchMove` is off and `nested` is set: the card
 * only ever turns from its own controls, and a horizontal drag still belongs to the deck.
 */
const FlipCard = ({ isFlipped, children }) => {
  const swiperRef = useRef(null)
  const [front, back] = React.Children.toArray(children)

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper || swiper.destroyed) return

    const target = isFlipped ? 1 : 0
    if (swiper.activeIndex !== target) swiper.slideTo(target)
  }, [isFlipped])

  return (
    <Swiper
      onSwiper={instance => {
        swiperRef.current = instance
      }}
      className="flashcard-flip"
      effect="flip"
      modules={[EffectFlip]}
      flipEffect={{ slideShadows: false }}
      speed={FLIP_SPEED_MS}
      allowTouchMove={false}
      simulateTouch={false}
      nested
      slidesPerView={1}
    >
      <SwiperSlide>{front}</SwiperSlide>
      <SwiperSlide>{back}</SwiperSlide>
    </Swiper>
  )
}

export default FlipCard
