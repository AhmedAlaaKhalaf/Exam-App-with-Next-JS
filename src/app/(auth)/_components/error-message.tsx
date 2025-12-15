import { X } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
            <div className="bg-red-50 border border-red-600 p-3 mt-9 flex items-center justify-center gap-2 relative">
            <X className="text-red-600 border-red-600 border flex-shrink-0 bg-white rounded-[50%] w-5 h-5 p-1 absolute top-0 right-1/2 transform translate-y-[-10px]" />
            <p className="text-red-600 text-sm font-geistMono text-center">{message || 'Something went wrong'}</p>
          </div>
  )
}
