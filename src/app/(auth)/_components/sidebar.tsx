import { BookOpenCheck, Brain, RectangleEllipsis } from "lucide-react"



export default function Sidebar() {
  return (
    <div className="relative bg-[url('/assets/images/overlay.png')] bg-cover bg-center bg-no-repeat min-h-0 md:min-h-screen">
      <div className="absolute inset-0 bg-[#EFF6FF]/75 backdrop-blur-2xl"></div>
      <div className="relative py-16 md:py-20 lg:py-28 px-6 md:px-16 lg:px-32">
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/assets/icons/folder-code.svg" alt="exam-icon" className="w-5 h-5 md:w-6 md:h-6" /> 
          <p className="font-geistMono text-primary text-lg md:text-[1.25rem] font-semibold">Exam App</p>
        </div>
        <div className="content flex flex-col gap-8 md:gap-14 mt-12 md:mt-20 lg:mt-32">
          <h2 className="font-inter font-bold text-black text-xl md:text-2xl lg:text-[1.8rem]">
            Empower your learning journey with our smart exam platform.
          </h2>
          <div className="flex flex-col gap-9">
            <div className="flex items-start gap-3 md:gap-4 list">
              <div className="icon border-primary border p-1 my-2 shrink-0"><Brain className="text-primary w-5 h-5 md:w-6 md:h-6"/></div>
              <div className="content font-geistMono">
                <h3 className="text-primary font-semibold text-lg md:text-xl lg:text-[1.25rem]">Tailored Diplomas</h3>
                <p className="text-paragraph font-medium mt-1 text-sm md:text-base">Choose from specialized tracks like Frontend, Backend, and Mobile Development.</p>
              </div>  
            </div>
            <div className="flex items-start gap-3 md:gap-4 list">
              <div className="icon border-primary border p-1 my-2 shrink-0"><BookOpenCheck className="text-primary w-5 h-5 md:w-6 md:h-6"/></div>
              <div className="content font-geistMono">
                <h3 className="text-primary font-semibold text-lg md:text-xl lg:text-[1.25rem]">Focused Exams</h3>
                <p className="text-paragraph font-medium mt-1 text-sm md:text-base">Access topic-specific tests including HTML, CSS, JavaScript, and more.</p>
              </div>  
            </div>
            <div className="flex items-start gap-3 md:gap-4 list">
              <div className="icon border-primary border p-1 my-2 shrink-0"><RectangleEllipsis className="text-primary w-5 h-5 md:w-6 md:h-6"/></div>
              <div className="content font-geistMono">
                <h3 className="text-primary font-semibold text-lg md:text-xl lg:text-[1.25rem]">Smart Multi-Step Forms</h3>
                <p className="text-paragraph font-medium mt-1 text-sm md:text-base">Choose from specialized tracks like Frontend, Backend, and Mobile Development.</p>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
