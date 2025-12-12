import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import InputError from '@/Components/InputError';
import { ArrowLeft, Upload, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        author: '',
        library_name: '',
        issue_date: '',
        note: '',
        duration: '',
        return_date: '',
        total_pages: '',
        cover_image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cover_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('books.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add New Book" />

            <div className="max-w-2xl mx-auto space-y-4">
                {/* Header - Vibrant Design */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 shadow-xl">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative flex items-center gap-4">
                        <Link href={route('books.index')}>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white mb-1">Add New Book</h1>
                            <p className="text-sm text-teal-100">Add a book to your library</p>
                        </div>
                    </div>
                </div>

                {/* Form Card - Modern Design */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Add New Book</CardTitle>
                        <CardDescription>
                            Add a new book to your reading collection
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Cover Image Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="cover_image">Book Cover (Optional)</Label>
                                <div className="flex flex-col items-center gap-4">
                                    {/* Image Preview */}
                                    <div className="w-40 aspect-[2/3] rounded-lg bg-gradient-to-br from-slate-100 via-slate-50 to-green-50 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-4">
                                                <BookOpen className="h-16 w-16 text-green-300 mb-2" />
                                                <p className="text-xs text-gray-500 text-center">No image</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    <div className="w-full">
                                        <input
                                            type="file"
                                            id="cover_image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="cover_image"
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full cursor-pointer"
                                        >
                                            <Upload className="h-4 w-4" />
                                            {imagePreview ? 'Change Cover' : 'Upload Cover'}
                                        </label>
                                        <p className="text-xs text-muted-foreground mt-2 text-center">
                                            JPG or PNG, max 20MB
                                        </p>
                                    </div>
                                </div>
                                <InputError message={errors.cover_image} />
                            </div>

                            {/* Book Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Book Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter book title"
                                    className="focus:ring-green-500"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Author */}
                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input
                                    id="author"
                                    value={data.author}
                                    onChange={(e) => setData('author', e.target.value)}
                                    placeholder="Author name"
                                    className="focus:ring-green-500"
                                />
                                <InputError message={errors.author} />
                            </div>

                            {/* Library Name */}
                            <div className="space-y-2">
                                <Label htmlFor="library_name">Library Name</Label>
                                <Input
                                    id="library_name"
                                    value={data.library_name}
                                    onChange={(e) => setData('library_name', e.target.value)}
                                    placeholder="e.g. Central Library"
                                    className="focus:ring-green-500"
                                />
                                <InputError message={errors.library_name} />
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (e.g. 5h 30m)</Label>
                                <Input
                                    id="duration"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    placeholder="Enter duration"
                                    className="focus:ring-green-500"
                                />
                                <InputError message={errors.duration} />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description or notes about the book"
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Note */}
                            <div className="space-y-2">
                                <Label htmlFor="note">Private Notes</Label>
                                <textarea
                                    id="note"
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder="Add any private notes here..."
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.note} />
                            </div>

                            {/* Issue and Return Dates */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="issue_date">Issue Date</Label>
                                    <Input
                                        type="date"
                                        id="issue_date"
                                        value={data.issue_date}
                                        onChange={(e) => setData('issue_date', e.target.value)}
                                        className="focus:ring-green-500"
                                    />
                                    <InputError message={errors.issue_date} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="return_date">Return Date</Label>
                                    <Input
                                        type="date"
                                        id="return_date"
                                        value={data.return_date}
                                        onChange={(e) => setData('return_date', e.target.value)}
                                        className="focus:ring-green-500"
                                    />
                                    <InputError message={errors.return_date} />
                                </div>
                            </div>

                            {/* Total Pages */}
                            <div className="space-y-2">
                                <Label htmlFor="total_pages">Total Pages</Label>
                                <Input
                                    type="number"
                                    id="total_pages"
                                    value={data.total_pages}
                                    onChange={(e) => setData('total_pages', e.target.value)}
                                    placeholder="e.g., 350"
                                    min="1"
                                    className="focus:ring-green-500"
                                />
                                <InputError message={errors.total_pages} />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                                <Link href={route('books.index')} className="flex-1">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                >
                                    {processing ? 'Adding Book...' : 'Add Book'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
