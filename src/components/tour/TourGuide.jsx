import { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useTour } from '../../context/TourContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TourGuide() {
    const { run, setRun, stepIndex, setStepIndex, stopTour } = useTour();
    const navigate = useNavigate();
    const location = useLocation();

    const steps = [
        // ==================== DASHBOARD ====================
        // STEP 0: Dashboard Overview
        {
            target: '.dashboard-container',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📊 Your Command Center</h3>
                    <p>This is your Dashboard - your daily overview showing:</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Weekly task progress</li>
                        <li>Habit completion status</li>
                        <li>Finance snapshot</li>
                        <li>Quick stats at a glance</li>
                    </ul>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        // STEP 1: Navigation
        {
            target: '#sidebar-nav',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">🧭 Navigation</h3>
                    <p>Use this menu to navigate between different sections:</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li><strong>Habits</strong> - Track daily routines</li>
                        <li><strong>Tasks</strong> - Manage your to-dos</li>
                        <li><strong>Finance</strong> - Budget & expenses</li>
                        <li><strong>Vision Board</strong> - Visualize goals</li>
                    </ul>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
        },

        // ==================== HABITS ====================
        // STEP 2: Habits Overview
        {
            target: '.habits-page',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">✅ Habit Tracker</h3>
                    <p>Build consistency by tracking your daily routines!</p>
                    <p className="mt-2 text-sm text-gray-600">This is where you create habits and track your progress over time.</p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        // STEP 3: Add Habit Button
        {
            target: '#add-habit-btn',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">➕ Create a New Habit</h3>
                    <p>Click here to add a new habit you want to track.</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Give it a name (e.g., "Drink Water")</li>
                        <li>Choose a color for easy identification</li>
                        <li>Set your tracking frequency</li>
                    </ul>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
        },
        // STEP 4: Calendar Grid
        {
            target: '.calendar-grid',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📅 Monthly Calendar</h3>
                    <p>Click any day on the calendar to mark your habit as complete!</p>
                    <div className="mt-2 text-sm">
                        <p><span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span> Green = Completed</p>
                        <p><span className="inline-block w-3 h-3 bg-gray-300 rounded mr-2"></span> Gray = Not done yet</p>
                    </div>
                </div>
            ),
            placement: 'top',
            disableBeacon: true,
        },
        // STEP 5: Yearly Stats Toggle
        {
            target: '.habits-page',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📈 Yearly Stats View</h3>
                    <p>Toggle to <strong>"Yearly Stats"</strong> to see your long-term progress!</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li><strong>Progress Charts</strong> - See completion rates over months</li>
                        <li><strong>Mood Correlation</strong> - Track how habits affect your mood</li>
                        <li><strong>Year in Pixels</strong> - Visual heatmap of your year</li>
                        <li><strong>Streaks</strong> - Your best consistency records</li>
                    </ul>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },

        // ==================== TASKS ====================
        // STEP 6: Tasks Overview
        {
            target: '.tasks-page',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📝 Task Manager</h3>
                    <p>Organize all your to-dos in one place!</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Set priorities (High, Medium, Low)</li>
                        <li>Track status (Not Started, In Progress, Done)</li>
                        <li>Organize with custom categories</li>
                        <li>Set due dates for deadlines</li>
                    </ul>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        // STEP 7: Add Task Button
        {
            target: '#add-task-btn',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">➕ Create a Task</h3>
                    <p>Click here to add a new task!</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Tasks with due dates will automatically appear on your Dashboard for quick access.
                    </p>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
        },
        // STEP 8: Task Filters & Categories
        {
            target: '#task-filters',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">🔍 Filters & Categories</h3>
                    <p>Organize your tasks efficiently:</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li><strong>Filter by Priority</strong> - Focus on what matters most</li>
                        <li><strong>Filter by Status</strong> - See what's pending or done</li>
                        <li><strong>Categories</strong> - Group tasks (Work, Personal, Health, etc.)</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600">
                        💡 Tip: Use the Settings gear icon to add custom categories!
                    </p>
                </div>
            ),
            placement: 'left',
            disableBeacon: true,
        },

        // ==================== FINANCE ====================
        // STEP 9: Finance Overview
        {
            target: '.finance-page',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">💰 Finance Tracker</h3>
                    <p>Take control of your money with monthly budgeting!</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li>Track Income & Expenses</li>
                        <li>Monitor Debt Payments</li>
                        <li>Visualize with Charts</li>
                        <li>Export Data to CSV</li>
                    </ul>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        // STEP 10: Month Navigation
        {
            target: '#finance-month-nav',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📅 Month Navigation</h3>
                    <p>Switch between months to view and manage your finances!</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Each month has its own separate budget data - perfect for tracking monthly trends.
                    </p>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
        },
        // STEP 11: Stats Cards
        {
            target: '#finance-stats',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📊 Financial Overview</h3>
                    <p>Your key financial metrics at a glance:</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li><strong>Income</strong> - Total money earned</li>
                        <li><strong>Expenses</strong> - Total money spent</li>
                        <li><strong>Balance</strong> - Income minus expenses</li>
                        <li><strong>Total Balance</strong> - Click to set your bank balance</li>
                        <li><strong>Debt</strong> - Outstanding debt amount</li>
                        <li><strong>Savings Rate</strong> - Percentage of income saved</li>
                    </ul>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
        },
        // STEP 12: Finance Charts
        {
            target: '#finance-charts',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📈 Visual Charts</h3>
                    <p>Visualize your finances with interactive charts:</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li><strong>Expenses by Category</strong> - Pie chart of spending</li>
                        <li><strong>Income vs Expenses</strong> - Bar chart comparison</li>
                        <li><strong>Income by Source</strong> - Pie chart of earnings</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600">
                        💡 Click the chart type buttons to switch between Pie and Bar views!
                    </p>
                </div>
            ),
            placement: 'top',
            disableBeacon: true,
        },
        // STEP 13: Finance Tables
        {
            target: '#finance-tables',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">📝 Budget Tables</h3>
                    <p>Manage your budget with editable tables:</p>
                    <ul className="list-disc pl-4 mt-2 text-sm">
                        <li><strong>Planned Expenses</strong> - Set budget by category</li>
                        <li><strong>Planned Income</strong> - Track earnings by source</li>
                        <li><strong>Debt Tracker</strong> - Monitor loans and payments</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600">
                        Click any cell to edit. Use the + button to add rows!
                    </p>
                </div>
            ),
            placement: 'top',
            disableBeacon: true,
        },
        // STEP 14: Export Button
        {
            target: '#finance-export-btn',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">💾 Export Your Data</h3>
                    <p>Download your financial data as a CSV file!</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Great for backups or importing into spreadsheet applications like Excel or Google Sheets.
                    </p>
                </div>
            ),
            placement: 'left',
            disableBeacon: true,
        },

        // ==================== VISION BOARD ====================
        // STEP 12: Vision Board Coming Soon
        {
            target: '.vision-board-page',
            content: (
                <div>
                    <h3 className="font-bold text-lg mb-2">🎨 Vision Board</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 my-2">
                        <p className="text-yellow-800 font-medium">🚧 Work in Progress!</p>
                        <p className="text-yellow-700 text-sm mt-1">This feature is still being developed.</p>
                    </div>
                    <p className="text-sm mt-2">You can still explore and create boards to:</p>
                    <ul className="list-disc pl-4 mt-1 text-sm">
                        <li>Visualize your goals and dreams</li>
                        <li>Add images and text</li>
                        <li>Organize multiple vision boards</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600 italic">
                        💬 We'd love your feedback! Let us know what features you'd like to see.
                    </p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },

        // ==================== COMPLETION ====================
        // STEP 13: Tour Complete
        {
            target: 'body',
            content: (
                <div className="text-center">
                    <h3 className="font-bold text-2xl mb-4">🎉 You're All Set!</h3>
                    <p className="mb-4">You now know how to use Tracker Hub!</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                        <p className="font-medium">📱 Your Data is Safe</p>
                        <p>Everything is stored locally in your browser - completely private!</p>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                        You can replay this tour anytime from Settings → Help & Support
                    </p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
    ];

    const handleJoyrideCallback = (data) => {
        const { action, index, status, type } = data;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            setStepIndex(0);
            navigate('/dashboard');
        } else if (type === EVENTS.STEP_AFTER) {
            const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

            // Navigation Logic - Navigate to appropriate page based on NEXT step
            // Steps 0-1: Dashboard
            // Steps 2-5: Habits
            // Steps 6-8: Tasks
            // Steps 9-14: Finance
            // Step 15: Vision Board
            // Step 16: Completion (Dashboard)

            if (action === ACTIONS.NEXT) {
                // Navigate BEFORE showing the next step
                if (nextStepIndex === 2) {
                    navigate('/habits');
                } else if (nextStepIndex === 6) {
                    navigate('/tasks');
                } else if (nextStepIndex === 9) {
                    navigate('/finance');
                } else if (nextStepIndex === 15) {
                    navigate('/vision-board');
                } else if (nextStepIndex === 16) {
                    navigate('/dashboard');
                }
            } else if (action === ACTIONS.PREV) {
                // Navigate back when going to previous step
                if (nextStepIndex === 1) {
                    navigate('/dashboard');
                } else if (nextStepIndex === 5) {
                    navigate('/habits');
                } else if (nextStepIndex === 8) {
                    navigate('/tasks');
                } else if (nextStepIndex === 14) {
                    navigate('/finance');
                } else if (nextStepIndex === 15) {
                    navigate('/vision-board');
                }
            }

            // Add delay to allow page to render before showing next step
            setTimeout(() => {
                setStepIndex(nextStepIndex);
            }, 500);
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            stepIndex={stepIndex}
            continuous
            showSkipButton
            showProgress
            scrollToFirstStep
            disableOverlayClose={true}
            disableScrolling={false}
            spotlightPadding={15}
            callback={handleJoyrideCallback}
            debug={false}
            locale={{
                back: 'Back',
                close: 'Close',
                last: 'Finish',
                next: 'Next',
                skip: 'Skip Tour',
            }}
            styles={{
                options: {
                    primaryColor: '#f97316',
                    zIndex: 10000,
                    textColor: '#374151',
                    backgroundColor: '#ffffff',
                    arrowColor: '#ffffff',
                    overlayColor: 'rgba(0, 0, 0, 0.6)',
                },
                spotlight: {
                    borderRadius: 12,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 30px 10px rgba(249, 115, 22, 0.4)',
                },
                tooltip: {
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                tooltipContent: {
                    padding: '10px 0',
                },
                tooltipTitle: {
                    fontSize: 18,
                    fontWeight: 700,
                },
                buttonNext: {
                    backgroundColor: '#f97316',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontWeight: 600,
                },
                buttonBack: {
                    marginRight: 10,
                    color: '#6b7280',
                    borderRadius: 8,
                },
                buttonSkip: {
                    color: '#9ca3af',
                },
                beacon: {
                    display: 'none',
                },
                beaconInner: {
                    backgroundColor: '#f97316',
                },
                beaconOuter: {
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                },
            }}
            floaterProps={{
                disableAnimation: false,
                styles: {
                    floater: {
                        filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15))',
                    },
                },
            }}
        />
    );
}
