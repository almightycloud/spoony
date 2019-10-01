import { Link, navigate } from '@reach/router';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import HTTP_STATUS from '../lib/http-status';
import { useStoreActions } from '../store';
import { emailValidator, passwordValidator } from '../validation/user';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = yup.object({
  email: emailValidator,
  password: passwordValidator,
});

const Login: React.FC = () => {
  const loginUser = useStoreActions((actions) => actions.user.loginUser);
  const clearUser = useStoreActions((actions) => actions.user.clearUser);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    clearUser();
  });

  async function handleSubmit(credentials: typeof initialValues): Promise<void> {
    const status = await loginUser(credentials);

    switch (status) {
      case HTTP_STATUS.OK:
        navigate('/');
        break;
      case HTTP_STATUS.NOT_FOUND:
        setErrorMessage('Couldn\'t find a user with that email & password combination.');
        break;
      case HTTP_STATUS.BAD_REQUEST:
        setErrorMessage('Validation error? Make sure all your fields are valid and make sense...');
        break;
      case HTTP_STATUS.NETWORK_ERROR:
        setErrorMessage('Network error... are you connected to the internet?');
        break;
      default:
        setErrorMessage('Hmm, something went wrong... please try again later.');
        break;
    }
  }

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl">Login</h1>
        {errorMessage && <h2 className="text-red-500 mt-4">{errorMessage}</h2>}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-full mx-auto max-w-xs px-4 sm:px-0">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <ErrorMessage name="email" className="text-sm text-red-500 mb-1" component="div" />
            <Field name="email" type="email" placeholder="john.doe@email.com" autoComplete="off" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <ErrorMessage name="password" className="text-sm text-red-500 mb-1" component="div" />
            <Field name="password" type="password" placeholder="******************" autoComplete="off" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <button className="w-full mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Login
          </button>
          <p>
            Don&#39;t have an account?
            {' '}
            <Link to="/register" className="text-gray-500 font-bold focus:outline-none focus:shadow-outline">
              Register here!
            </Link>
          </p>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
