import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { ArrowLeft, Edit, Trash2, BookOpen, User, Calendar, FileText, TrendingUp, PlayCircle, CheckCircle2, Heart, Library, Clock, Plus, AlertCircle, StickyNote } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/Components/InputError';

export default function Show({ book }) {
    const { data: sessionData, setData: setSessionData, post: postSession, processing: sessionProcessing, errors: sessionErrors, reset: resetSession } = useForm({
        start_datetime: '',
        end_datetime: '',
        pages_from: book.current_page || 0,
        pages_to: '',
        notes: ''
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            router.delete(route('books.destroy', book.id));
        }
    };

    const handleStatusChange = (newStatus) => {
        router.patch(route('books.update', book.id), {
            title: book.title,
            status: newStatus
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const submitSession = (e) => {
        e.preventDefault();
        postSession(route('sessions.store', book.id), {
            onSuccess: () => {
                setIsDialogOpen(false);
                resetSession();
            }
        });
    };

    const deleteSession = (sessionId) => {
        if (confirm('Delete this reading session?')) {
            router.delete(route('sessions.destroy', sessionId), {
                preserveScroll: true
            });
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const formatDateTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    // Calculate duration in hours/minutes
    const getDuration = (start, end) => {
        const diff = new Date(end) - new Date(start);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMins = minutes % 60;
        if (hours > 0) return `${hours}h ${remainingMins}m`;
        return `${minutes}m`;
    };

    const isOverdue = book.status === 'active' && book.return_date && new Date(book.return_date) < new Date();

    const getStatusConfig = (status) => {
        const configs = {
            wishlist: {
                color: 'purple',
                icon: Heart,
                label: 'Wishlist',
                gradient: 'from-purple-600 to-pink-600',
                bg: 'bg-purple-100',
                text: 'text-purple-700',
                border: 'border-purple-200'
            },
            active: {
                color: 'blue',
                icon: PlayCircle,
                label: 'Currently Reading',
                gradient: 'from-blue-600 to-cyan-600',
                bg: 'bg-blue-100',
                text: 'text-blue-700',
                border: 'border-blue-200'
            },
            completed: {
                color: 'green',
                icon: CheckCircle2,
                label: 'Completed',
                gradient: 'from-emerald-600 to-teal-600',
                bg: 'bg-emerald-100',
                text: 'text-emerald-700',
                border: 'border-emerald-200'
            }
        };
        return configs[status] || configs.wishlist;
    };

    const statusConfig = getStatusConfig(book.status);
    const StatusIcon = statusConfig.icon;

    return (
        <AuthenticatedLayout>
            <Head title={book.title} />

            <div className="max-w-4xl mx-auto space-y-4 pb-20">
                {/* Vibrant Header */}
                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${statusConfig.gradient} p-6 shadow-xl`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative">
                        {/* Top Row - Back and Actions */}
                        <div className="flex items-center justify-between mb-4">
                            <Link href={route('books.index')}>
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div className="flex gap-2">
                                <Link href={route('books.edit', book.id)}>
                                    <Button size="sm" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    size="sm"
                                    className="bg-red-500/80 text-white hover:bg-red-600 border-red-400/30"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>

                        {/* Book Title and Status */}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
                            <div className="flex items-center gap-2 text-white/90">
                                <StatusIcon className="h-5 w-5" />
                                <span className="font-semibold">{statusConfig.label}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overdue Alert */}
                {isOverdue && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium text-sm">This book is Overdue! It was due on {formatDate(book.return_date)}.</span>
                    </div>
                )}

                {/* Book Details Card */}
                <Card className="border-green-100">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] gap-4 md:gap-6">
                            {/* Cover Image - Small on mobile, large on desktop */}
                            <div className="flex md:block gap-4">
                                <div className="w-24 md:w-full aspect-[3/4] rounded-lg bg-gradient-to-br from-green-100 to-green-50 overflow-hidden relative group flex-shrink-0">
                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="h-12 md:h-24 w-12 md:w-24 text-green-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Title and Status - Next to cover on mobile */}
                                <div className="md:hidden flex-1 min-w-0">
                                    <h1 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h1>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${statusConfig.gradient} text-white text-xs`}>
                                        <StatusIcon className="h-3 w-3" />
                                        <span className="font-medium">{statusConfig.label}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Book Information */}
                            <div className="space-y-3 sm:space-y-6">
                                {/* Title and Status - Desktop only, mobile shows next to cover */}
                                <div className="hidden md:block">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{book.title}</h1>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${statusConfig.gradient} text-white`}>
                                        <StatusIcon className="h-4 w-4" />
                                        <span className="font-medium">{statusConfig.label}</span>
                                    </div>
                                </div>


                                {/* Metadata - Compact grid on mobile */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {book.author && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                            <User className="h-4 w-4 text-green-600 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground">Author</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">{book.author}</p>
                                            </div>
                                        </div>
                                    )}

                                    {book.library_name && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                            <Library className="h-4 w-4 text-green-600 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground">Library</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">{book.library_name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {book.duration && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                            <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground">Duration</p>
                                                <p className="text-sm font-medium text-gray-900">{book.duration}</p>
                                            </div>
                                        </div>
                                    )}

                                    {book.issue_date && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                            <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground">Issue Date</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDate(book.issue_date)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {book.return_date && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                                            <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground">Return Date</p>
                                                <p className={`text-sm font-medium ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                                                    {formatDate(book.return_date)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Long text fields - Full width */}
                                {book.description && (
                                    <div className="p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            <p className="text-xs font-medium text-muted-foreground">Description</p>
                                        </div>
                                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{book.description}</p>
                                    </div>
                                )}

                                {book.note && (
                                    <div className="p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <StickyNote className="h-4 w-4 text-green-600" />
                                            <p className="text-xs font-medium text-muted-foreground">Notes</p>
                                        </div>
                                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{book.note}</p>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Reading Progress */}
                        {book.total_pages > 0 && (
                            <div className="mt-6 pt-6 border-t border-green-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Reading Progress</h3>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {book.current_page} of {book.total_pages} pages
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            {book.progress_percentage || 0}%
                                        </span>
                                    </div>
                                    <div className="h-3 bg-green-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                                            style={{ width: `${book.progress_percentage || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Actions */}
                        <div className="mt-6 pt-6 border-t border-green-100">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={() => handleStatusChange('wishlist')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${book.status === 'wishlist'
                                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
                                        : 'border-2 border-green-200 text-green-700 hover:bg-green-50'
                                        }`}
                                >
                                    <Heart className={`h-4 w-4 ${book.status === 'wishlist' ? 'fill-white' : ''}`} />
                                    <span className="text-sm">Wishlist</span>
                                </button>
                                <button
                                    onClick={() => handleStatusChange('active')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${book.status === 'active'
                                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
                                        : 'border-2 border-green-200 text-green-700 hover:bg-green-50'
                                        }`}
                                >
                                    <PlayCircle className={`h-4 w-4 ${book.status === 'active' ? 'fill-white' : ''}`} />
                                    <span className="text-sm">Reading</span>
                                </button>
                                <button
                                    onClick={() => handleStatusChange('completed')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${book.status === 'completed'
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                                        : 'border-2 border-blue-200 text-blue-700 hover:bg-blue-50'
                                        }`}
                                >
                                    <CheckCircle2 className={`h-4 w-4 ${book.status === 'completed' ? 'fill-white' : ''}`} />
                                    <span className="text-sm">Completed</span>
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reading Sessions Section */}
                <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Reading Sessions</h2>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Log Session
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Log Reading Session</DialogTitle>
                                </DialogHeader>
                                <div className="py-6">
                                    <form onSubmit={submitSession} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="start_datetime">Start Time</Label>
                                                <Input
                                                    id="start_datetime"
                                                    type="datetime-local"
                                                    value={sessionData.start_datetime}
                                                    onChange={(e) => setSessionData('start_datetime', e.target.value)}
                                                    required
                                                    className="focus:ring-green-500"
                                                />
                                                <InputError message={sessionErrors.start_datetime} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="end_datetime">End Time</Label>
                                                <Input
                                                    id="end_datetime"
                                                    type="datetime-local"
                                                    value={sessionData.end_datetime}
                                                    onChange={(e) => setSessionData('end_datetime', e.target.value)}
                                                    required
                                                    className="focus:ring-green-500"
                                                />
                                                <InputError message={sessionErrors.end_datetime} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="pages_from">From Page</Label>
                                                <Input
                                                    id="pages_from"
                                                    type="number"
                                                    value={sessionData.pages_from}
                                                    onChange={(e) => setSessionData('pages_from', e.target.value)}
                                                    className="focus:ring-green-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pages_to">To Page</Label>
                                                <Input
                                                    id="pages_to"
                                                    type="number"
                                                    value={sessionData.pages_to}
                                                    onChange={(e) => setSessionData('pages_to', e.target.value)}
                                                    className="focus:ring-green-500"
                                                />
                                                <InputError message={sessionErrors.pages_to} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Session Notes</Label>
                                            <Input
                                                id="notes"
                                                value={sessionData.notes}
                                                onChange={(e) => setSessionData('notes', e.target.value)}
                                                placeholder="What happened in this session?"
                                                className="focus:ring-green-500"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                                            disabled={sessionProcessing}
                                        >
                                            {sessionProcessing ? 'Saving...' : 'Save Session'}
                                        </Button>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {book.reading_sessions && book.reading_sessions.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3">
                            {book.reading_sessions.map((session) => (
                                <Card key={session.id} className="border-green-100 hover:border-green-200 transition-colors">
                                    <div className="p-3 sm:p-4 flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                <Clock className="h-4 w-4 text-green-600" />
                                                <span>{formatDateTime(session.start_datetime)}</span>
                                                <span className="text-muted-foreground">-</span>
                                                <span>{formatDateTime(session.end_datetime)}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex gap-3">
                                                <span className="font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                                    Duration: {getDuration(session.start_datetime, session.end_datetime)}
                                                </span>
                                                {session.pages_to && (
                                                    <span>Pages {session.pages_from || 0} - {session.pages_to}</span>
                                                )}
                                            </div>
                                            {session.notes && (
                                                <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2"
                                            onClick={() => deleteSession(session.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed border-green-200 bg-green-50/50">
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                <Clock className="h-10 w-10 text-green-300 mb-2" />
                                <p>No reading sessions yet.</p>
                                <p className="text-xs">Log your reading time to track your progress!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
