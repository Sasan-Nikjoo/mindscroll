import { createUser } from '@/lib/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import '../auth.css';

export default function SignupPage() {

    async function handleSignup(formData: FormData) {
        'use server';

        const email = formData.get('email') as string;
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            await createUser(email, username, hashedPassword);
        } catch (error: any) {
            console.error('Signup failed:', error.message);
            return;
        }

        redirect('/');
    }

    return (
        <div className="login-container">
            <div className="login">
                <div className="login__content">
                    {/* Image Section */}
                    <div className="login__img">
                        <img src="https://raw.githubusercontent.com/bedimcode/responsive-login-signin-signup/b3c2eaa19d76624092bd606d28fbd616d539de92/assets/img/img-login.svg" alt="Signup Illustration"/>
                    </div>

                    {/* Form Section */}
                    <div className="login__forms">
                        <form action={handleSignup} className="login__create block">
                            <h1 className="login__title">Create Account</h1>

                            <div className="login__box">
                                <i className='bx bx-user login__icon'></i>
                                <input name="username" type="text" placeholder="Username" required className="login__input"/>
                            </div>

                            <div className="login__box">
                                <i className='bx bx-at login__icon'></i>
                                <input name="email" type="email" placeholder="Email" required className="login__input"/>
                            </div>

                            <div className="login__box">
                                <i className='bx bx-lock-alt login__icon'></i>
                                <input name="password" type="password" placeholder="Password" required className="login__input"/>
                            </div>

                            <button type="submit" className="login__button">Sign Up</button>

                            <div>
                                <span className="login__account">Already have an Account?</span>
                                {/* This links to the Login Page */}
                                <Link href="/login" className="login__signup">
                                    Sign In
                                </Link>
                            </div>

                            {/* Optional Social Icons */}
                            <div className="login__social">
                                <a href="#" className="login__social-icon"><i className='bx bxl-facebook' ></i></a>
                                <a href="#" className="login__social-icon"><i className='bx bxl-twitter' ></i></a>
                                <a href="#" className="login__social-icon"><i className='bx bxl-google' ></i></a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}