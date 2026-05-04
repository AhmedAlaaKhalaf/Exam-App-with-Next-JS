import { authOption } from "@/auth";
import { Timer } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getApiBase, authHeaders, isApiFailure, apiErrorMessage } from "@/lib/api";

type Exam = {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: boolean;
};

type PaginationMetadata = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default async function ExamsList({
  diplomaId,
}: {
  diplomaId?: string;
}) {
  const session = await getServerSession(authOption);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return <div>Not authenticated</div>;
  }

  const qs = new URLSearchParams({ page: "1", limit: "100" });
  if (diplomaId) {
    qs.set("diplomaId", diplomaId);
  }

  const response = await fetch(`${getApiBase()}/exams?${qs.toString()}`, {
    headers: {
      ...authHeaders(accessToken),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(apiErrorMessage(errBody, "Failed to fetch exams"));
  }

  const raw = await response.json();
  if (isApiFailure(raw)) {
    throw new Error(apiErrorMessage(raw, "Failed to fetch exams"));
  }

  const payload = raw.payload as
    | { data: Record<string, unknown>[]; metadata: PaginationMetadata }
    | undefined;
  const rows = payload?.data ?? (raw as { exams?: unknown[] }).exams ?? [];

  const exams: Exam[] = rows.map((row) => {
    const r = row as Record<string, unknown>;
    const id = String(r.id ?? r._id ?? "");
    const diplomaIdVal = String(r.diplomaId ?? r.subject ?? "");
    return {
      _id: id,
      title: String(r.title ?? ""),
      duration: Number(r.duration ?? 0),
      subject: diplomaIdVal,
      numberOfQuestions: Number(r.questionsCount ?? r.numberOfQuestions ?? 0),
      active: Boolean(r.active ?? true),
    };
  });

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
    <div className="flex flex-col gap-4 bg-white p-4 md:p-6 h-full">
      {exams?.map((exam: Exam) => (
        <Link
          key={exam._id}
          href={`/dashboard/exams/${exam._id}?subject=${exam.subject}`}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-blue-50 p-4 hover:bg-blue-100 transition-colors cursor-pointer rounded-md"
        >
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-blue-600 font-semibold text-lg sm:text-xl font-geistMono truncate">
              {exam.title}
            </p>
            <p className="text-gray-500 font-normal text-xs sm:text-sm font-geistMono">
              {exam.numberOfQuestions} Questions
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Timer className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <p className="text-gray-800 font-medium font-geistMono text-xs sm:text-sm whitespace-nowrap">
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
