export const REGEX_EMAIL = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const REGEX_PREVENT_ONLY_WHITESPACES = /\S+/;

export const REGEX_PASSWORD =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

export const REGEX_NUMBER_FOLLOWED_BY_CHARACTERS =
  // eslint-disable-next-line no-useless-escape
  /^[0-9]+[a-zA-Z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/;
