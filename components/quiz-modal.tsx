"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressRing from "./progress-ring";

const quizzes = [
  {
    question:
      "You are on a call with a customer who keeps asking unrelated questions. What is the best way to maintain focus and guide the conversation?",
    options: [
      "Politely acknowledge their concerns and redirect them to the topic at hand.",
      "Ignore their unrelated questions and continue with your agenda.",
      "Allow them to continue and address every question they ask.",
      "End the call and suggest a follow-up.",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "A customer says 'I need to think about it.' What's the best response?",
    options: [
      "Understand their concerns and offer to address specific questions",
      "Tell them this is a limited-time offer",
      "Say 'Okay' and end the call",
      "Ask if they want to speak to a manager",
    ],
    correctAnswer: 0,
  },
];

export function QuizModal({ onClose }: { onClose: () => void }) {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!quizCompleted && timeLeft > 0 && selectedAnswer === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleAnswerSelect(-1); // Auto-select wrong answer if time runs out
    }

    return () => clearInterval(timerRef.current);
  }, [currentQuiz, timeLeft, selectedAnswer, quizCompleted]);

  const handleAnswerSelect = (index: number) => {
    clearInterval(timerRef.current);
    setSelectedAnswer(index);

    // Check if answer is correct
    if (index === quizzes[currentQuiz].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question or complete quiz
    setTimeout(() => {
      if (currentQuiz < quizzes.length - 1) {
        setCurrentQuiz(currentQuiz + 1);
        setSelectedAnswer(null);
        setTimeLeft(30); // Reset timer for next question
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(30);
  };

  // Calculate progress bar width
  const progressWidth =
    selectedAnswer !== null ? 100 : ((30 - timeLeft) / 30) * 100;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-gray-900 rounded-3xl w-3/4 h-auto border-2 shadow-slate-100 border-white overflow-hidden shadow-lg">
        {/* Progress bar with timer */}
        {!quizCompleted && (
          <div className="items-center justify-center flex flex-col p-3">
            <ProgressRing
              progress={progressWidth}
              size={120}
              strokeWidth={12}
              timeLeft={timeLeft}
              text={`${currentQuiz + 1}`}
            />
          </div>
        )}

        {/* Quiz Content */}
        <div className="p-8">
          {!quizCompleted ? (
            <>
              <div className="mb-8 p-8">
                <h3 className="text-xl font-medium leading-relaxed border border-white rounded-full p-8">
                  {quizzes[currentQuiz].question}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quizzes[currentQuiz].options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-6 border transition-colors text-md ${
                      selectedAnswer == null
                        ? "border-gray-700 hover:bg-green-500"
                        : index === quizzes[currentQuiz].correctAnswer
                        ? "border-green-500 bg-green-500/10"
                        : selectedAnswer === index
                        ? "border-red-500 bg-red-500/10"
                        : "border-gray-700 opacity-70"
                    } ${"rounded-tr-none rounded-bl-none rounded-tl-3xl rounded-br-3xl"}`}
                    onClick={() =>
                      selectedAnswer === null && handleAnswerSelect(index)
                    }
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 flex flex-col">
              <div className="text-2xl mb-8 flex items-center justify-center flex-col">
                <h3 className="text-5xl mb-2">Score</h3>
                <ProgressRing
                  progress={(score / quizzes.length) * 100}
                  size={120}
                  strokeWidth={12}
                  text={`${score}/${quizzes.length}`}
                />
              </div>
              <div className="text-xl mb-10 items-end">
                <p>
                  "Hey, practice makes... almost perfect! Tomorrow's your
                  redemption day!"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
