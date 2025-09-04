import AdminLayout from "@/components/layout/admin-layout";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { RouteProtection } from "@/components/route-protection";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      {/* ===== Main Content ===== */}
      <Main>
        <RouteProtection>{children}</RouteProtection>
      </Main>
    </AdminLayout>
  );
}
