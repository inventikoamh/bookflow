import { Link, usePage } from '@inertiajs/react';
import { Home, BookOpen, User } from 'lucide-react';

export default function MobileBottomNav() {
    const { url } = usePage();

    const isActive = (path) => {
        if (path === '/dashboard') {
            return url === '/dashboard';
        }
        return url.startsWith(path);
    };

    const navItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            active: isActive('/dashboard'),
            gradient: 'from-purple-500 to-indigo-600',
            activeGlow: 'shadow-purple-500/50'
        },
        {
            name: 'Books',
            href: '/books',
            icon: BookOpen,
            active: isActive('/books'),
            gradient: 'from-blue-500 to-cyan-600',
            activeGlow: 'shadow-blue-500/50'
        },
        {
            name: 'Profile',
            href: '/profile',
            icon: User,
            active: isActive('/profile'),
            gradient: 'from-pink-500 to-rose-600',
            activeGlow: 'shadow-pink-500/50'
        }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 z-50 safe-area-bottom shadow-2xl">
            <div className="flex items-center justify-around h-24 px-6 py-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${item.active ? '' : 'hover:scale-105'
                                }`}
                        >
                            {/* Active indicator background */}
                            {item.active && (
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.gradient} rounded-full`}></div>
                            )}

                            {/* Icon container */}
                            <div className={`relative p-3.5 rounded-2xl transition-all duration-300 ${item.active
                                ? `bg-gradient-to-br ${item.gradient} shadow-lg ${item.activeGlow}`
                                : 'bg-gray-100 hover:bg-gray-200'
                                }`}>
                                <Icon className={`h-6 w-6 transition-colors ${item.active ? 'text-white' : 'text-gray-600'
                                    }`} />
                            </div>

                            {/* Label */}
                            <span className={`text-xs mt-2 transition-all font-semibold ${item.active
                                ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`
                                : 'text-gray-600'
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
