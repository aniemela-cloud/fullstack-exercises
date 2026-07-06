import { create } from "zustand";
import blogService from "./services/blogs";

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    setMessage: (message) => {
      set(() => ({ message }));
      setTimeout(() => {
        set(() => ({ message: null }));
      }, 5000);
    },
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.message);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const fetchedBlogs = await blogService.getAll();
      const blogs = fetchedBlogs.toSorted((a, b) => b.likes - a.likes);
      console.log("initialize blogs", blogs);
      set(() => ({
        blogs,
      }));
    },

    addBlog: async (newBlog) => {
      const result = await blogService.create(newBlog);
      set((state) => ({
        blogs: state.blogs.concat(result),
      }));
    },
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogActions = () => useBlogStore((state) => state.actions);
