"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Check, X } from "lucide-react"


export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isSuccess = variant === "success";
        const isError = variant === "destructive";
        
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center justify-between gap-2">
            {isSuccess && <Check className="w-4 h-4 text-emerald-500" />}
            {isError && <X className="w-4 h-4 text-black" />}
            <div className="grid gap-1 font-geistMono">
              {title && <ToastTitle className="text-white font-geistMono">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white font-geistMono">{description}</ToastDescription>
              )}
            </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
