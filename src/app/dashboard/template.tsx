import React, { ReactNode } from 'react'
import DashboardBreadcrumb from './_components/breadcrumb';


type TemplateProps = {
    children: ReactNode;
}

export default function Template({children}:TemplateProps) {
  return (
    <>
      <div className="breadcrumb bg-white p-4"><DashboardBreadcrumb/></div>
      {children}
    </>
  )
}
// Layout | Template structure
// Layout > Template > Page