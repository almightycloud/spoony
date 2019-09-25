import { Action, action, thunk, Thunk } from 'easy-peasy';
import createLogger from '../lib/logger';

const logger = createLogger('todo');
const jsonplaceholderUrl = 'https://jsonplaceholder.typicode.com';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoModel {
  todos: Todo[];
  fetchTodos: Thunk<TodoModel>;
  setTodos: Action<TodoModel, Todo[]>;
  clearTodos: Action<TodoModel>;
  addTodo: Thunk<TodoModel, string>;
  addedTodo: Action<TodoModel, Todo>;
  deleteTodo: Thunk<TodoModel, number>;
  deletedTodo: Action<TodoModel, number>;
  toggleTodo: Thunk<TodoModel, number>;
  toggledTodo: Action<TodoModel, number>;
}

const todoModel: TodoModel = {
  todos: [],
  fetchTodos: thunk(async (actions) => {
    try {
      logger.begin('fetching todos');

      const url = `${jsonplaceholderUrl}/users/1/todos`;
      logger.continue(`sending GET request to ${url}`);
      const response = await fetch(url);

      if (response.ok) {
        const todos = await response.json();
        actions.setTodos(todos);
        logger.continue('successfully feteched %d todos.', todos.length);
      } else {
        logger.continue('error retrieving todos');
      }
    } catch (e) {
      logger.continue('network error while attempting to retreive todos: %o', e);
    }
  }),
  setTodos: action((state, todos) => {
    logger.continue('setting todos');
    state.todos = todos;
  }),
  clearTodos: action((state) => {
    logger.continue('clearing todos.');
    state.todos = [];
  }),
  addTodo: thunk(async (actions, title, { getState }) => {
    logger.begin('attempting to add todo');
    const todo = { completed: false, title, userId: 1, id: getState().todos.length + 1 };

    try {
      logger.continue('POSTing server...');

      const url = `${jsonplaceholderUrl}/todos`;
      logger.continue(`sending POST request to ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });

      if (response.ok) {
        actions.addedTodo(todo);
        logger.continue('successfully added todo!');
      } else {
        logger.continue('error while attempting to add todo: %s', response.statusText);
      }
    } catch (e) {
      logger.continue('network error while attempting to add todo: %o', e);
    }
  }),
  addedTodo: action((state, todo) => {
    logger.continue('adding todo: %o', todo);
    state.todos = [todo, ...state.todos];
  }),
  deleteTodo: thunk(async (actions, id) => {
    try {
      logger.begin('attempting to delete todo');

      const url = `${jsonplaceholderUrl}/todos/${id}`;
      logger.continue(`sending DELETE request to ${url}`);
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        actions.deletedTodo(id);
        logger.continue('successfully deleted todo!');
      } else {
        logger.continue('error while attempting to deleting todo: %s', response.statusText);
      }
    } catch (e) {
      logger.continue('network error while attempting to delete todo: %o', e);
    }
  }),
  deletedTodo: action((state, id) => {
    logger.continue('removing todo with id: %d', id);
    state.todos = state.todos.filter((todo) => todo.id !== id);
  }),
  toggleTodo: thunk(async (actions, id, { getState }) => {
    logger.begin('attempting to toggle todo');
    const todo = getState().todos.find((t) => t.id === id);

    if (!todo) {
      logger.continue('couldn\'t find todo with id: %d', id);
      return;
    }

    try {
      const url = `${jsonplaceholderUrl}/todos/${id}`;
      logger.continue(`sending PATCH request to ${url}`);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (response.ok) {
        actions.toggledTodo(id);
        logger.continue('successfully toggled todo!');
      } else {
        logger.continue('error while attempting to toggle todo: %s', response.statusText);
      }
    } catch (e) {
      logger.continue('network error while attempting to toggle: %o', e);
    }
  }),
  toggledTodo: action((state, id) => {
    logger.continue('toggling todo with id: %d', id);
    const todo = state.todos.find((t) => t.id === id);

    if (!todo) {
      logger.continue('couldn\'t find todo with id: %d', id);
      return;
    }

    todo.completed = !todo.completed;
  }),
};

export default todoModel;
