import { MyConnectionNode, MyMessageNode } from '..';

type BaseNode = {
  id: string;
  extendsData: any;
};

export type ICreateMessageNode = BaseNode & {
  title: string;
  message: string;
  isEntryFlow: boolean;
  isFinalFlow: boolean;
};

export type ICreateConnectionNode = BaseNode & {
  source: string;
  target: string;
  mustBeEqualTo: string;
  messageIfAnswerIsInvalidId?: string;
  customMessageIfAnswerIsInvalid?: string;
};

export type IMessageChatbotFlow = {
  id: string;
  title: string;
  message: string;
  isEntryFlow: boolean;
  isFinalFlow: boolean;
  extendsData: MyMessageNode;
};
export type IConnectionChatbotFlow = {
  id: string;
  source: string;
  target: string;
  extendsData: MyConnectionNode;
  mustBeEqualTo: string;
  messageIfAnswerIsInvalidId?: string;
  customMessageIfAnswerIsInvalid?: string;
};

export type IChatbotFlow = IMessageChatbotFlow | IConnectionChatbotFlow;
