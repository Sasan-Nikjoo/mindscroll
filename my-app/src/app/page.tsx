import { getAllPosts } from '@/lib/db';
import { getSession } from '@/lib/session';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function Home() {
    const posts = await getAllPosts();
    const session = await getSession();
    // @ts-ignore
    const user = session.user;

    // --- THE NEW LOGOUT ACTION ---
    async function logout() {
        'use server';
        const session = await getSession();
        session.destroy();
        revalidatePath('/'); // Refresh the page content
        redirect('/');       // Go to home (or login page)
    }
    // -----------------------------

    return (
        <main className="p-10 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b pb-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Mindscroll</h1>

                <div>
                    {user ? (
                        <div className="flex gap-4 items-center">
                            <span className="text-gray-600">Hi, {user.username}</span>

                            <Link href="/new-post" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition text-sm">
                                Write
                            </Link>

                            {/* THE LOGOUT BUTTON FORM */}
                            <form action={logout}>
                                <button className="text-red-600 hover:text-red-800 font-semibold text-sm border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition">
                                    Logout
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link href="/login" className="text-gray-600 hover:text-black font-semibold">Login</Link>
                            <Link href="/signup" className="text-gray-600 hover:text-black font-semibold">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Blog Feed */}
            <div className="space-y-8">
                {posts.map((post: any) => (
                    <article key={post.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white">
                        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                        <p className="text-gray-500 text-sm mb-4">Written by <span className="font-semibold">{post.authorName}</span></p>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </article>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded">
                        <p className="text-gray-500">No stories yet. Be the first to write one!</p>
                    </div>
                )}
            </div>
        </main>
    );
}