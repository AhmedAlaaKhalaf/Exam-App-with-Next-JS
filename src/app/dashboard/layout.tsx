import Sidebar from "./_components/sidebar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex justify-center items-stretch h-screen">
              <aside className="w-1/4 h-screen bg-blue-50">
              <Sidebar/>
              </aside>
              <main className="w-3/4 overflow-y-auto flex flex-col">{children}</main>
        </div>
    )
}