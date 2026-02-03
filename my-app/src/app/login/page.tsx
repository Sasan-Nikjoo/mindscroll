import { getUserByEmail } from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default async function LoginPage() {

    async function handleLogin(formData: FormData) {
        'use server';

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // 1. Check if user exists in SQLite
        const user: any = await getUserByEmail(email);

        if (!user) {
            // In a real app, you would show an error message on the screen
            console.log("Error: User not found");
            return;
        }

        // 2. Compare the typed password with the hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Error: Wrong password");
            return;
        }

        // 3. Create the session (Log them in!)
        const session = await getSession();

        // We store only the necessary info in the cookie
        // @ts-ignore
        session.user = { id: user.id, username: user.username };
        await session.save();

        // 4. Redirect to home
        redirect('/');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
            <div className="z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>

                <form action={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" required className="mt-1 block w-full p-2 border rounded-md border-gray-300"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input name="password" type="password" required className="mt-1 block w-full p-2 border rounded-md border-gray-300"/>
                    </div>

                    <button type="submit" className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    );
}