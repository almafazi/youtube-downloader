import axios from 'axios';
import { host } from './helpers';

export const API = axios.create({
  baseURL: host,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getFormats = async (videoURL: string) => {
  return await API.get(`/formats?url=${encodeURIComponent(videoURL)}`);
};

export const getSuggestions = async (
  searchQuery: string,
  nextPageToken: string = ''
) => {
  return await API.get(
    `/suggestions?search=${searchQuery}&next=${nextPageToken}`
  );
};

export const getInfos = async (url: string) => {
  return await API.get(`/metainfo?url=${url}`);
};

export const fetchInfo = async (formData: { downloadMode: string, url: string }) => {
  return await API.post(`/`, formData);
};

export const sendContactForm = async (formData: { email: string, issueType: string, description: string }) => {
  return await API.post(`/contact`, formData);
};

export const getSearch = async (
  searchQuery: string,
  nextPageToken: string = ''
) => {
  return await API.post('/search', {
    query: searchQuery,
    next: nextPageToken
  });
};