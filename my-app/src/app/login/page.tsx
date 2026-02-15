import { getUserByEmail } from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import '../auth.css'; // Import the new styles

export default async function LoginPage() {

    async function handleLogin(formData: FormData) {
        'use server';


        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // 1. Check if user exists
        const user: any = await getUserByEmail(email);

        if (!user) {
            console.log("Error: User not found");
            return;
        }

        // 2. Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Error: Wrong password");
            return;
        }

        // 3. Create session
        const session = await getSession();
        // @ts-ignore
        session.user = { id: user.id, username: user.username };
        await session.save();

        // 4. Redirect
        redirect('/');
    }

    return (
        <div className="login-container">
            <div className="login">
                <div className="login__content">
                    {/* Image Section */}
                    <div className="login__img">
                        <img src="https://raw.githubusercontent.com/bedimcode/responsive-login-signin-signup/b3c2eaa19d76624092bd606d28fbd616d539de92/assets/img/img-login.svg" alt="Login Illustration"/>
                    </div>

                    {/* Form Section */}
                    <div className="login__forms">
                        <form action={handleLogin} className="login__registre block">

                            <h1 className="login__title">Sign In</h1>

                            <Link href="/" className="return">
                                return
                            </Link>

                            <div className="login__box">
                                <i className='bx bx-user login__icon'></i>
                                <input name="email" type="email" placeholder="Email" required className="login__input"/>
                            </div>

                            <div className="login__box">
                                <i className='bx bx-lock-alt login__icon'></i>
                                <input name="password" type="password" placeholder="Password" required className="login__input"/>
                            </div>

                            <a href="#" className="login__forgot">Forgot password?</a>

                            <button type="submit" className="login__button">Sign In</button>

                            <div>
                                <span className="login__account">Don't have an Account?</span>
                                {/* This links to the Signup Page */}
                                <Link href="/signup" className="login__signin">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}