import { getSession } from '@/lib/session';
import { createPost } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
    const session = await getSession();
    // @ts-ignore
    const user = session.user;

    // Security Check: If not logged in, kick them out
    if (!user) {
        redirect('/login');
    }

    async function handleCreatePost(formData: FormData) {
        'use server';

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        // Save to DB using the logged-in user's ID
        // @ts-ignore
        await createPost(title, content, session.user.id);

        redirect('/');
    }

    return (
        <main className="min-h-screen p-10 bg-gray-50 flex justify-center">
            <div className="w-full max-w-2xl bg-white p-8 rounded shadow">
                <h1 className="text-3xl font-bold mb-6">Write a New Story</h1>

                <form action={handleCreatePost} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="Enter a catchy title..."
                            required
                            className="w-full p-3 border rounded text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Content</label>
                        <textarea
                            name="content"
                            rows={10}
                            placeholder="Write your thoughts here..."
                            required
                            className="w-full p-3 border rounded text-lg"
                        ></textarea>
                    </div>

                    <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded text-lg font-semibold hover:bg-blue-700">
                        Publish
                    </button>
                </form>
            </div>
        </main>
    );
}