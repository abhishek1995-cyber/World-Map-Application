import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const intialValues = {
  countryData: [],
};

function reducer(state = intialValues, action) {
  switch (action.type) {
    case "GET_COUNTRY_DETAILS":
      return {
        ...state,
        countryData: action.payload,
      };
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
