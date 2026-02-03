import { createUser } from '@/lib/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default function SignupPage() {

    // This is a "Server Action". It runs entirely on the server.
    async function handleSignup(formData: FormData) {
        'use server'; // This line is magic. It tells Next.js "Don't send this code to the browser"

        const email = formData.get('email') as string;
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        // 1. Hash the password (Security Best Practice)
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // 2. Save to SQLite
            await createUser(email, username, hashedPassword);
            console.log('User created successfully!');
        } catch (error: any) {
            console.error('Signup failed:', error.message);
            // In a real app, you would return an error message to display to the user
            return;
        }

        // 3. Redirect to home page after success
        redirect('/');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
            <div className="z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Mindscroll</h1>

                <form action={handleSignup} className="flex flex-col gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="mt-1 block w-full p-2 border rounded-md border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full p-2 border rounded-md border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full p-2 border rounded-md border-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </main>
    );
}