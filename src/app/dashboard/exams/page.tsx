import { BookOpenCheck, ChevronLeft } from "lucide-react";
import ExamsList from "../_components/exams-list";
import { Suspense } from "react";
import Link from "next/link";

export default function Exams() {
  return (
    <div className="p-0 bg-gray-50 flex-grow">
      <div className="p-6 flex flex-col gap-6 h-full">
        <div className="flex justify-center items-stretch gap-4">
          <Link
            href="/dashboard/diplomas"
            className="cursor-pointer bg-white border border-primary flex justify-center items-center px-2 py-4 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="text-primary w-6 h-6" />
          </Link>
          <header className="flex items-center gap-4 bg-primary p-4 w-full">
            <div className="icon">
              <BookOpenCheck className="text-white w-10 h-10" />
            </div>
            <div className="font-inter">
              <p className="font-semibold text-white text-[2rem] capitalize">
                Exams
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
            <ExamsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
