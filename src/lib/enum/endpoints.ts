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

export enum CHAT_ENDPOINTS {
  SEND_MESSAGE = "/chat/sse/",
  GET_MESSAGES = "/chat",
}
