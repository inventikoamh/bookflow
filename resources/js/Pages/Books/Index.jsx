import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Plus, BookOpen, Calendar, User as UserIcon, TrendingUp, Library } from 'lucide-react';

export default function Index({ books }) {
    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700 border-green-200',
            completed: 'bg-blue-100 text-blue-700 border-blue-200',
            wishlist: 'bg-green-100 text-green-700 border-green-200',
        };
        const labels = {
            active: 'Reading',
            completed: 'Completed',
            wishlist: 'Wishlist',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Books" />

            <div className="space-y-4">
                {/* Header - Vibrant Design */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 shadow-xl">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">My Library</h1>
                            <p className="text-sm text-blue-100">Manage your book collection</p>
                        </div>
                        <Link href={route('books.create')}>
                            <Button className="bg-white text-indigo-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                                <Plus className="mr-2 h-5 w-5" />
                                Add New Book
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Books Grid/List */}
                {books.length === 0 ? (
                    /* Empty State */
                    <Card className="border-green-100">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                                <BookOpen className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Start building your reading collection by adding your first book!
                            </p>
                            <Link href={route('books.create')}>
                                <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Book
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    /* Books List */
                    <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {books.map((book) => (
                            <Link key={book.id} href={route('books.show', book.id)}>
                                <Card className="border-green-100 hover:shadow-2xl transition-all duration-300 hover:border-green-200 hover:-translate-y-1 h-full group">
                                    <CardContent className="p-0">
                                        {/* Book Cover with improved styling */}
                                        <div className="relative aspect-[2/3] rounded-t-lg overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-green-50">
                                            {book.cover_image ? (
                                                <>
                                                    <img
                                                        src={`/storage/${book.cover_image}`}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {/* Gradient overlay for better text visibility */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                                    {/* More attractive placeholder */}
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-green-400 blur-xl opacity-20 rounded-full"></div>
                                                        <BookOpen className="h-12 w-12 text-green-400 relative z-10" strokeWidth={1.5} />
                                                    </div>
                                                    <p className="mt-2 text-xs font-medium text-green-600/80 text-center line-clamp-2">
                                                        {book.title}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Status Badge - positioned on cover */}
                                            <div className="absolute top-2 right-2">
                                                {getStatusBadge(book.status)}
                                            </div>
                                        </div>

                                        {/* Book Info Section */}
                                        <div className="p-2 space-y-1.5">
                                            <div>
                                                <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 mb-0.5 group-hover:text-green-600 transition-colors leading-tight">
                                                    {book.title}
                                                </h3>
                                                {book.author && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <UserIcon className="h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate">{book.author}</span>
                                                    </div>
                                                )}
                                                {book.library_name && (
                                                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                                                        <Library className="h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate">{book.library_name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            {book.total_pages > 0 && (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <TrendingUp className="h-3 w-3" />
                                                            <span className="font-medium">Progress</span>
                                                        </div>
                                                        <span className="font-semibold text-green-600">{book.progress_percentage || 0}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-300 transition-all duration-500 shadow-sm"
                                                            style={{ width: `${book.progress_percentage || 0}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {book.current_page} / {book.total_pages} pages
                                                    </p>
                                                </div>
                                            )}

                                            {/* Return Date */}
                                            {book.return_date && (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-gray-100">
                                                    <Calendar className="h-3.5 w-3.5 text-green-500" />
                                                    <span>Due: <span className="font-medium text-gray-700">{formatDate(book.return_date)}</span></span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
