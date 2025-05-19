import React from 'react';
import { BookOpen, Clock, Target, TrendingUp, Calendar, Award } from 'lucide-react';

export const HowToUse = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent text-center animate-fade-in">
                    How to Use MemoryBoost
                </h1>

                <section className="mb-8 sm:mb-12 animate-slide-up">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Getting Started
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-300">
                        <p className="text-sm sm:text-base leading-relaxed">Welcome to MemoryBoost! This guide will help you understand how to effectively use our spaced repetition flashcard system.</p>
                        <ol className="list-decimal list-inside space-y-2 sm:space-y-3 ml-2 sm:ml-4 text-sm sm:text-base">
                            <li className="hover:translate-x-2 transition-transform duration-300">Create your first deck from the dashboard</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Add flashcards to your deck (front = question, back = answer)</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Start reviewing cards when they become due</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Track your progress through the dashboard</li>
                        </ol>
                    </div>
                </section>

                <section className="mb-8 sm:mb-12 animate-slide-up">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Card Review Process
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-300">
                        <p className="text-sm sm:text-base leading-relaxed">Our spaced repetition system helps you learn efficiently:</p>
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4 md:p-5 mb-3 sm:mb-4">
                            <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-200 font-medium">
                                Note: The review intervals used are for testing and evaluation purposes. In reality, these intervals will be based on days instead of seconds.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 transform hover:scale-[1.02] transition-transform duration-300">
                            <h3 className="font-medium text-base sm:text-lg text-gray-800 dark:text-gray-100">Review Timing:</h3>
                            <ul className="list-disc list-inside space-y-2 sm:space-y-3 ml-2 sm:ml-4 text-sm sm:text-base">
                                <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">New cards:</span>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">Due immediately</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-green-600 dark:text-green-400">Correct answers:</span>
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">Next review in 40 seconds</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-red-600 dark:text-red-400">Incorrect answers:</span>
                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">Next review in 30 seconds</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">Mastered cards:</span>
                                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">Next review in 60 seconds</span>
                                </li>
                            </ul>
                        </div>
                        <p className="mt-3 sm:mt-4 font-medium text-sm sm:text-base">When reviewing a card:</p>
                        <ol className="list-decimal list-inside space-y-2 sm:space-y-3 ml-2 sm:ml-4 text-sm sm:text-base">
                            <li className="hover:translate-x-2 transition-transform duration-300">Click the card to reveal the answer</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Choose "I Knew It" or "I Didn't Know It"</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">The system will schedule your next review based on your response</li>
                        </ol>
                    </div>
                </section>

                <section className="mb-8 sm:mb-12 animate-slide-up">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Mastery System
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-300">
                        <p className="text-sm sm:text-base leading-relaxed">Cards progress through different stages:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 sm:p-4 md:p-5 transform hover:scale-[1.02] transition-all duration-300">
                                <h3 className="font-medium text-base sm:text-lg text-blue-700 dark:text-blue-300 mb-1 sm:mb-2">New Cards</h3>
                                <p className="text-sm sm:text-base">Cards you haven't reviewed yet</p>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 sm:p-4 md:p-5 transform hover:scale-[1.02] transition-all duration-300">
                                <h3 className="font-medium text-base sm:text-lg text-yellow-700 dark:text-yellow-300 mb-1 sm:mb-2">Learning Cards</h3>
                                <p className="text-sm sm:text-base">Cards with 1-2 consecutive correct answers</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 sm:p-4 md:p-5 transform hover:scale-[1.02] transition-all duration-300">
                                <h3 className="font-medium text-base sm:text-lg text-purple-700 dark:text-purple-300 mb-1 sm:mb-2">Review Cards</h3>
                                <p className="text-sm sm:text-base">Cards that need regular review</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 sm:p-4 md:p-5 transform hover:scale-[1.02] transition-all duration-300">
                                <h3 className="font-medium text-base sm:text-lg text-green-700 dark:text-green-300 mb-1 sm:mb-2">Mastered Cards</h3>
                                <p className="text-sm sm:text-base">Cards with 3+ consecutive correct answers</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-8 sm:mb-12 animate-slide-up">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Progress Tracking
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-300">
                        <p className="text-sm sm:text-base leading-relaxed">Monitor your learning progress through:</p>
                        <ul className="list-disc list-inside space-y-2 sm:space-y-3 ml-2 sm:ml-4 text-sm sm:text-base">
                            <li className="hover:translate-x-2 transition-transform duration-300">Daily study streaks</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Mastery percentage per deck</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Total cards reviewed</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Accuracy statistics</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8 sm:mb-12 animate-slide-up">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Study Schedule
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-300">
                        <p className="text-sm sm:text-base leading-relaxed">Cards are scheduled for review based on your performance:</p>
                        <ul className="list-disc list-inside space-y-2 sm:space-y-3 ml-2 sm:ml-4 text-sm sm:text-base">
                            <li className="hover:translate-x-2 transition-transform duration-300">New cards appear immediately</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Correct answers increase the interval</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Incorrect answers decrease the interval</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Mastered cards have longer intervals</li>
                        </ul>
                    </div>
                </section>

                <section className="animate-slide-up">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Tips for Success
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-300">
                        <ul className="list-disc list-inside space-y-2 sm:space-y-3 ml-2 sm:ml-4 text-sm sm:text-base">
                            <li className="hover:translate-x-2 transition-transform duration-300">Review cards daily to maintain your streak</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Be honest with your "I Knew It" responses</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Create focused, specific decks for different topics</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Use the dashboard to track your progress</li>
                            <li className="hover:translate-x-2 transition-transform duration-300">Review mastered cards periodically to maintain knowledge</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}; 