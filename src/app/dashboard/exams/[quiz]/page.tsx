import { ChevronLeft, CircleQuestionMark } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Questions from "./questions/page";
import { authOption } from "@/auth";
import { getServerSession } from "next-auth";

type Props = {
  params: {
    quiz: string;
  };
  searchParams: { subject?: string };
};

type Exam = {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: boolean;
};

export default async function Quiz({ params, searchParams }: Props) {
  const examId = params.quiz;
  const subjectId = searchParams.subject || '';
  
  // Fetch exam details to get the title
  const session = await getServerSession(authOption);
  const accessToken = session?.accessToken;
  
  let examTitle = examId; // Fallback to ID
  
  if (accessToken) {
    try {
      const response = await fetch(`https://exam.elevateegy.com/api/v1/exams/${examId}`, {
        headers: {
          token: accessToken,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const exam: Exam = data.exam || data;
        if (exam && exam.title) {
          examTitle = exam.title;
        }
      }
    } catch (error) {
      console.error('Failed to fetch exam:', error);
    }
  }

  console.log(examId, subjectId);

    return (
      <div className="p-0 bg-gray-50 flex-grow">
        <div className="p-6 flex flex-col gap-6 h-full">
          <div className="flex justify-center items-stretch gap-4">
            <Link
              href="/dashboard/exams"
              className="cursor-pointer bg-white border border-primary flex justify-center items-center px-2 py-4 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="text-primary w-6 h-6" />
            </Link>
            <header className="flex items-center gap-4 bg-primary p-4 w-full">
              <div className="icon">
                <CircleQuestionMark className="text-white w-10 h-10" />
              </div>
              <div className="font-inter">
                <p className="font-semibold text-white text-[2rem] capitalize">
                  [{examTitle}] Questions
                </p>
              </div>
            </header>
          </div>
          <div className="exams flex-grow">
            {/* suspense boudary | loading boundary */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[75vh] w-full">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                </div>
              }
            >
              <Questions examId={examId} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

