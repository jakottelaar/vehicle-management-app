"use client";
import React, { useState, useEffect, useRef } from "react";
import { CarFront, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();
  const sidebarRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const NavItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
  }) => (
    <Link
      onClick={() => setIsOpen(false)}
      href={href}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        currentPath.includes(href)
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </Link>
  );

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !(sidebarRef.current as HTMLElement).contains(event.target as Node) &&
        window.innerWidth < 1024
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex lg:h-screen sticky top-0 z-50 bg-black">
      {/* Sidebar */}
      <header className="lg:hidden h-fit">
        <div className="px-4 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none focus:text-neutral-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-fit md:w-64 xl:w-64 lg:w-64 bg-black text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 p-4 space-y-2">
            <NavItem
              href="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <NavItem href="/vehicles" icon={CarFront} label="Vehicles" />
          </nav>
          <div className="p-4 border-t border-neutral-800">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-neutral-700">
                <AvatarImage src="" />
                <AvatarFallback className="bg-neutral-800 text-white">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger className="w-full flex items-center text-neutral-400 hover:bg-neutral-900 hover:text-white px-4 py-2 rounded-lg transition-colors">
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Are you sure you want to logout?
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter className="">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Logout
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidebarLayout;
