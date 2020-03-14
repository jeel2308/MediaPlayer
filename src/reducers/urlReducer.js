const urlState = {
  url: "",
  subtitleUrl: ""
};

const urlReducer = (state = urlState, action) => {
  if (action.type === "UPDATE_URL") {
    return {
      url: action.url,
      subtitleUrl: action.subtitleUrl
    };
  } else if (action.type === "UPDATE_SUBTITLE") {
    return {
      ...state,
      subtitleUrl: action.subtitleUrl
    };
  } else return state;
};

export default urlReducer;
