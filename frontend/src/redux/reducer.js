import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import postReducer from './post/post.reducer';

const reducer = combineReducers({
    user: userReducer,
    post: postReducer
});

export default reducer;