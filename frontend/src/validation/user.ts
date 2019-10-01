import * as yup from 'yup';

export const emailValidator = yup.string().label('email').email('Please enter a valid email address').required('Please enter your email address');
export const passwordValidator = yup.string().label('password').min(8, 'Please enter at least 8 characters').required('Please enter a password');
export const firstNameValidator = yup.string().label('first name').required('Please enter your first name').trim();
export const lastNameValidator = yup.string().label('last name').required('Please enter your last name').trim();
export const phoneNumberValidator = yup.string().label('phone number')
  .matches(/^\d{3}-?\d{3}-?\d{4}$/, 'Please enter a valid phone number (eg. 555-555-5555)')
  .required('Please enter your phone number');
