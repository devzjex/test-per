'use client';
import { useEffect, useRef, useState } from 'react';
import './FadeInSection.scss';

const FadeInSection = (props) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries) {
                entries.forEach((entry) => entry.boundingClientRect.bottom > 0 && setVisible(entry.isIntersecting));
            }
        });
        observer.observe(domRef.current);
    }, []);
    return (
        <div className={`fade-in-section ${isVisible ? 'is-visible' : ''}`} ref={domRef}>
            {props.children}
        </div>
    );
};

export default FadeInSection;
