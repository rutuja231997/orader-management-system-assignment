import { ReactNode } from 'react';

import { Button } from '@/components/ui/button-custom';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import axios from 'axios';
import { RootState } from '@/redux/store';

import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";


interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps)=>{
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {isAuthenticated, admin} = useSelector((state:RootState)=>state.auth)

  const handleLogout = async()=>{
    try{
      await axios.post(`${process.env.BACKEND_URL}/api/v1/admin/logout`, {}, {
        withCredentials: true
      });
      dispatch(logout());
      router.push("/admin/auth/login")
    }catch(error){
      console.log("logout failed", error);
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-primary">
                OrderHub
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link
                  href="/order"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/order'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  Place Order
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/admin/dashboard'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {admin?.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/admin/auth/login">
                  <Button variant="outline" size="sm">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};