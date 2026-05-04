import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import QuestionsSteps from "./_components/questions-steps";
import { getApiBase, authHeaders, isApiFailure, apiErrorMessage } from "@/lib/api";

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

type ApiAnswer = {
    id: string;
    text: string;
    isCorrect?: boolean;
};

type ApiQuestion = {
    id: string;
    text: string;
    answers?: ApiAnswer[];
    createdAt?: string;
    exam?: { id: string; title: string };
};

function mapApiQuestion(q: ApiQuestion, examFallback: Exam): Question {
    const answers: Answer[] = (q.answers ?? []).map((a) => ({
        key: a.id,
        answer: a.text,
    }));
    const correct =
        q.answers?.find((a) => a.isCorrect === true)?.id ?? "";

    return {
        type: "multiple",
        _id: q.id,
        question: q.text,
        answers,
        correct,
        subject: null,
        createdAt: q.createdAt ?? "",
        exam: q.exam
            ? {
                  _id: q.exam.id,
                  title: q.exam.title,
                  duration: examFallback.duration,
                  subject: examFallback.subject,
                  numberOfQuestions: examFallback.numberOfQuestions,
                  active: examFallback.active,
              }
            : examFallback,
    };
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

    let examDuration = 60;
    const examParam = examId ? decodeURIComponent(examId) : '';

    let examFallback: Exam = {
        _id: examParam,
        title: "",
        duration: examDuration,
        subject: subjectId ?? "",
        numberOfQuestions: 0,
        active: true,
    };

    if (examParam) {
        try {
            const examResponse = await fetch(
                `${getApiBase()}/exams/${encodeURIComponent(examParam)}`,
                {
                    headers: {
                        ...authHeaders(accessToken),
                    },
                }
            );

            if (examResponse.ok) {
                const examData = await examResponse.json();
                const rawExam =
                    examData.exam ??
                    examData.payload?.exam ??
                    examData.payload ??
                    examData;
                const e = rawExam as Record<string, unknown>;
                const id = String(e.id ?? e._id ?? examParam);
                const diplomaId = String(e.diplomaId ?? e.subject ?? "");
                examFallback = {
                    _id: id,
                    title: String(e.title ?? ""),
                    duration: Number(e.duration ?? examDuration),
                    subject: diplomaId,
                    numberOfQuestions: Number(
                        e.questionsCount ?? e.numberOfQuestions ?? 0
                    ),
                    active: Boolean(e.active ?? true),
                };
                examDuration = examFallback.duration;
            }
        } catch (error) {
            console.error('Failed to fetch exam duration:', error);
        }
    }

    const response = await fetch(
        `${getApiBase()}/questions/exam/${encodeURIComponent(examParam)}`,
        {
            headers: {
                ...authHeaders(accessToken),
            },
        }
    );

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        return (
            <div className="p-6 text-red-600 font-geistMono">
                {apiErrorMessage(body, "Failed to fetch questions")}
            </div>
        );
    }

    const data = await response.json();
    if (isApiFailure(data)) {
        return (
            <div className="p-6 text-red-600 font-geistMono">
                {apiErrorMessage(data, "Failed to fetch questions")}
            </div>
        );
    }

    const payload = data.payload as { questions?: ApiQuestion[] } | undefined;
    const rawQuestions: ApiQuestion[] =
        payload?.questions ??
        (data as { questions?: ApiQuestion[] }).questions ??
        [];

    const questions: Question[] = rawQuestions.map((q) =>
        mapApiQuestion(q, examFallback)
    );

    if (questions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-white p-6">
                <p className="text-gray-600 font-geistMono">No questions available</p>
            </div>
        );
    }

    return <QuestionsSteps questions={questions} examDuration={examDuration} />;
}
