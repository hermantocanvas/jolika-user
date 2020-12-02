import { WISHLIST_SET_COUNT } from '../types';

export default (state, action) => {
  if (action.type === WISHLIST_SET_COUNT) {
    return {
      ...state,
      count: action.payload.count,
    };
  }
  return state;
};
