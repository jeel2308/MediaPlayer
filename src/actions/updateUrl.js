export const updateUrl = ({ url, subtitleUrl }) => ({
  type: "UPDATE_URL",
  url,
  subtitleUrl
});
export const updateSubtitleUrl = ({ subtitleUrl }) => ({
  type: "UPDATE_SUBTITLE",
  subtitleUrl
});
