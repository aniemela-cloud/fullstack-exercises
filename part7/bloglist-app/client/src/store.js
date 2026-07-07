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

const useBlogStore = create((set, get) => ({
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
      // Using just result.title to check that the result object isn't malformed
      if (result && result.title) {
        set((state) => ({
          blogs: state.blogs.concat(result),
        }));
      }
    },

    deleteBlog: async (theBlog) => {
      const deleted = await blogService.deleteBlog(theBlog);
      if (deleted && deleted.status === 204) {
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog.id !== theBlog.id),
        }));
      }
    },

    getBlog: (blog_id) => {
      const theBlog = get().blogs.find((b) => b.id === blog_id);
      return theBlog;
    },

    updateLike: async ({ id, likes }) => {
      await blogService.update({ id, likes });
      set((state) => ({
        blogs: state.blogs.toSorted((a, b) => b.likes - a.likes),
      }));
    },
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogActions = () => useBlogStore((state) => state.actions);

const useUserStore = create((set) => ({
  user: null,
  actions: {
    setUser: (user) => {
      set(() => ({ user }));
    },
  },
}));

export const useUser = () => useUserStore((state) => state.user);
export const useUserActions = () => useUserStore((state) => state.actions);
