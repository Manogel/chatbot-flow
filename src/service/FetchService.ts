import axios from 'axios';

class FetchService {
  static client = axios.create({
    baseURL: 'http://localhost:3333',
  });

  static async create<T>(path: string, data?: any) {
    const response = await this.client.post<T>(path, data);

    return response.data;
  }

  static async delete<T>(path: string, params?: any) {
    const response = await this.client.delete<T>(path, {
      params,
    });

    return response.data;
  }

  static async update<T>(path: string, data?: any) {
    const response = await this.client.put<T>(path, data);

    return response.data;
  }

  static async get<T>(path: string, params?: any) {
    const response = await this.client.get<T>(path, {
      params,
    });

    return response.data;
  }
}

export default FetchService;
