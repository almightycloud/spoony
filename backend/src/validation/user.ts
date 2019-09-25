import * as yup from 'yup';

export const emailValidator = yup.string().label('email').email().required();
export const passwordValidator = yup.string().label('password').min(8).required();
export const firstNameValidator = yup.string().label('first name').required().trim();
export const lastNameValidator = yup.string().label('last name').required().trim();
export const phoneNumberValidator = yup.string().label('phone number').matches(/[0-9]{3}-[0-9]{3}-[0-9]{4}/).required();
