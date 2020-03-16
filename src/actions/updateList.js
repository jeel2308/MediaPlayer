export const updateList = ({ fileEntries, directory }) => {
  return {
    type: "UPDATE_FILES",
    fileEntries,
    directory
  };
};

export const refreshList = ({ fileEntries }) => {
  return {
    type: "REFRESH_LIST",
    fileEntries
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
