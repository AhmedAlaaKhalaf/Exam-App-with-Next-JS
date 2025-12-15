import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import QuestionsSteps from "./_components/questions-steps";

type Answer = {
    answer: string;
    key: string;
}

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
}

export type ExamResponse = {
    message: string
    questions: Question[]
}


type QuestionsProps = {
  subjectId?: string;
  examId?: string;
};

export default async function Questions({ subjectId, examId }: QuestionsProps) {
    const session = await getServerSession(authOption);
    const accessToken = session?.accessToken;

    if (!accessToken) {
        return <div>Not authenticated</div>;
    }

    // Fetch exam details to get duration
    let examDuration = 60; // Default fallback
    const examParam = examId ? decodeURIComponent(examId) : '';
    
    if (examParam) {
        try {
            const examResponse = await fetch(`https://exam.elevateegy.com/api/v1/exams/${encodeURIComponent(examParam)}`, {
                headers: {
                    token: accessToken,
                },
            });
            
            if (examResponse.ok) {
                const examData = await examResponse.json();
                const exam: Exam = examData.exam || examData;
                if (exam && exam.duration) {
                    examDuration = exam.duration;
                }
            }
        } catch (error) {
            console.error('Failed to fetch exam duration:', error);
        }
    }

    // Fetch questions
    const response = await fetch(`https://exam.elevateegy.com/api/v1/questions?exam=${examParam}`, {
        headers: {
            token: accessToken,
        },
    });
    
    if (!response.ok) {
        return <div>Failed to fetch questions</div>;
    }

    const data = await response.json();
    const questions: Question[] = data.questions || [];

    if (questions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-white p-6">
                <p className="text-gray-600 font-geistMono">No questions available</p>
            </div>
        );
    }

    return <QuestionsSteps questions={questions} examDuration={examDuration} />;
}