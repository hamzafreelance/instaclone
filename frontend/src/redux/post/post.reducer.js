const INITIAL_STATE = {
    posts: null
};


const postReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'GET_USER_POSTS':
            return {
                ...state,
                posts: action.payload
            };
            break;
        default: 
            return state;
    }
};

export default postReducer;