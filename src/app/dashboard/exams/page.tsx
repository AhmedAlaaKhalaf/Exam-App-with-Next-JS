import { BookOpenCheck, ChevronLeft } from "lucide-react";
import ExamsList from "../_components/exams-list";
import { Suspense } from "react";
import Link from "next/link";

export default function Exams() {
  return (
    <div className="p-0 bg-gray-50 flex-grow">
      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 h-full">
        <div className="flex justify-center items-stretch gap-2 md:gap-4">
          <Link
            href="/dashboard/diplomas"
            className="cursor-pointer bg-white border border-primary flex justify-center items-center px-2 py-3 md:py-4 hover:bg-gray-50 transition-colors shrink-0"
          >
            <ChevronLeft className="text-primary w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <header className="flex items-center gap-2 md:gap-4 bg-primary p-3 md:p-4 w-full">
            <div className="icon">
              <BookOpenCheck className="text-white w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="font-inter">
              <p className="font-semibold text-white text-xl md:text-2xl lg:text-[2rem] capitalize">
                Exams
              </p>
            </div>
          </header>
        </div>
        <div className="exams flex-grow min-h-0 overflow-hidden">
          {/* suspense boudary | loading boundary */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[50vh] sm:h-[75vh] w-full">
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
