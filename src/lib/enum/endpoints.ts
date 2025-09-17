export enum AUTH_ENDPOINTS {
  LOGIN = "/auth/login",
  REFRESH_TOKEN = "/auth/refresh",
  SIGN_UP = "/auth/register",
  TRACK_SESSION = "/auth/track",
}

export enum CONVERSATIONS_ENDPOINTS {
  LIST = "/conversations",
  GET = "/conversations/{$id}",
}
