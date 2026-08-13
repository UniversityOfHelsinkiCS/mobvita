import React, { useEffect, useRef, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


import './RecommendSliderCss.css';

const RecommendSlider = ({ slides }) => {
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(undefined);
    const [filteredSlides, setFilteredSlides] = useState([]);
    const [containerHeight, setContainerHeight] = useState('23vh');

    const slideContainerRef = useRef(null);

    useEffect(() => {
        const filteredSlidesArray = [];
        slides.forEach((slide, index) => {
            if (slide != undefined) {
                filteredSlidesArray.push(slide);
            }
        });
        setFilteredSlides(filteredSlidesArray);
        setLength(filteredSlidesArray.length);

        // if (slideContainerRef.current) {
        //     const { height } = slideContainerRef.current.getBoundingClientRect();
        //     setButtonHeight(`${height}px`);
        // }
    }, [slides]);


    const nextSlide = () => {
        if (length != undefined && length > 0) {
            setCurrent(current === length - 1 ? 0 : current + 1);
        }
    };

    const prevSlide = () => {
        if (length != undefined && length > 0) {
            setCurrent(current === 0 ? length - 1 : current - 1);
        }
    };

    const goToSlide = (index) => {
        if (length != undefined && length > 0 && index >= 0 && index < length) {
            setCurrent(index);
        }
    }

    if (!Array.isArray(filteredSlides) || slides.length <= 0) {
        return null;
    }

    if (length > 0) {
        return (
            <section className='slider'>
                <div className='slider-content'>
                    <button
                        className='left-arrow'
                        onClick={prevSlide}
                        onTouchEnd={prevSlide}
                        style={{ height: containerHeight }}
                        data-cy='recommend-slider-prev-button'
                    >
                        <ChevronLeftIcon
                            className='left-arrow'
                            style={{ cursor: 'pointer' }}
                        />
                    </button>

                    <div className='content-container' style={
                        {
                            height: containerHeight,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            paddingLeft: '1em',
                            width: '100%'
                        }
                    }>
                        <div
                            className='slide-container'
                            ref={slideContainerRef}
                            style={{
                                display: "flex",
                                height: "100%",
                                alignItems: "center"
                            }}
                        >
                            <div className='slide active' key={current}>
                                {filteredSlides[current]}
                            </div>
                        </div>
                    </div>

                    <button
                        className='right-arrow'
                        onClick={nextSlide}
                        onTouchEnd={nextSlide}
                        style={{ height: containerHeight }}
                        data-cy='recommend-slider-next-button'
                    >
                        <ChevronRightIcon
                            className='right-arrow'
                            style={{ cursor: 'pointer' }}
                        />
                    </button>
                </div>
                <div className='pagination'>
                    {filteredSlides.map((_, index) => (
                        <span
                            key={index}
                            className={index === current ? 'dot active' : 'dot'}
                            onClick={() => goToSlide(index)}
                            onTouchEnd={() => goToSlide(index)}
                            data-cy={`recommend-slider-dot-${index}`}
                        ></span>
                    ))}
                </div>
            </section>
        );
    } else {
        return null
    }

};

export default RecommendSlider;
