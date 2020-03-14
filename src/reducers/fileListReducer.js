const fileList = {
  fileEntries: [],
  directory: "",
  subtitleList: [],
  currentIndex: -1
};

const fileListReducer = (state = fileList, action) => {
  switch (action.type) {
    case "UPDATE_FILES":
      return {
        ...state,
        fileEntries: action.fileEntries,
        directory: action.directory
      };
    case "UPDATE_SUBTITLE_LIST":
      return {
        ...state,
        subtitleList: action.subtitleList
      };
    case "UPDATE_INDEX":
      return {
        ...state,
        currentIndex: action.currentIndex
      };
    default:
      return state;
  }
};

export default fileListReducer;
