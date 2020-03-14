export const updateList = ({ directoryList, directory }) => {
  return {
    type: "UPDATE_FILES",
    directoryList,
    directory
  };
};

export const updateSubtitleList = ({ subtitleList }) => {
  return {
    type: "UPDATE_SUBTITLE_LIST",
    subtitleList
  };
};

export const currentIndex = ({ currentIndex }) => {
  return {
    type: "UPDATE_INDEX",
    currentIndex
  };
};
