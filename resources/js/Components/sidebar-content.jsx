import { Home, User, ChevronUp, LogOut, BookOpen, Library } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu"

// Menu items
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        route: "dashboard",
    },
    {
        title: "My Books",
        url: "/books",
        icon: Library,
        route: "books.index",
    },
    {
        title: "Profile",
        url: "/profile",
        icon: User,
        route: "profile.edit",
    },
]

export function SidebarContent() {
    const { auth } = usePage().props

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <div className="flex h-full flex-col bg-sidebar">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-green-500">
                    <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        BookFlow
                    </span>
                    <span className="text-xs text-muted-foreground">Manage your books</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Navigation</p>
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = route().current(item.route)
                        return (
                            <Link
                                key={item.title}
                                href={route(item.route)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                    ? 'bg-green-50 text-green-600 font-medium'
                                    : 'text-sidebar-foreground hover:bg-green-50 hover:text-green-600'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.title}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-sidebar-border p-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent transition-colors">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-400 text-white text-xs">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start flex-1 min-w-0">
                                <span className="text-sm font-medium truncate w-full">{auth.user.name}</span>
                                <span className="text-xs text-muted-foreground truncate w-full">{auth.user.email}</span>
                            </div>
                            <ChevronUp className="h-4 w-4 flex-shrink-0" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="w-[240px]">
                        <DropdownMenuItem asChild>
                            <Link href={route('profile.edit')} className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('logout')} method="post" as="button" className="w-full cursor-pointer text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
