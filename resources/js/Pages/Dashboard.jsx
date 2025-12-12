import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { BookOpen, TrendingUp, Heart, Activity, Clock, Plus } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/Components/InputError';

export default function Dashboard({ stats: backendStats, books }) {
    const { auth } = usePage().props;

    const [showLogDialog, setShowLogDialog] = useState(false);
    const [formData, setFormData] = useState({
        book_id: '',
        start_datetime: '',
        end_datetime: '',
        pages_from: '',
        pages_to: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const submitSession = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(route('sessions.store', formData.book_id), {
            start_datetime: formData.start_datetime,
            end_datetime: formData.end_datetime,
            pages_from: formData.pages_from,
            pages_to: formData.pages_to,
            notes: formData.notes
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowLogDialog(false);
                setFormData({
                    book_id: '',
                    start_datetime: '',
                    end_datetime: '',
                    pages_from: '',
                    pages_to: '',
                    notes: ''
                });
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            }
        });
    };

    const stats = [
        {
            title: "Total Books",
            value: backendStats?.totalBooks || 0,
            description: "In your library",
            icon: BookOpen,
            gradient: "from-purple-500 via-purple-600 to-indigo-600",
            iconBg: "bg-gradient-to-br from-purple-500 to-indigo-600",
            glow: "shadow-purple-500/20"
        },
        {
            title: "Reading",
            value: backendStats?.activeBooks || 0,
            description: "Currently Active",
            icon: TrendingUp,
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
            glow: "shadow-blue-500/20"
        },
        {
            title: "Completed",
            value: backendStats?.completedBooks || 0,
            description: "Books finished",
            icon: Heart,
            gradient: "from-pink-500 via-rose-500 to-red-500",
            iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
            glow: "shadow-pink-500/20"
        },
        {
            title: "Read Time",
            value: backendStats?.readingTime || "0m",
            description: "Total duration",
            icon: Activity,
            gradient: "from-orange-500 via-amber-500 to-yellow-500",
            iconBg: "bg-gradient-to-br from-orange-500 to-amber-600",
            glow: "shadow-orange-500/20"
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-3">
                {/* Welcome Card - With Tagline */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-4 shadow-lg">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGheiWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative">
                        <h1 className="text-lg font-bold text-white mb-0.5">
                            Welcome back, {auth.user.name}! 👋
                        </h1>
                        <p className="text-sm text-purple-100">Continue your reading journey</p>
                    </div>
                </div>

                {/* Statistics Grid - Animated Icons */}
                <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        // Different animation for each card
                        const animations = [
                            'animate-bounce', // Total Books - bounce
                            'animate-pulse',  // Reading - pulse
                            'animate-spin',   // Completed - spin (slow)
                            'hover:animate-ping' // Read Time - ping on hover
                        ];

                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:-translate-y-0.5"
                            >
                                {/* Gradient background on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                <div className="relative">
                                    {/* Top Row: Icon and Value side by side */}
                                    <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-100">
                                        {/* Animated Icon */}
                                        <div className={`inline-flex p-2 rounded-lg ${stat.iconBg} shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`h-5 w-5 text-white ${index === 2 ? 'group-hover:animate-spin' : index === 0 ? 'group-hover:animate-bounce' : index === 1 ? 'group-hover:animate-pulse' : ''}`}
                                                style={index === 2 ? { animationDuration: '2s' } : {}}
                                            />
                                        </div>

                                        {/* Value with subtle animation */}
                                        <div className={`text-2xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                                            {stat.value}
                                        </div>
                                    </div>

                                    {/* Heading (Title) */}
                                    <div className="text-xs font-semibold text-gray-900 mb-1">
                                        {stat.title}
                                    </div>

                                    {/* Subheading (Description) */}
                                    <div className="text-xs text-gray-500">
                                        {stat.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions - Ultra Compact */}
                <div>
                    <h2 className="text-base font-bold text-gray-900 mb-2">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
                            <DialogTrigger asChild>
                                <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border border-emerald-100 hover:border-emerald-300">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className="relative flex items-center gap-3">
                                        <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm flex-shrink-0">
                                            <Plus className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-gray-900">Log Reading Session</h3>
                                            <p className="text-xs text-gray-600 truncate">Track your reading time</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Log Reading Session</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submitSession} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Book *</Label>
                                        <select
                                            value={formData.book_id}
                                            onChange={(e) => handleInputChange('book_id', e.target.value)}
                                            required
                                            className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                                        >
                                            <option value="">Choose a book...</option>
                                            {books?.map(book => (
                                                <option key={book.id} value={book.id}>{book.title}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.book_id} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700">Start Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                value={formData.start_datetime}
                                                onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                                                required
                                                className="h-11 rounded-xl border-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                                            />
                                            <InputError message={errors.start_datetime} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700">End Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                value={formData.end_datetime}
                                                onChange={(e) => handleInputChange('end_datetime', e.target.value)}
                                                required
                                                className="h-11 rounded-xl border-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                                            />
                                            <InputError message={errors.end_datetime} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700">From Page</Label>
                                            <Input
                                                type="number"
                                                value={formData.pages_from}
                                                onChange={(e) => handleInputChange('pages_from', e.target.value)}
                                                placeholder="0"
                                                className="h-11 rounded-xl border-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                                            />
                                            <InputError message={errors.pages_from} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700">To Page</Label>
                                            <Input
                                                type="number"
                                                value={formData.pages_to}
                                                onChange={(e) => handleInputChange('pages_to', e.target.value)}
                                                placeholder="0"
                                                className="h-11 rounded-xl border-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                                            />
                                            <InputError message={errors.pages_to} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Notes</Label>
                                        <Input
                                            value={formData.notes}
                                            onChange={(e) => handleInputChange('notes', e.target.value)}
                                            placeholder="What did you learn?"
                                            className="h-11 rounded-xl border-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-semibold text-base shadow-lg"
                                    >
                                        {processing ? 'Saving...' : 'Save Session'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Link href={route('books.create')}>
                            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border border-blue-100 hover:border-blue-300">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative flex items-center gap-3">
                                    <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm flex-shrink-0">
                                        <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900">Add New Book</h3>
                                        <p className="text-xs text-gray-600 truncate">Add to your library</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href={route('books.index')}>
                            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 p-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border border-violet-100 hover:border-violet-300">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative flex items-center gap-3">
                                    <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm flex-shrink-0">
                                        <Activity className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900">View Reading List</h3>
                                        <p className="text-xs text-gray-600 truncate">See your queue</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Books Section */}
                {books && books.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base font-bold text-gray-900">Recent Books</h2>
                            <Link
                                href={route('books.index')}
                                className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                View All →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {books.slice(0, 4).map((book, index) => {
                                const gradients = [
                                    'from-purple-500 to-indigo-600',
                                    'from-blue-500 to-cyan-600',
                                    'from-pink-500 to-rose-600',
                                    'from-orange-500 to-amber-600'
                                ];
                                const bgGradients = [
                                    'from-purple-50 to-indigo-50',
                                    'from-blue-50 to-cyan-50',
                                    'from-pink-50 to-rose-50',
                                    'from-orange-50 to-amber-50'
                                ];

                                return (
                                    <Link
                                        key={book.id}
                                        href={route('books.show', book.id)}
                                        className="group"
                                    >
                                        <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${bgGradients[index % 4]} p-3 border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
                                            {/* Cover Image */}
                                            {book.cover_image ? (
                                                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 shadow-sm">
                                                    <img
                                                        src={`/storage/${book.cover_image}`}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`aspect-[3/4] rounded-lg mb-2 bg-gradient-to-br ${gradients[index % 4]} flex items-center justify-center shadow-sm`}>
                                                    <BookOpen className="h-8 w-8 text-white opacity-50" />
                                                </div>
                                            )}

                                            {/* Book Info */}
                                            <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 truncate">
                                                {book.author}
                                            </p>

                                            {/* Status Badge */}
                                            <div className="mt-2">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${book.status === 'reading'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : book.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {book.status === 'reading' ? '📖 Reading' : book.status === 'completed' ? '✓ Done' : '📚 Wishlist'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
