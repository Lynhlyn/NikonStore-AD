import LayoutRootDashboard from '@/common/LayoutRootDashboard/LayoutRootDashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutRootDashboard>{children}</LayoutRootDashboard>;
}

