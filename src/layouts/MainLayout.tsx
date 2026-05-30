import { ReactNode } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, LogOut, CheckCircle2 } from 'lucide-react';

export function MainLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-zinc-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-background">
        <div className="p-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-background"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Focus<span className="text-primary">Flow</span></span>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'sidebar-active' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
               <span className="text-xs font-bold text-zinc-500">{user?.email?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 mt-2 w-full text-left rounded-md text-sm font-medium text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Navbar */}
        <header className="md:hidden h-16 border-b border-zinc-800 flex items-center justify-between px-4 bg-background">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-primary flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-background"></div>
              </div>
            <span className="font-bold tracking-tight text-white">Focus<span className="text-primary">Flow</span></span>
          </div>
          <button onClick={handleSignOut} className="text-zinc-400 hover:text-white p-2">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-auto bg-transparent">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
