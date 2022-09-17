import React from 'react';
import { useForm } from "react-hook-form";
import auth from '../../firebase.init';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import Loading from '../Shared/Loading';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const Login = () => {
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    useEffect(() => {
        if (user || gUser) {
            console.log(user);
            navigate(from, { replace: true });
        }
    })

    if (loading || gLoading) {
        return <Loading></Loading>
    }
    let loginError;
    if (error || gError) {
        loginError = <p className='text-red-500 font-bold'>{error?.message || gError?.message}</p>
    }

    const onSubmit = (data) => {
        console.log(data);
        signInWithEmailAndPassword(data.email, data.password)
    };
    return (
        <div className='flex justify-center h-screen items-center'>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center font-bold">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 justify-items-center'>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input input-bordered w-full max-w-xs"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Please Fill Required Field'
                                    },
                                    pattern: {
                                        value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/,
                                        message: 'Please Try a Valid Email' // JS only: <p>error message</p> TS only support string
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.email?.type === 'required' && <span className='text-red-500 font-bold'>{errors?.email.message}</span>}
                                {errors.email?.type === 'pattern' && <span className='text-red-500 font-bold'>{errors?.email.message}</span>}
                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered w-full max-w-xs"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: 'Please Fill Required Field'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'Please Give Atleast 6 Character' // JS only: <p>error message</p> TS only support string
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.password?.type === 'required' && <span className='text-red-500 font-bold'>{errors?.password.message}</span>}
                                {errors.password?.type === 'minLength' && <span className='text-red-500 font-bold'>{errors?.password.message}</span>}
                            </label>
                        </div>
                        {loginError}
                        <input type="submit" className='btn btn-primary w-full' value='Login' />
                    </form>
                    <p><small>New to Doctors Portal? <Link className='text-primary' to='/register'>Create New Account</Link></small></p>
                    <div className="divider">OR</div>
                    <button onClick={() => signInWithGoogle()} className="btn btn-outline btn-success">Google_SignIn</button>
                </div>
            </div>
        </div>
    );
};

export default Login;