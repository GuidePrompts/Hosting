import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaRocket, FaProjectDiagram, FaChartLine, FaCog } from 'react-icons/fa';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">NexusDeploy</h1>
        </div>
        <nav className="mt-6">
          <SidebarLink href="/dashboard" icon={<FaHome />} text="Dashboard" />
          <SidebarLink href="/deploy" icon={<FaRocket />} text="Deploy Service" />
          <SidebarLink href="/projects" icon={<FaProjectDiagram />} text="My Projects" />
          <SidebarLink href="/logs" icon={<FaChartLine />} text="Logs" />
          <SidebarLink href="/settings" icon={<FaCog />} text="Settings" />
        </nav>
        {user && (
          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <button onClick={logout} className="mt-2 text-red-600 dark:text-red-400 text-sm">Logout</button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, text }) {
  return (
    <Link href={href} className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700">
      <span className="mr-3">{icon}</span>
      {text}
    </Link>
  );
}
