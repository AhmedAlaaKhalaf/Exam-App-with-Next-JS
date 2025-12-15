'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ExamCountdown } from './exam-countdown';

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

type QuestionViewProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswerChange: (questionId: string, answerKey: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onTimeUp: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  examDuration: number;
};

export default function QuestionView({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  onNext,
  onPrevious,
  onSubmit,
  onTimeUp,
  isFirstStep,
  isLastStep,
  examDuration,
}: QuestionViewProps) {
  return (
    <>
      {/* Current Question */}
      <div className="flex-1 flex flex-col gap-6">
        <h2 className="text-2xl font-geistMono font-semibold text-primary">
          {question.question}
        </h2>
        
        <div className="flex flex-col gap-3">
          {question.answers.map((answer) => (
            <label
              key={answer.key}
              htmlFor={`${question._id}-${answer.key}`}
              className={`bg-gray-50 font-geistMono p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedAnswer === answer.key
                  ? 'bg-blue-50 border-2 border-primary'
                  : 'border-2 border-transparent'
              }`}
            >
              <input
                type="radio"
                id={`${question._id}-${answer.key}`}
                name={question._id}
                value={answer.key}
                checked={selectedAnswer === answer.key}
                onChange={() => onAnswerChange(question._id, answer.key)}
                className="w-4 h-4"
              />
              <span>{answer.answer}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 gap-4">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`flex items-center justify-center gap-2 flex-1 py-4 font-geistMono font-medium transition-colors ${
            isFirstStep
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <ExamCountdown 
          durationMinutes={examDuration}
          onTimeUp={onTimeUp}
        />
        <button
          onClick={isLastStep ? onSubmit : onNext}
          className={`flex items-center justify-center gap-2 flex-1 py-4 font-geistMono font-medium bg-primary text-white hover:bg-primary/90 transition-colors`}
        >
          {isLastStep ? (
            <>
              Finish
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </>
  );
}

