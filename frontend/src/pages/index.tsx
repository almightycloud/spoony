import { Redirect } from '@reach/router';
import classnames from 'classnames';
import { Field, Form, Formik, FormikActions } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { useAsync } from '../lib/hooks';
import createLogger from '../lib/logger';
import { useStoreActions, useStoreState } from '../store';

const logger = createLogger('home');

const initialValues = {
  title: '',
};

const validationSchema = yup.object({
  title: yup.string().required(),
});

type NewTodo = typeof initialValues;

const Home: React.FC = () => {
  const isLoggedIn = useStoreState((store) => !!store.user.user.email);
  const todos = useStoreState((store) => store.todo.todos);
  const fetchTodos = useStoreActions((actions) => actions.todo.fetchTodos);
  const addTodo = useStoreActions((actions) => actions.todo.addTodo);
  const toggleTodo = useStoreActions((actions) => actions.todo.toggleTodo);
  const deleteTodo = useStoreActions((actions) => actions.todo.deleteTodo);
  const isLoading = useAsync(async () => {
    if (!isLoggedIn || todos.length) {
      // not logged in or we already loaded the todos
      return;
    }

    await fetchTodos();
  }, []);

  if (!isLoggedIn) {
    logger.log('user not logged in, redirecting to /login.');
    return <Redirect to="/login" noThrow />;
  }

  if (isLoading) {
    return (<div>Loading...</div>);
  }

  async function handleSubmit({ title }: NewTodo, actions: FormikActions<NewTodo>): Promise<void> {
    await addTodo(title);
    actions.resetForm();
  }

  return (
    <div>
      <h1 className="text-5xl text-center">Todos</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex appearance-none bg-white border p-4 mb-4 rounded">
          <Field
            type="text"
            name="title"
            className="appearance-none mr-2 border rounded bg-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="New todo..."
            autoComplete="off"
          />
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Add</button>
        </Form>
      </Formik>

      { todos.map((todo) => (
        <div key={todo.id} className="flex justify-between">
          <div
            role="checkbox"
            aria-checked={todo.completed}
            tabIndex={0}
            className="appearance-none w-full bg-white border-b border-l border-t p-4 rounded cursor-pointer hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
            onClick={(): void => toggleTodo(todo.id)}
            onKeyPress={(e): void => { e.preventDefault(); toggleTodo(todo.id); }}
          >
            <span className={classnames({ 'line-through': todo.completed })}>{todo.title}</span>
          </div>
          <button type="button" onClick={(): void => deleteTodo(todo.id)} className="bg-white w-16 border rounded hover:bg-red-400 focus:bg-red-400 focus:outline-none">
            x
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;
