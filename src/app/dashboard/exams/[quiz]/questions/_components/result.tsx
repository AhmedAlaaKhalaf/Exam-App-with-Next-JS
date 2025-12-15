'use client';

import { Progress } from '@/components/ui/progress';
import { ChartPieDonutText } from '@/components/ui/chart-pie-donut-text';
import Link from 'next/link';
import { RotateCcw, FolderOpen } from 'lucide-react';

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

type ResultProps = {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  onRestart?: () => void;
};

export default function Result({ questions, selectedAnswers, onRestart }: ResultProps) {
  // Calculate score
  const correctAnswers = questions.filter(
    (question) => selectedAnswers[question._id] === question.correct
  ).length;
  const totalQuestions = questions.length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  // Get exam info from first question (all questions have the same exam)
  const examTitle = questions[0]?.exam?.title || '';

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p className="text-sm font-geistMono text-gray-600">
          Frontend Development - {examTitle}
        </p>
        <p className="text-sm font-geistMono text-gray-600">
          Question: {totalQuestions} of {totalQuestions}
        </p>
      </div>
      {/* Progress indicator - full at 100% */}
      <Progress value={100} />
      
      <div className="flex gap-6">
        <div className="flex flex-col gap-6 w-80">
          <h3 className="text-xl font-geistMono font-semibold text-primary">
            Results:
          </h3>
          
          {/* Pie Chart */}
          <div className="flex justify-center">
            <ChartPieDonutText 
              remainingSeconds={correctAnswers}
              totalSeconds={totalQuestions}
              formattedTime={`${totalQuestions}`}
              remainingColor="rgb(16, 185, 129)" // emerald-500 for correct
              elapsedColor="rgb(239, 68, 68)" // red-500 for incorrect
              showLabel={false}
              innerRadius={45}
              outerRadius={75}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-emerald-500"></div>
              <span className="text-sm font-geistMono">Correct: {correctAnswers}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm font-geistMono">Incorrect: {incorrectAnswers}</span>
            </div>
          </div>
        </div>

        {/* Right side - Question review */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="border border-gray-100 overflow-y-auto h-[514px]">
        {questions.map((question, index) => {
          const userAnswer = selectedAnswers[question._id];
          const isCorrect = userAnswer === question.correct;
          
          return (
            <div
              key={question._id}
              className="flex flex-col gap-4 p-6"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xl font-geistMono font-semibold text-primary">
                  Question {index + 1}: {question.question}
                </h4>
              </div>
              
              <div className="flex flex-col gap-3">
                {question.answers.map((answer) => {
                  const isCorrectAnswer = answer.key === question.correct;
                  const isUserAnswer = answer.key === userAnswer && !isCorrect;
                  
                  let labelClass = 'bg-red-50 font-geistMono p-4 flex items-center gap-3';
                  
                  if (isCorrectAnswer) {
                    labelClass = 'bg-emerald-50 font-geistMono p-4 flex items-center gap-3';
                  } else if (isUserAnswer) {
                    labelClass = 'bg-red-50 font-geistMono p-4 flex items-center gap-3';
                  }
                  
                  return (
                    <label
                      key={answer.key}
                      htmlFor={`${question._id}-${answer.key}-result`}
                      className={labelClass}
                    >
                      <input
                        type="radio"
                        id={`${question._id}-${answer.key}-result`}
                        name={`${question._id}-result`}
                        value={answer.key}
                        checked={isCorrectAnswer}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span>{answer.answer}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>
                {/* Buttons  */}
        <div className="flex gap-3 mt-4">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-geistMono font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Restart
            </button>
            <Link
              href="/dashboard/exams"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white hover:bg-primary/90 transition-colors font-geistMono font-medium"
            >
              <FolderOpen className="w-5 h-5" />
              Explore
            </Link>
          </div>
    </div>
  );
}

