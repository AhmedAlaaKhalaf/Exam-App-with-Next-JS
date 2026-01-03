"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { SlashIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function DashboardBreadcrumb() {
const pathname = usePathname();
  const segments = pathname.split("/").filter((segment, index) => index !== 1 && segment !== "");
  const [examTitles, setExamTitles] = useState<Record<string, string>>({});
  const fetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    segments.forEach((segment, index) => {
      const isExamId = index > 0 && segments[index - 1] === "exams" && /^[0-9a-fA-F]{24}$/.test(segment);
      
      if (isExamId && !fetchedRef.current.has(segment)) {
        fetchedRef.current.add(segment);
        fetch(`/api/exams/${segment}`)
          .then(res => res.json())
          .then(data => {
            if (data.title) {
              setExamTitles(prev => ({ ...prev, [segment]: data.title }));
            }
          })
          .catch(() => {});
      }
    });
  }, [segments]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="font-geistMono text-muted">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const path = "/dashboard/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const isExamId = index > 0 && segments[index - 1] === "exams" && /^[0-9a-fA-F]{24}$/.test(segment);
          
          // Don't show exam segment until we have the title
          if (isExamId && !examTitles[segment]) return null;
          
          const displayText = isExamId ? examTitles[segment] : segment;
          
          return (
            <div key={path} className="flex items-center">
              <BreadcrumbSeparator className="px-1">
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize font-geistMono text-primary">
                    {displayText}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path} className="capitalize font-geistMono text-muted hover:text-primary">
                    {displayText}
                  </BreadcrumbLink>
                )}
        </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
