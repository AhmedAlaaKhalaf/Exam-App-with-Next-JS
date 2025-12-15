import { authOption } from "@/auth";
import { Timer } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

type Exam = {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: boolean;
};
type Metadata = {
  currentPage: number;
  numberOfPages: number;
  limit: number;
};
type ExamsResponse = {
  message: string;
  metadata: Metadata;
  exams: Exam[];
};



export default async function ExamsList() {
  const session = await getServerSession(authOption);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return <div>Not authenticated</div>;
  }

  const response = await fetch(`https://exam.elevateegy.com/api/v1/exams`, {
    headers: {
      token: accessToken,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch exams");
  }

  const data: ExamsResponse = await response.json();
  const exams = data.exams;
  

  // If no exams found for this subject
  if (exams.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 font-normal font-geistMono text-center">
          No exams found for this subject.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-6 h-full">
      {exams?.map((exam: Exam) => (
        <Link
          key={exam._id}
          href={`/dashboard/exams/${exam._id}?subject=${exam.subject}`}
          className="flex justify-between items-center bg-blue-50 p-4 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <div className="flex flex-col gap-1">
            <p className="text-blue-600 font-semibold text-xl font-geistMono">
              {exam.title}
            </p>
            <p className="text-gray-500 font-normal text-sm font-geistMono">
              {exam.numberOfQuestions} Questions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="text-gray-400 w-6 h-6" />
            <p className="text-gray-800 font-medium font-geistMono text-sm">
              Duration: {exam.duration} minutes
            </p>
          </div>
        </Link>
      ))}
      <p className="text-gray-600 font-normal font-geistMono text-center mt-3">
        End of list
      </p>
    </div>
  );
}
