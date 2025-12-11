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
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        const hasCompletedTour = localStorage.getItem('hasCompletedTour');
        
        // Show welcome modal only if user hasn't seen it before
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const startTour = () => {
        setRun(true);
        setStepIndex(0);
        setShowWelcome(false);
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    const completeTour = () => {
        setRun(false);
        setStepIndex(0);
        localStorage.setItem('hasCompletedTour', 'true');
    };

    const stopTour = () => {
        setRun(false);
        setStepIndex(0);
    };

    const skipWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    const restartTour = () => {
        // Reset all tour states and start fresh
        localStorage.removeItem('hasCompletedTour');
        setRun(true);
        setStepIndex(0);
        setShowWelcome(false);
    };

    const resetWelcome = () => {
        // Reset welcome modal state - useful for testing or if user wants to see it again
        localStorage.removeItem('hasSeenWelcome');
        localStorage.removeItem('hasCompletedTour');
        setShowWelcome(true);
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
                completeTour,
                skipWelcome,
                restartTour,
                resetWelcome,
            }}
        >
            {children}
        </TourContext.Provider>
    );
};
