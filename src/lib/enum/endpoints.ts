export enum AUTH_ENDPOINTS {
  LOGIN = "/api/v1/auth/login",
  REFRESH_TOKEN = "/api/v1/auth/refresh",
  SIGN_UP = "/api/v1/auth/register",
  TRACK_SESSION = "/api/v1/auth/track",
}

export enum CONVERSATIONS_ENDPOINTS {
  LIST = "/api/v1/conversations",
  GET = "/api/v1/conversations/{$id}",
}

export enum CHAT_ENDPOINTS {
  SEND_MESSAGE = "/api/v1/chat/sse/",
  GET_MESSAGES = "/api/v1/chat",
  UPVOTE_MESSAGE = "/api/v1/chat/upvote",
  DOWNVOTE_MESSAGE = "/api/v1/chat/downvote",
}
