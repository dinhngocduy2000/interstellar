import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { AxiosErrorPayload } from "./interfaces/utils";
export const DefaultMetadata: Metadata = {
  title: "Interstellar",
  description:
    "Interstellar is a modern AI chatbot that can help you with your tasks and projects",
  keywords: [
    "Interstellar",
    "Task management app",
    "Manage Tasks",
    "Kanban board",
    "Calendar view",
  ],
  openGraph: {
    title: "Interstellar | Modern AI Chatbot",
    description:
      "Interstellar is a modern AI chatbot that can help you with your tasks and projects",
    url: "https://nullify-eight.vercel.app/", // Replace with your actual URL
    siteName: "Interstellar",
    images: [
      {
        url: "/images/nuliplayer-thumbnail.png", // Replace with your image path
        width: 1200,
        height: 630,
        alt: "Nuliplayer Music Player Thumbnail",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interstellar | Modern AI Chatbot",
    description:
      "Interstellar is a modern AI chatbot that can help you with your tasks and projects",
    images: ["/images/nuliplayer-thumbnail.png"], // Replace with your image path
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: AxiosError<AxiosErrorPayload>) => {
  return error.response?.data?.message || "Something went wrong";
};
