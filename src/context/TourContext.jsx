import { createContext, useContext, useState, useEffect } from 'react';

const TourContext = createContext();

export const useTour = () => {
    return useContext(TourContext);
};

export const TourProvider = ({ children }) => {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            setShowWelcome(true);
        }
    }, []);

    const startTour = () => {
        setRun(true);
        setStepIndex(0);
        setShowWelcome(false);
        localStorage.setItem('hasSeenTour', 'true');
    };

    const stopTour = () => {
        setRun(false);
        setStepIndex(0);
    };

    return (
        <TourContext.Provider
            value={{
                run,
                setRun,
                stepIndex,
                setStepIndex,
                showWelcome,
                setShowWelcome,
                startTour,
                stopTour,
            }}
        >
            {children}
        </TourContext.Provider>
    );
};
