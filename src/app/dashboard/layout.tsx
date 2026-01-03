import DashboardWrapper from "./_components/dashboard-wrapper";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <DashboardWrapper>
            {children}
        </DashboardWrapper>
    )
}