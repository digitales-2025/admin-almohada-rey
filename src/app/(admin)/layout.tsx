import AdminLayout from "@/components/layout/admin-layout";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";

const topNav = [
  { title: "Overview", href: "/admin/dashboard/overview", isActive: true },
  { title: "Customers", href: "/admin/dashboard/customers", isActive: false, disabled: true },
  { title: "Products", href: "/admin/dashboard/products", isActive: false, disabled: true },
  { title: "Settings", href: "/admin/dashboard/settings", isActive: false, disabled: true },
];

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      {/* ===== Main Content ===== */}
      <Main>{children}</Main>
    </AdminLayout>
  );
}
