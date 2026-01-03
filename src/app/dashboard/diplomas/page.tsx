import { GraduationCap } from "lucide-react"
import DiplomasList from "../_components/diplomas-list"
import { Suspense } from "react";



export default function Diplomas() {
  return (
    <div className="p-0 bg-gray-50 flex-grow">
      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
        <header className="flex items-center gap-2 md:gap-4 bg-primary p-3 md:p-4">
            <div className="icon"><GraduationCap className="text-white w-8 h-8 md:w-10 md:h-10"/></div>
            <div className="font-inter">
                <p className="font-semibold text-white text-xl md:text-2xl lg:text-[2rem] capitalize">Diplomas</p>
            </div>  
        </header>
        <div className="diplomas">
             {/* suspense boudary | loading boundary */}
                    <Suspense fallback={<div className="flex items-center justify-center h-[75vh] w-full">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                </div>}>
                      <DiplomasList/></Suspense>
        </div>
      </div>
    </div>
  )
}
