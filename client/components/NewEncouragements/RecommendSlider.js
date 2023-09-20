import React, { useEffect, useRef, useState } from 'react';
import { Segment, Icon } from 'semantic-ui-react'

import './RecommendSliderCss.css';

const RecommendSlider = ({ slides }) => {
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(undefined);
    const [filteredSlides, setFilteredSlides] = useState([]);
    const [buttonHeight, setButtonHeight] = useState('auto');

    const slideContainerRef = useRef(null);
    setButtonHeight('17vh')

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
        if (length != undefined && length > 0){
            setCurrent(current === length - 1 ? 0 : current + 1);
        }
    };

    const prevSlide = () => {
        if (length != undefined && length > 0){
            setCurrent(current === 0 ? length - 1 : current - 1);
        }
    };

    if (!Array.isArray(filteredSlides) || slides.length <= 0) {
        return null;
    }

    return (
        <section className='slider'>
            <div className='slider-content'>
                <button className='left-arrow' onClick={prevSlide} style={{ height: buttonHeight }}>
                    <Icon
                        className='left-arrow'
                        name={'chevron left'}
                        style={{ cursor: 'pointer' }}
                    />
                </button>
                <div className='content-container' style={{height: buttonHeight, overflowY: 'auto', overflowX: 'hidden'}}>
                    <div className='slide-container' ref={slideContainerRef}>
                        <div className='slide active' key={current}>
                            {filteredSlides[current]}
                        </div>
                    </div>
                </div>

                
                <button className='right-arrow' onClick={nextSlide} style={{ height: buttonHeight }}>
                    <Icon
                        className='right-arrow'
                        name={'chevron right'}
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
                ></span>
                ))}
            </div>
        </section>
    );
};

export default RecommendSlider;
