import { PostInterface, UserInterface, GroupInterface, CommentInterface } from '@/types/post.types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const libApi = {
  async get(endpoint: string) {
    const token = getAuthToken();
    const response = await fetch(`${baseUrl}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed`);
    }
    return response.json();
  },

  async post(endpoint: string, body: unknown) {
    const token = getAuthToken();
    const response = await fetch(`${baseUrl}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed`);
    }
    return response.json();
  },
};

async function getPosts() {
  const posts = await libApi.get('/posts');
  return posts as PostInterface[];
}

async function getSuggestedPeople() {
  const suggested = await libApi.get('/getSuggested');
  return suggested as UserInterface[];
}

async function getGroups() {
  const groups = await libApi.get('/groups');
  return groups as GroupInterface[];
}

async function getMe() {
  const me = await libApi.get('/me');
  return me as UserInterface;
}

async function getUser(id: number) {
  const response = await libApi.get(`/users/${id}`);
  return response as UserInterface;
}

async function getGroup(id: number) {
  const response = await libApi.get(`/groups/${id}`);
  return response as GroupInterface;
}

async function getPostComments(id: number) {
  const response = await libApi.get(`/posts/${id}/comments`);
  return response as CommentInterface[];
}

async function getStatistic() {
  return await Promise.all([
    libApi.get('/me/comments'),
    libApi.get('/me/likes'),
    libApi.get('/me/posts'),
  ]);
}

export {
  libApi as default,
  libApi,
  getStatistic,
  getMe,
  getAuthToken,
  getPosts,
  getSuggestedPeople,
  getGroups,
  getUser,
  getGroup,
  getPostComments,
};
