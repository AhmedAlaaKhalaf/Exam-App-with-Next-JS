'use client';

import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import QuestionView from './question-view';
import Result from './result';

type Answer = {
  answer: string;
  key: string;
};

type Exam = {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: boolean;
};

type Question = {
  type: string;
  _id: string;
  question: string;
  answers: Answer[];
  correct: string;
  subject: string | null;
  createdAt: string;
  exam: Exam;
};

type QuestionsStepsProps = {
  questions: Question[];
  examDuration: number; // Duration in minutes
};

export default function QuestionsSteps({ questions, examDuration }: QuestionsStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === questions.length - 1;

  const handleAnswerChange = (questionId: string, answerKey: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerKey,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      // Show results when on last question and clicking Next
      setShowResults(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Allow users to submit and view results at any time
    setShowResults(true);
  };

  const handleTimeUp = () => {
    // Automatically show results when time is up
    setShowResults(true);
  };

  const handleRestart = () => {
    // Reset to first question and clear results
    setCurrentStep(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (!currentQuestion) {
    return <div>No questions available</div>;
  }

  const progressValue = ((currentStep + 1) / questions.length) * 100;
  const currentQuestionIndex = currentStep + 1;

  // Show results component
  if (showResults) {
    return (
      <div className="flex flex-col gap-6 bg-white p-6 h-full">
        <Result 
          questions={questions} 
          selectedAnswers={selectedAnswers} 
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // Show question view
  return (
    <div className="flex flex-col gap-6 bg-white p-6">
      <div className="flex justify-between items-center">
        <p className="text-sm font-geistMono text-gray-600">
          Frontend Development - {currentQuestion.exam.title}
        </p>
        <p className="text-sm font-geistMono text-gray-600">
          Question: {currentQuestionIndex} of {questions.length}
        </p>
      </div>
      {/* Progress indicator */}
      <Progress value={progressValue} />

      <QuestionView
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswers[currentQuestion._id]}
        onAnswerChange={handleAnswerChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        onTimeUp={handleTimeUp}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        examDuration={examDuration}
      />
    </div>
  );
}

