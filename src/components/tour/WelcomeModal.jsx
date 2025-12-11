import { useEffect } from 'react';
import { useTour } from '../../context/TourContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

export default function WelcomeModal() {
    const { showWelcome, setShowWelcome, startTour, skipWelcome } = useTour();

    const handleSkip = () => {
        skipWelcome();
    };

    return (
        <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4 w-fit">
                        <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <DialogTitle className="text-2xl text-center font-bold text-gray-900 dark:text-white">
                        Welcome to Tracker Hub!
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 text-gray-600 dark:text-gray-400">
                        Your all-in-one productivity companion for habits, tasks, finances, and goals - all stored locally on your device for complete privacy.
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg my-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                    Would you like a quick tour of the features?
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleSkip} className="w-full sm:w-auto">
                        Skip Tour
                    </Button>
                    <Button onClick={startTour} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                        Get Started →
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
