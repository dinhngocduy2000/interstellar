import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
export const DefaultMetadata: Metadata = {
  title: "FakeGPT",
  description:
    "FakeGPT is a modern AI chatbot that can help you with your tasks and projects",
  keywords: [
    "FakeGPT",
    "Task management app",
    "Manage Tasks",
    "Kanban board",
    "Calendar view",
  ],
  openGraph: {
    title: "FakeGPT | Modern AI Chatbot",
    description:
      "FakeGPT is a modern AI chatbot that can help you with your tasks and projects",
    url: "https://nullify-eight.vercel.app/", // Replace with your actual URL
    siteName: "FakeGPT",
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
    title: "FakeGPT | Modern AI Chatbot",
    description:
      "FakeGPT is a modern AI chatbot that can help you with your tasks and projects",
    images: ["/images/nuliplayer-thumbnail.png"], // Replace with your image path
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
