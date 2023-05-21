const DEFAULT_PICTURE = "images/avatar-70x70.png";

export const isCustomAvatar = (picture) => {
  return picture.includes("/jtv_user_pictures/");
};

export const getFilteredAvatar = (picture) => {
  return isCustomAvatar(picture) ? picture : DEFAULT_PICTURE;
};
