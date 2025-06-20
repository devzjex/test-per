import { useEffect, useState } from 'react';

export const Counter = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const stepTime = 1000 / 60;
        const totalSteps = Math.round(duration / stepTime);
        let currentStep = 0;

        const step = () => {
            currentStep++;
            const progress = currentStep / totalSteps;
            const value = Math.floor(progress * end);
            setCount(value);

            if (currentStep < totalSteps) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(step);
    }, [end, duration]);

    return <>{count.toLocaleString('en-US')}</>;
};
