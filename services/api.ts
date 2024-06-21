import axios from 'axios';

export const API_URL = 'https://665621609f970b3b36c4625e.mockapi.io/users';

export const fetchUsers = async (page = 1, filters = {}) => {
  const params = { page, ...filters };
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const editUser = async (userDetails: any) => {
  const {username, fullName, avatar, id} = userDetails;
  const response = await axios.put(API_URL + `/${id}`, { username, fullName  });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(API_URL+ `/${userId}`);
  return response.data;
};

export const createUser = async (userDetails: any) => {
  const response = await axios.post(API_URL, {...userDetails});
  return response.data;
}