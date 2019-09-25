import todoModel, { TodoModel } from './todo';
import userModel, { UserModel } from './user';

export interface StoreModel {
  user: UserModel;
  todo: TodoModel;
}

const storeModel: StoreModel = {
  user: userModel,
  todo: todoModel,
};

export default storeModel;
