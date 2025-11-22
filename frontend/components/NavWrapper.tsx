"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  LayoutDashboard,
  Package,
  History,
  Settings,
  Receipt,
  Truck,
  SlidersHorizontal,
  Warehouse,
  MapPin,
  LogOut,
  User,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NavItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Operation",
    icon: <Package className="w-4 h-4" />,
    children: [
      {
        label: "Receipt",
        href: "/operations/receipt",
        icon: <Receipt className="w-4 h-4" />,
      },
      {
        label: "Delivery",
        href: "/operations/delivery",
        icon: <Truck className="w-4 h-4" />,
      },
      {
        label: "Adjustments",
        href: "/operations/adjustments",
        icon: <SlidersHorizontal className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Products",
    href: "/products",
    icon: <Package className="w-4 h-4" />,
  },
  {
    label: "Move History",
    href: "/moves-history",
    icon: <History className="w-4 h-4" />,
  },
  {
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    children: [
      {
        label: "Warehouse",
        href: "/settings/warehouse",
        icon: <Warehouse className="w-4 h-4" />,
      },
      {
        label: "Locations",
        href: "/settings/location",
        icon: <MapPin className="w-4 h-4" />,
      },
    ],
  },
];

export function NavWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some((child) => isActive(child.href));
  };

  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = isChildActive(item.children);
        if (hasActiveChild) {
          newOpenMenus[item.label] = true;
        } else if (openMenus[item.label] !== undefined) {
          newOpenMenus[item.label] = openMenus[item.label];
        }
      }
    });
    setOpenMenus(newOpenMenus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(menuRefs.current).forEach((key) => {
        const ref = menuRefs.current[key];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenMenus((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Stock Manager</h1>
            </div>

            {/* Navigation Items */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  ref={(el) => {
                    menuRefs.current[item.label] = el;
                  }}
                >
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          isChildActive(item.children)
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            openMenus[item.label] && "rotate-180"
                          )}
                        />
                      </button>
                      {openMenus[item.label] && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href || "#"}
                              onClick={() =>
                                setOpenMenus((prev) => ({
                                  ...prev,
                                  [item.label]: false,
                                }))
                              }
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                                isActive(child.href)
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              {child.icon}
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
