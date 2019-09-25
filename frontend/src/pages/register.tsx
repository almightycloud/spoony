import { Link, navigate } from '@reach/router';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import HTTP_STATUS from '../lib/http-status';
import { useStoreActions } from '../store';
import { emailValidator, firstNameValidator, lastNameValidator, passwordValidator, phoneNumberValidator } from '../validation/user';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
};

const validationSchema = yup.object({
  firstName: firstNameValidator,
  lastName: lastNameValidator,
  email: emailValidator,
  password: passwordValidator,
  phoneNumber: phoneNumberValidator,
});


const Register: React.FC = () => {
  const registerUser = useStoreActions((actions) => actions.user.registerUser);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(newUser: typeof initialValues): Promise<void> {
    const status = await registerUser(newUser);

    switch (status) {
      case HTTP_STATUS.CREATED:
        navigate('/');
        break;
      case HTTP_STATUS.BAD_REQUEST:
        setErrorMessage('Validation error? Make sure all your fields are valid and make sense...');
        break;
      case HTTP_STATUS.CONFLICT:
        setErrorMessage('That email is already taken!');
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
        <h1 className="text-2xl">Register</h1>
        {errorMessage && <h2 className="text-red-500 mt-4">{errorMessage}</h2>}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-full mx-auto max-w-xs px-4 sm:px-0">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first-name">
              First Name
            </label>
            <ErrorMessage name="firstName" className="text-sm text-red-500 mb-1" component="div" />
            <Field className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="firstName" type="text" placeholder="John" autoComplete="off" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last-name">
              Last Name
            </label>
            <ErrorMessage name="lastName" className="text-sm text-red-500 mb-1" component="div" />
            <Field className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="lastName" type="text" placeholder="Doe" autoComplete="off" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <ErrorMessage name="email" className="text-sm text-red-500 mb-1" component="div" />
            <Field className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="email" type="email" placeholder="john.doe@email.com" autoComplete="off" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone-number">
              Phone Number
            </label>
            <ErrorMessage name="phoneNumber" className="text-sm text-red-500 mb-1" component="div" />
            <Field className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="phoneNumber" type="tel" placeholder="555-555-5555" pattern="^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$" autoComplete="off" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <ErrorMessage name="password" className="text-sm text-red-500 mb-1" component="div" />
            <Field className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="password" type="password" placeholder="******************" autoComplete="off" />
          </div>
          <button className="w-full mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Register
          </button>
          <p>
            Already have an account?
            {' '}
            <Link to="/login" className="text-gray-500 font-bold focus:outline-none focus:shadow-outline">
              Login here!
            </Link>
          </p>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
