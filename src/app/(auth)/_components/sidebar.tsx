import { BookOpenCheck, Brain, RectangleEllipsis } from "lucide-react"



export default function Sidebar() {
  return (
    <div className="relative bg-[url('/assets/images/overlay.png')] bg-cover bg-center bg-no-repeat min-h-screen">
      <div className="absolute inset-0 bg-[#EFF6FF]/75 backdrop-blur-2xl"></div>
      <div className="relative py-28 px-32">
        <div className="flex items-center gap-3">
          <img src="/assets/icons/folder-code.svg" alt="exam-icon" /> 
          <p className="font-geistMono text-primary text-[1.25rem] font-semibold">Exam App</p>
        </div>
        <div className="content flex flex-col gap-14 mt-32">
          <h2 className="font-inter font-bold text-black text-[1.8rem]">
            Empower your learning journey with our smart exam platform.
          </h2>
          <div className="flex flex-col gap-9">
            <div className="flex items-start gap-4 list">
              <div className="icon border-primary border p-1 my-2"><Brain className="text-primary"/></div>
              <div className="content font-geistMono">
                <h3 className="text-primary font-semibold text-[1.25rem]">Tailored Diplomas</h3>
                <p className="text-paragraph font-medium mt-1">Choose from specialized tracks like Frontend, Backend, and Mobile Development.</p>
              </div>  
            </div>
            <div className="flex items-start gap-4 list">
              <div className="icon border-primary border p-1 my-2"><BookOpenCheck className="text-primary"/></div>
              <div className="content font-geistMono">
                <h3 className="text-primary font-semibold text-[1.25rem]">Focused Exams</h3>
                <p className="text-paragraph font-medium mt-1">Access topic-specific tests including HTML, CSS, JavaScript, and more.</p>
              </div>  
            </div>
            <div className="flex items-start gap-4 list">
              <div className="icon border-primary border p-1 my-2"><RectangleEllipsis className="text-primary"/></div>
              <div className="content font-geistMono">
                <h3 className="text-primary font-semibold text-[1.25rem]">Smart Multi-Step Forms</h3>
                <p className="text-paragraph font-medium mt-1">Choose from specialized tracks like Frontend, Backend, and Mobile Development.</p>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
