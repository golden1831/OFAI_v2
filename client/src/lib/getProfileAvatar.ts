import LogoPlaceholder from '../assets/images/logo-placeholder.jpg';

export function profileAvatar(profileImage?: string)  {
  if (profileImage && !profileImage.includes("googleusercontent")) {
    return profileImage;
  }

  return LogoPlaceholder
}
