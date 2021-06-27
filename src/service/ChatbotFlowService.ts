import { INodeType, MyMessageNode } from '../types';
import {
  IChatbotFlow,
  IConnectionChatbotFlow,
  ICreateConnectionNode,
  ICreateMessageNode,
} from '../types/services/ChatbotFlowService';
import FetchService from './FetchService';

class ChatbotFlowService {
  static async createMessageNode(data: ICreateMessageNode) {
    const response = await FetchService.create<MyMessageNode>(
      '/chatbot-flow/messages',
      {
        type: INodeType.NODE,
        ...data,
      }
    );

    return response;
  }

  static async updateMessageNode(data: ICreateMessageNode) {
    const response = await FetchService.update<MyMessageNode>(
      `/chatbot-flow/messages/${data.id}`,
      {
        type: INodeType.NODE,
        ...data,
      }
    );

    return response;
  }

  static async createOrUpdateConnectionNode(data: ICreateConnectionNode) {
    const response = await FetchService.update<IConnectionChatbotFlow>(
      '/chatbot-flow/connections',
      {
        type: INodeType.CONNECTION,
        ...data,
      }
    );

    return response;
  }

  static async findAll() {
    const response = await FetchService.get<IChatbotFlow[]>('/chatbot-flow');

    return response;
  }

  // async delete<T>(path: string, params?: any) {
  //   const response = await FetchService.delete<T>(path, {
  //     params,
  //   });

  //   return response.data;
  // }

  // async update<T>(path: string, data?: any) {
  //   const response = await FetchService.put<T>(path, data);

  //   return response.data;
  // }
}

export default ChatbotFlowService;
