import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import {
  ChatClient,
  ChatMessage,
  ChatMessageStatusCallback,
  ChatMessageTypeFromString,
  ChatConversationTypeFromNumber,
  ChatMessageEventListener,
  ChatGroupMessageAck,
  ChatError,
  ChatMessageThreadEvent,
  ChatMessageReactionEvent,
  ChatMessageChatTypeFromNumber,
} from 'react-native-chat-sdk';
import { styleValues } from '../__internal__/Css';
import {
  LeafScreenBase,
  StateBase,
  StatelessBase,
} from '../__internal__/LeafScreenBase';
import { ChatManagerCache, metaDataList, MN } from './ChatManagerData';
import type { ApiParams } from '../__internal__/DataTypes';
import { generateData } from '../__internal__/Utils';

export interface StateChatMessage extends StateBase {
  cb_result: string;
  resendMessage: {
    message: ChatMessage;
  };
  sendMessageReadAck: {
    message: ChatMessage;
  };
  sendGroupMessageReadAck: {
    msgId: string;
    groupId: string;
    opt?: { content: string };
  };
  sendConversationReadAck: {
    convId: string;
  };
  recallMessage: {
    msgId: string;
  };
  getMessage: {
    msgId: string;
  };
  markAllConversationsAsRead: {};
  getUnreadMessageCount: {};
  updateMessage: {
    message: ChatMessage;
  };
  importMessages: {
    message: ChatMessage;
  };
  downloadAttachment: {
    message: ChatMessage;
    callback: ChatMessageStatusCallback;
  };
  downloadThumbnail: {
    message: ChatMessage;
    callback: ChatMessageStatusCallback;
  };
  fetchHistoryMessages: {
    convId: string;
    chatType: number;
    pageSize: number;
    startMsgId: string;
  };
  searchMsgFromDB: {
    keywords: string;
    timestamp: number;
    maxCount: number;
    from: string;
    direction: number;
  };
  fetchGroupAcks: {
    msgId: string;
    startAckId: string;
    pageSize: number;
    groupId: string;
  };
  deleteRemoteConversation: {
    convId: string;
    convType: number;
    isDeleteMessage: boolean;
  };
  getConversation: {
    convId: string;
    convType: number;
    createIfNeed: boolean;
  };
  loadAllConversations: {};
  getConversationsFromServer: {};
  deleteConversation: {
    convId: string;
    withMessage: boolean;
  };
  getLatestMessage: {
    convId: string;
    convType: number;
  };
  getLastReceivedMessage: {
    convId: string;
    convType: number;
  };
  unreadCount: {
    convId: string;
    convType: number;
  };
  markMessageAsRead: {
    convId: string;
    convType: number;
    msgId: string;
  };
  markAllMessagesAsRead: {
    convId: string;
    convType: number;
  };
  insertMessage: {
    convId: string;
    convType: number;
    msg: ChatMessage;
  };
  appendMessage: {
    convId: string;
    convType: number;
    msg: ChatMessage;
  };
  updateConversationMessage: {
    convId: string;
    convType: number;
    msg: ChatMessage;
  };
  deleteMessage: {
    convId: string;
    convType: number;
    msgId: string;
  };
  deleteAllMessages: {
    convId: string;
    convType: number;
  };
  getMessageById: {
    convId: string;
    convType: number;
    msgId: string;
  };
  getMessagesWithMsgType: {
    convId: string;
    convType: number;
    msgType: string;
    direction: number;
    timestamp: number;
    count: number;
    sender: string;
  };
  getMessages: {
    convId: string;
    convType: number;
    direction: number;
    startMsgId: string;
    loadCount: number;
  };
  getMessagesWithKeyword: {
    convId: string;
    convType: number;
    keywords: string;
    direction: number;
    timestamp: number;
    count: number;
    sender: string;
  };
  getMessagesFromTime: {
    convId: string;
    convType: number;
    startTime: number;
    endTime: number;
    direction: number;
    count: number;
  };
  translateMessage: {
    msg: ChatMessage;
    languages: string[];
  };
  fetchSupportLanguages: {};
  // setConversationExtension: {
  //   convId: string;
  //   convType: number;
  //   ext: any;
  // };
  addReaction: {
    reaction: string;
    msgId: string;
  };
  removeReaction: {
    reaction: string;
    msgId: string;
  };
  fetchReactionList: {
    msgIds: string[];
    groupId: string;
    chatType: number;
  };
  fetchReactionDetail: {
    msgId: string;
    reaction: string;
    cursor: string;
    pageSize: number;
  };
  reportMessage: {
    msgId: string;
    tag: string;
    reason: string;
  };
  getReactionList: {
    msgId: string;
  };
  groupAckCount: {
    msgId: string;
  };
  createChatThread: {
    threadName: string;
    msgId: string;
    parentId: string;
  };
  joinChatThread: {
    chatThreadId: string;
  };
  leaveChatThread: {
    chatThreadId: string;
  };
  destroyChatThread: {
    chatThreadId: string;
  };
  updateChatThreadName: {
    chatThreadId: string;
    newName: string;
  };
  removeMemberWithChatThread: {
    chatThreadId: string;
    memberId: string;
  };
  fetchMembersWithChatThreadFromServer: {
    chatThreadId: string;
    cursor: string;
    pageSize: number;
  };
  fetchJoinedChatThreadFromServer: {
    cursor: string;
    pageSize: number;
  };
  fetchJoinedChatThreadWithParentFromServer: {
    parentId: string;
    cursor: string;
    pageSize: number;
  };
  fetchChatThreadWithParentFromServer: {
    parentId: string;
    cursor: string;
    pageSize: number;
  };
  fetchLastMessageWithChatThread: {
    chatThreadIds: string[];
  };
  fetchChatThreadFromServer: {
    chatThreadId: string;
  };
  getMessageThread: {
    msgId: string;
  };
}

export interface StatelessChatMessage extends StatelessBase {
  sendMessage: {
    message?: ChatMessage;
    callback?: ChatMessageStatusCallback;
    lastMessage?: ChatMessage;
  };
  resendMessage: {
    message?: ChatMessage;
  };
  sendMessageReadAck: {
    message?: ChatMessage;
  };
}

export class ChatManagerLeafScreen extends LeafScreenBase<StateChatMessage> {
  protected static TAG = 'ChatManagerLeafScreen';
  public static route = 'ChatManagerLeafScreen';
  metaData: Map<string, ApiParams>;
  statelessData: StatelessChatMessage;
  stateTemp: any;
  constructor(props: { navigation: any }) {
    super(props);
    this.metaData = metaDataList;
    this.state = Object.assign({}, generateData(metaDataList), {
      sendResult: '',
      recvResult: '',
      exceptResult: '',
      cb_result: '',
    });
    this.statelessData = {
      sendMessage: {},
      resendMessage: {},
      sendMessageReadAck: {},
    };
    this.stateTemp = Object.assign({}, this.state);
  }

  protected renderResult(): ReactNode {
    return (
      <View style={styleValues.containerColumn}>
        {this.renderSendResult()}
        {this.renderRecvResult()}
        {this.renderCallBackResult()}
        {this.renderExceptionResult()}
      </View>
    );
  }

  protected addListener?(): void {
    let msgListener = new (class implements ChatMessageEventListener {
      that: ChatManagerLeafScreen;
      constructor(parent: any) {
        this.that = parent as ChatManagerLeafScreen;
      }
      onMessageReactionDidChange(list: Array<ChatMessageReactionEvent>): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onMessageReactionDidChange: `,
          list
        );
      }
      onChatMessageThreadCreated(msgThread: ChatMessageThreadEvent): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onChatMessageThreadCreated: `,
          msgThread
        );
      }
      onChatMessageThreadUpdated(msgThread: ChatMessageThreadEvent): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onChatMessageThreadUpdated: `,
          msgThread
        );
      }
      onChatMessageThreadDestroyed(msgThread: ChatMessageThreadEvent): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onChatMessageThreadDestroyed: `,
          msgThread
        );
      }
      onChatMessageThreadUserRemoved(msgThread: ChatMessageThreadEvent): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onChatMessageThreadUserRemoved: `,
          msgThread
        );
      }
      onMessagesReceived(messages: ChatMessage[]): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onMessagesReceived: `,
          messages
        );
        if (messages.length > 0) {
          ChatManagerCache.getInstance().addRecvMessage(
            messages[messages.length - 1]
          );
        }
      }
      onCmdMessagesReceived(messages: ChatMessage[]): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onCmdMessagesReceived: `,
          messages
        );
        if (messages.length > 0) {
          ChatManagerCache.getInstance().addRecvMessage(
            messages[messages.length - 1]
          );
        }
      }
      onMessagesRead(messages: ChatMessage[]): void {
        console.log(`${ChatManagerLeafScreen.TAG}: onMessagesRead: `, messages);
        this.that.setState({
          recvResult: `onMessagesRead: ${messages.length}: ` + messages,
        });
      }
      onGroupMessageRead(groupMessageAcks: ChatGroupMessageAck[]): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onGroupMessageRead: `,
          groupMessageAcks
        );
        this.that.setState({
          recvResult:
            `onGroupMessageRead: ${groupMessageAcks.length}: ` +
            groupMessageAcks,
        });
      }
      onMessagesDelivered(messages: ChatMessage[]): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onMessagesDelivered: ${messages.length}: `,
          messages,
          messages
        );
        this.that.setState({
          recvResult: `onMessagesDelivered: ${messages.length}: ` + messages,
        });
      }
      onMessagesRecalled(messages: ChatMessage[]): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onMessagesRecalled: `,
          messages
        );
        this.that.setState({
          recvResult: `onMessagesRecalled: ${messages.length}: ` + messages,
        });
      }
      onConversationsUpdate(): void {
        console.log(`${ChatManagerLeafScreen.TAG}: onConversationsUpdate: `);
        this.that.setState({ recvResult: 'onConversationsUpdate' });
      }
      onConversationRead(from: string, to?: string): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onConversationRead: `,
          from,
          to
        );
        this.that.setState({
          recvResult: `onConversationRead: ${from}, ${to}`,
        });
      }
    })(this);

    ChatClient.getInstance().chatManager.removeAllMessageListener();
    ChatClient.getInstance().chatManager.addMessageListener(msgListener);

    const msgCallback = new (class implements ChatMessageStatusCallback {
      that: ChatManagerLeafScreen;
      constructor(parent: ChatManagerLeafScreen) {
        this.that = parent;
      }
      onProgress(localMsgId: string, progress: number): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onProgress: ${localMsgId}, ${progress}`
        );
        this.that.setState({
          cb_result: `onProgress: ${localMsgId}, ${progress}`,
        });
      }
      onError(localMsgId: string, error: ChatError): void {
        console.log(
          `${ChatManagerLeafScreen.TAG}: onError: ${localMsgId}, ${error}`
        );
        this.that.setState({ cb_result: `onError:` + JSON.stringify(error) });
      }
      onSuccess(message: ChatMessage): void {
        console.log(`${ChatManagerLeafScreen.TAG}: onSuccess: ${message}`);
        ChatManagerCache.getInstance().addSendMessage(message);
        this.that.setState({
          cb_result: `onSuccess:` + JSON.stringify(message),
        });
      }
    })(this);

    ChatManagerCache.getInstance().removeAllListener();
    ChatManagerCache.getInstance().addListener(msgCallback);
  }

  protected removeListener?(): void {
    ChatClient.getInstance().chatManager.removeAllMessageListener();
  }

  protected renderCallBackResult(): ReactNode[] {
    const { cb_result } = this.state;
    return [
      <View
        key={this.generateKey('cb_result', 'callback')}
        style={styleValues.containerRow}
      >
        <Text selectable={true} style={styleValues.textTipStyle}>
          cb_result: {cb_result}
        </Text>
      </View>,
    ];
  }

  protected renderApiDom2(): ReactNode[] {
    console.log('test: ', 'renderApiDom');
    const apiList = [
      'resendMessage',
      'sendMessageReadAck',
      'sendGroupMessageReadAck',
      'sendConversationReadAck',
      'recallMessage',
      'getMessage',
      'markAllConversationsAsRead',
      'getUnreadMessageCount',
      'updateMessage',
      'importMessages',
      'downloadAttachment',
      'downloadThumbnail',
      'fetchHistoryMessages',
      'searchMsgFromDB',
      'fetchGroupAcks',
      'deleteRemoteConversation',
      'getConversation',
      'loadAllConversations',
      'getConversationsFromServer',
      'deleteConversation',
      'getLatestMessage',
      'getLastReceivedMessage',
      'unreadCount',
      'markMessageAsRead',
      'markAllMessagesAsRead',
      'insertMessage',
      'appendMessage',
      'updateConversationMessage',
      'deleteMessage',
      'deleteAllMessages',
      'getMessageById',
      'getMessagesWithMsgType',
      'getMessages',
      'getMessagesWithKeyword',
      'getMessagesFromTime',
      'translateMessage',
      'fetchSupportLanguages',
      // 'setConversationExtension',
      'addReaction',
      'removeReaction',
      'fetchReactionList',
      'fetchReactionDetail',
      'reportMessage',
      'getReactionList',
      'groupAckCount',
      'createChatThread',
      'joinChatThread',
      'leaveChatThread',
      'destroyChatThread',
      'updateChatThreadName',
      'removeMemberWithChatThread',
      'fetchMembersWithChatThreadFromServer',
      'fetchJoinedChatThreadFromServer',
      'fetchJoinedChatThreadWithParentFromServer',
      'fetchChatThreadWithParentFromServer',
      'fetchLastMessageWithChatThread',
      'fetchChatThreadFromServer',
      'getMessageThread',
    ];
    let renderDomAry: ({} | null | undefined)[] = [];
    // const data2: any = this.state;
    // apiList.forEach((apiItem) => {
    //   const apiItemObject: any = data2?.[apiItem];
    //   console.log('test: apiItemObject: ', JSON.stringify(apiItemObject));
    //   if (apiItemObject !== undefined) {
    //     console.log('test: ----------------------------');
    //     console.log('test: title: ', apiItem);
    //     console.log('test: entries: ', Object.entries(apiItemObject));
    //     console.log('test: names: ', Object.getOwnPropertyNames(apiItemObject));
    //     console.log('test: keys: ', Object.keys(apiItemObject));
    //     console.log('test: values: ', Object.values(apiItemObject));
    //     console.log('test: ----------------------------');
    //   }
    // });
    const data = this.metaData;
    const stateData: any = this.stateTemp;
    apiList.forEach((apiItem) => {
      this.setKeyPrefix(apiItem);
      renderDomAry.push(
        this.renderParamWithText(data.get(apiItem)!.methodName)
      );
      data.get(apiItem)?.params.forEach((item) => {
        let currentData = data.get(apiItem);
        let itemValue =
          // eslint-disable-next-line no-undef
          this.state[apiItem as keyof typeof this.state][
            item.paramName as keyof typeof currentData
          ];
        const apiItemObject: any = stateData?.[apiItem];
        const itemValue2 = apiItemObject?.[item.paramName];
        // console.log(
        //   'test: itemValue: ',
        //   data.get(apiItem)!.methodName,
        //   itemValue
        // );
        // console.log(
        //   'test: itemValue2: ',
        //   data.get(apiItem)!.methodName,
        //   itemValue2
        // );
        if (item.domType && item.domType === 'select') {
          if (item.paramType === 'boolean') {
            renderDomAry.push(
              this.renderParamWithEnum(
                item.paramName,
                ['true', 'false'],
                itemValue ? 'true' : 'false',
                (index: string, option: any) => {
                  let inputData = option === 'true' ? true : false;
                  let pv: any = {};
                  pv[apiItem] = Object.assign(
                    {},
                    // eslint-disable-next-line no-undef
                    this.state[apiItem as keyof typeof this.state],
                    inputData
                  );
                  return this.setState(pv);
                }
              )
            );
          }
        } else {
          let value =
            item.paramType === 'object'
              ? JSON.stringify(itemValue2)
              : itemValue2;
          if (item.paramValue) {
            value = JSON.stringify({ key: 'value' });
            const v = item.paramValue();
            if (v instanceof ChatMessage) {
              value = JSON.stringify(v);
            }
          }
          // console.log('test: name: ', item.paramName, 'value: ', value);
          renderDomAry.push(
            this.renderGroupParamWithInput(
              item.paramName,
              item.paramType,
              value,
              (inputData: { [index: string]: string }) => {
                let pv: any = {};
                pv[apiItem] = Object.assign(
                  {},
                  // eslint-disable-next-line no-undef
                  this.state[apiItem as keyof typeof this.state],
                  inputData
                );
                console.log('test: pv: ', JSON.stringify(pv));
                this.stateTemp = Object.assign(this.stateTemp, pv);
                console.log('test: stateTemp: ', this.stateTemp);
                this.state = Object.assign(this.state, pv);
                return this.setState(pv, () => {
                  console.log('test: 111111');
                });
              }
            )
          );
        }
      });
      renderDomAry.push(
        this.renderButton(data.get(apiItem)!.methodName, () => {
          this.callApi(data.get(apiItem)!.methodName);
        })
      );
      renderDomAry.push(this.renderDivider());
    });
    renderDomAry.push(this.addSpaces());
    return renderDomAry;
  }

  protected renderBody(): ReactNode {
    console.log(`${ChatManagerLeafScreen.TAG}: renderBody: `);
    return (
      <View style={styleValues.containerColumn}>{this.renderApiDom()}</View>
    );
  }
  protected renderApiDom(): ReactNode[] {
    const apiList = [
      'resendMessage',
      'sendMessageReadAck',
      'sendGroupMessageReadAck',
      'sendConversationReadAck',
      'recallMessage',
      'getMessage',
      'markAllConversationsAsRead',
      'getUnreadMessageCount',
      'updateMessage',
      'importMessages',
      'downloadAttachment',
      'downloadThumbnail',
      'fetchHistoryMessages',
      'searchMsgFromDB',
      'fetchGroupAcks',
      'deleteRemoteConversation',
      'getConversation',
      'loadAllConversations',
      'getConversationsFromServer',
      'deleteConversation',
      'getLatestMessage',
      'getLastReceivedMessage',
      'unreadCount',
      'markMessageAsRead',
      'markAllMessagesAsRead',
      'insertMessage',
      'appendMessage',
      'updateConversationMessage',
      'deleteMessage',
      'deleteAllMessages',
      'getMessageById',
      'getMessagesWithMsgType',
      'getMessages',
      'getMessagesWithKeyword',
      'getMessagesFromTime',
      'translateMessage',
      'fetchSupportLanguages',
      // 'setConversationExtension',
      'addReaction',
      'removeReaction',
      'fetchReactionList',
      'fetchReactionDetail',
      'reportMessage',
      'getReactionList',
      'groupAckCount',
      'createChatThread',
      'joinChatThread',
      'leaveChatThread',
      'destroyChatThread',
      'updateChatThreadName',
      'removeMemberWithChatThread',
      'fetchMembersWithChatThreadFromServer',
      'fetchJoinedChatThreadFromServer',
      'fetchJoinedChatThreadWithParentFromServer',
      'fetchChatThreadWithParentFromServer',
      'fetchLastMessageWithChatThread',
      'fetchChatThreadFromServer',
      'getMessageThread',
    ];
    let renderDomAry: ({} | null | undefined)[] = [];
    const data = this.metaData;
    apiList.forEach((apiItem) => {
      this.setKeyPrefix(apiItem);
      console.log('test: apiItem: ', apiItem);
      renderDomAry.push(
        this.renderParamWithText(data.get(apiItem)!.methodName)
      );
      data.get(apiItem)?.params.forEach((item) => {
        let currentData = data.get(apiItem);
        let itemValue =
          // eslint-disable-next-line no-undef
          this.state[apiItem as keyof typeof this.state][
            item.paramName as keyof typeof currentData
          ];
        if (item.domType && item.domType === 'select') {
          if (item.paramType === 'boolean') {
            renderDomAry.push(
              this.renderParamWithEnum(
                item.paramName,
                ['true', 'false'],
                itemValue ? 'true' : 'false',
                (index: string, option: any) => {
                  let inputData = option === 'true' ? true : false;
                  let pv: any = {};
                  pv[apiItem] = Object.assign(
                    {},
                    // eslint-disable-next-line no-undef
                    this.state[apiItem as keyof typeof this.state],
                    inputData
                  );
                  return this.setState(pv);
                }
              )
            );
          }
        } else {
          let value =
            item.paramType === 'object' ? JSON.stringify(itemValue) : itemValue;
          if (item.paramValue) {
            value = JSON.stringify({ key: 'value' });
            const v = item.paramValue();
            if (v instanceof ChatMessage) {
              value = JSON.stringify(v);
            }
          }
          console.log(
            'test: method: ',
            data.get(apiItem)!.methodName,
            'name: ',
            item.paramName,
            'value: ',
            value
          );
          renderDomAry.push(
            this.renderGroupParamWithInput(
              item.paramName,
              item.paramType,
              value,
              (inputData: { [index: string]: string }) => {
                let pv: any = {};
                pv[apiItem] = Object.assign(
                  {},
                  // eslint-disable-next-line no-undef
                  this.state[apiItem as keyof typeof this.state],
                  inputData
                );
                return this.setState(pv);
              }
            )
          );
        }
      });
      renderDomAry.push(
        this.renderButton(data.get(apiItem)!.methodName, () => {
          this.callApi(data.get(apiItem)!.methodName);
        })
      );
      renderDomAry.push(this.renderDivider());
    });
    renderDomAry.push(this.addSpaces());
    return renderDomAry;
  }

  private callApi(name: string): void {
    console.log(`${ChatManagerLeafScreen.TAG}: callApi: `);
    if (name === MN.resendMessage) {
      const message = ChatManagerCache.getInstance().getLastSendMessage();
      if (message) {
        this.tryCatch(
          ChatClient.getInstance().chatManager.resendMessage(
            message,
            ChatManagerCache.getInstance().createCallback()
          ),
          ChatManagerLeafScreen.TAG,
          this.metaData.get(MN.resendMessage)!.methodName
        );
      }
    } else if (name === MN.sendMessageReadAck) {
      const lastMessage = ChatManagerCache.getInstance().getLastRecvMessage();
      if (lastMessage) {
        this.tryCatch(
          ChatClient.getInstance().chatManager.sendMessageReadAck(lastMessage),
          ChatManagerLeafScreen.TAG,
          this.metaData.get(MN.sendMessageReadAck)!.methodName
        );
      }
    } else if (name === MN.sendGroupMessageReadAck) {
      const { msgId, groupId, opt } = this.state.sendGroupMessageReadAck;
      this.tryCatch(
        ChatClient.getInstance().chatManager.sendGroupMessageReadAck(
          msgId,
          groupId,
          opt
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.sendGroupMessageReadAck)!.methodName
      );
    } else if (name === MN.sendConversationReadAck) {
      const { convId } = this.state.sendConversationReadAck;
      this.tryCatch(
        ChatClient.getInstance().chatManager.sendConversationReadAck(convId),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.sendConversationReadAck)!.methodName
      );
    } else if (name === MN.recallMessage) {
      const { msgId } = this.state.recallMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.recallMessage(msgId),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.recallMessage)!.methodName
      );
    } else if (name === MN.getMessage) {
      const { msgId } = this.state.getMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getMessage(msgId),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getMessage)!.methodName
      );
    } else if (name === MN.markAllConversationsAsRead) {
      this.tryCatch(
        ChatClient.getInstance().chatManager.markAllConversationsAsRead(),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.markAllConversationsAsRead)!.methodName
      );
    } else if (name === MN.getUnreadMessageCount) {
      this.tryCatch(
        ChatClient.getInstance().chatManager.getUnreadMessageCount(),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getUnreadMessageCount)!.methodName
      );
    } else if (name === MN.updateMessage) {
      const { message } = this.state.updateMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.updateMessage(message),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.updateMessage)!.methodName
      );
    } else if (name === MN.importMessages) {
      const { message } = this.state.importMessages;
      this.tryCatch(
        ChatClient.getInstance().chatManager.importMessages([message]),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.importMessages)!.methodName
      );
    } else if (name === MN.downloadAttachment) {
      const { message, callback } = this.state.downloadAttachment;
      this.tryCatch(
        ChatClient.getInstance().chatManager.downloadAttachment(
          message,
          callback
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.downloadAttachment)!.methodName
      );
    } else if (name === MN.downloadThumbnail) {
      const { message, callback } = this.state.downloadThumbnail;
      this.tryCatch(
        ChatClient.getInstance().chatManager.downloadThumbnail(
          message,
          callback
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.downloadThumbnail)!.methodName
      );
    } else if (name === MN.fetchHistoryMessages) {
      const { convId, chatType, pageSize, startMsgId } =
        this.state.fetchHistoryMessages;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchHistoryMessages(
          convId,
          ChatConversationTypeFromNumber(chatType),
          pageSize,
          startMsgId
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.fetchHistoryMessages)!.methodName
      );
    } else if (name === MN.searchMsgFromDB) {
      const { keywords, timestamp, maxCount, from, direction } =
        this.state.searchMsgFromDB;
      this.tryCatch(
        ChatClient.getInstance().chatManager.searchMsgFromDB(
          keywords,
          timestamp,
          maxCount,
          from,
          direction
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.searchMsgFromDB)!.methodName
      );
    } else if (name === MN.fetchGroupAcks) {
      const { msgId, startAckId, pageSize, groupId } =
        this.state.fetchGroupAcks;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchGroupAcks(
          msgId,
          groupId,
          startAckId,
          pageSize
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.fetchGroupAcks)!.methodName
      );
    } else if (name === MN.deleteRemoteConversation) {
      const { convId, convType, isDeleteMessage } =
        this.state.deleteRemoteConversation;
      this.tryCatch(
        ChatClient.getInstance().chatManager.deleteRemoteConversation(
          convId,
          convType,
          isDeleteMessage
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.deleteRemoteConversation)!.methodName
      );
    } else if (name === MN.getConversation) {
      const { convId, convType, createIfNeed } = this.state.getConversation;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getConversation(
          convId,
          convType,
          createIfNeed
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getConversation)!.methodName
      );
    } else if (name === MN.loadAllConversations) {
      this.tryCatch(
        ChatClient.getInstance().chatManager.loadAllConversations(),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.loadAllConversations)!.methodName
      );
    } else if (name === MN.getConversationsFromServer) {
      this.tryCatch(
        ChatClient.getInstance().chatManager.getConversationsFromServer(),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getConversationsFromServer)!.methodName
      );
    } else if (name === MN.deleteConversation) {
      const { convId, withMessage } = this.state.deleteConversation;
      this.tryCatch(
        ChatClient.getInstance().chatManager.deleteConversation(
          convId,
          withMessage
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.deleteConversation)!.methodName
      );
    } else if (name === MN.getLatestMessage) {
      const { convId, convType } = this.state.getLatestMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchLatestMessage(
          convId,
          ChatConversationTypeFromNumber(convType)
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getLatestMessage)!.methodName
      );
    } else if (name === MN.getLastReceivedMessage) {
      const { convId, convType } = this.state.getLastReceivedMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchLastReceivedMessage(
          convId,
          ChatConversationTypeFromNumber(convType)
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getLastReceivedMessage)!.methodName
      );
    } else if (name === MN.unreadCount) {
      const { convId, convType } = this.state.unreadCount;
      this.tryCatch(
        ChatClient.getInstance().chatManager.unreadCount(
          convId,
          ChatConversationTypeFromNumber(convType)
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.unreadCount)!.methodName
      );
    } else if (name === MN.markMessageAsRead) {
      const { convId, convType, msgId } = this.state.markMessageAsRead;
      this.tryCatch(
        ChatClient.getInstance().chatManager.markMessageAsRead(
          convId,
          ChatConversationTypeFromNumber(convType),
          msgId
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.markMessageAsRead)!.methodName
      );
    } else if (name === MN.markAllMessagesAsRead) {
      const { convId, convType } = this.state.markAllMessagesAsRead;
      this.tryCatch(
        ChatClient.getInstance().chatManager.markAllMessagesAsRead(
          convId,
          ChatConversationTypeFromNumber(convType)
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.markAllMessagesAsRead)!.methodName
      );
    } else if (name === MN.insertMessage) {
      const { convId, convType, msg } = this.state.insertMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.insertMessage(
          convId,
          ChatConversationTypeFromNumber(convType),
          msg
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.insertMessage)!.methodName
      );
    } else if (name === MN.appendMessage) {
      const { convId, convType, msg } = this.state.appendMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.appendMessage(
          convId,
          ChatConversationTypeFromNumber(convType),
          msg
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.appendMessage)!.methodName
      );
    } else if (name === MN.updateConversationMessage) {
      const { convId, convType, msg } = this.state.updateConversationMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.updateConversationMessage(
          convId,
          ChatConversationTypeFromNumber(convType),
          msg
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.updateConversationMessage)!.methodName
      );
    } else if (name === MN.deleteMessage) {
      const { convId, convType, msgId } = this.state.deleteMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.deleteMessage(
          convId,
          ChatConversationTypeFromNumber(convType),
          msgId
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.deleteMessage)!.methodName
      );
    } else if (name === MN.deleteAllMessages) {
      const { convId, convType } = this.state.deleteAllMessages;
      this.tryCatch(
        ChatClient.getInstance().chatManager.deleteAllMessages(
          convId,
          ChatConversationTypeFromNumber(convType)
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.deleteAllMessages)!.methodName
      );
    } else if (name === MN.getMessageById) {
      const { convId, convType, msgId } = this.state.getMessageById;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getMessageById(
          convId,
          ChatConversationTypeFromNumber(convType),
          msgId
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getMessageById)!.methodName
      );
    } else if (name === MN.getMessagesWithMsgType) {
      const { convId, convType, msgType, direction, timestamp, count, sender } =
        this.state.getMessagesWithMsgType;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getMessagesWithMsgType(
          convId,
          ChatConversationTypeFromNumber(convType),
          ChatMessageTypeFromString(msgType),
          direction,
          timestamp,
          count,
          sender
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getMessagesWithMsgType)!.methodName
      );
    } else if (name === MN.getMessages) {
      const { convId, convType, startMsgId, direction, loadCount } =
        this.state.getMessages;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getMessages(
          convId,
          ChatConversationTypeFromNumber(convType),
          startMsgId,
          direction,
          loadCount
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getMessages)!.methodName
      );
    } else if (name === MN.getMessagesWithKeyword) {
      const {
        convId,
        convType,
        keywords,
        direction,
        timestamp,
        count,
        sender,
      } = this.state.getMessagesWithKeyword;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getMessagesWithKeyword(
          convId,
          ChatConversationTypeFromNumber(convType),
          keywords,
          direction,
          timestamp,
          count,
          sender
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getMessagesWithKeyword)!.methodName
      );
    } else if (name === MN.getMessagesFromTime) {
      const { convId, convType, startTime, endTime, direction, count } =
        this.state.getMessagesFromTime;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getMessagesFromTime(
          convId,
          ChatConversationTypeFromNumber(convType),
          startTime,
          endTime,
          direction,
          count
        ),
        ChatManagerLeafScreen.TAG,
        this.metaData.get(MN.getMessagesFromTime)!.methodName
      );
    } else if (name === MN.translateMessage) {
      const { msg, languages } = this.state.translateMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.translateMessage(msg, languages),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchSupportLanguages) {
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchSupportedLanguages(),
        ChatManagerLeafScreen.TAG,
        name
      );
      // } else if (name === MN.setConversationExtension) {
      //   const { convId, convType, ext } = this.state.setConversationExtension;
      //   this.tryCatch(
      //     ChatClient.getInstance().chatManager.setConversationExtension(
      //       convId,
      //       ChatConversationTypeFromNumber(convType),
      //       ext
      //     ),
      //     ChatManagerLeafScreen.TAG,
      //     name
      //   );
    } else if (name === MN.addReaction) {
      const { reaction, msgId } = this.state.addReaction;
      this.tryCatch(
        ChatClient.getInstance().chatManager.addReaction(reaction, msgId),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.removeReaction) {
      const { reaction, msgId } = this.state.removeReaction;
      this.tryCatch(
        ChatClient.getInstance().chatManager.removeReaction(reaction, msgId),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchReactionList) {
      const { msgIds, groupId, chatType } = this.state.fetchReactionList;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchReactionList(
          msgIds,
          groupId,
          ChatMessageChatTypeFromNumber(chatType)
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchReactionDetail) {
      const { msgId, reaction, cursor, pageSize } =
        this.state.fetchReactionDetail;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchReactionDetail(
          msgId,
          reaction,
          cursor,
          pageSize
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.reportMessage) {
      const { msgId, tag, reason } = this.state.reportMessage;
      this.tryCatch(
        ChatClient.getInstance().chatManager.reportMessage(msgId, tag, reason),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.getReactionList) {
      const { msgId } = this.state.getReactionList;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getReactionList(msgId),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.groupAckCount) {
      const { msgId } = this.state.groupAckCount;
      this.tryCatch(
        ChatClient.getInstance().chatManager.groupAckCount(msgId),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.createChatThread) {
      const { threadName, msgId, parentId } = this.state.createChatThread;
      this.tryCatch(
        ChatClient.getInstance().chatManager.createChatThread(
          threadName,
          msgId,
          parentId
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.joinChatThread) {
      const { chatThreadId } = this.state.joinChatThread;
      this.tryCatch(
        ChatClient.getInstance().chatManager.joinChatThread(chatThreadId),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.leaveChatThread) {
      const { chatThreadId } = this.state.leaveChatThread;
      this.tryCatch(
        ChatClient.getInstance().chatManager.leaveChatThread(chatThreadId),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.destroyChatThread) {
      const { chatThreadId } = this.state.destroyChatThread;
      this.tryCatch(
        ChatClient.getInstance().chatManager.destroyChatThread(chatThreadId),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.updateChatThreadName) {
      const { chatThreadId, newName } = this.state.updateChatThreadName;
      this.tryCatch(
        ChatClient.getInstance().chatManager.updateChatThreadName(
          chatThreadId,
          newName
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.removeMemberWithChatThread) {
      const { chatThreadId, memberId } = this.state.removeMemberWithChatThread;
      this.tryCatch(
        ChatClient.getInstance().chatManager.removeMemberWithChatThread(
          chatThreadId,
          memberId
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchMembersWithChatThreadFromServer) {
      const { chatThreadId, cursor, pageSize } =
        this.state.fetchMembersWithChatThreadFromServer;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchMembersWithChatThreadFromServer(
          chatThreadId,
          cursor,
          pageSize
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchJoinedChatThreadFromServer) {
      const { cursor, pageSize } = this.state.fetchJoinedChatThreadFromServer;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchJoinedChatThreadFromServer(
          cursor,
          pageSize
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchJoinedChatThreadWithParentFromServer) {
      const { parentId, cursor, pageSize } =
        this.state.fetchJoinedChatThreadWithParentFromServer;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchJoinedChatThreadWithParentFromServer(
          parentId,
          cursor,
          pageSize
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchChatThreadWithParentFromServer) {
      const { parentId, cursor, pageSize } =
        this.state.fetchChatThreadWithParentFromServer;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchChatThreadWithParentFromServer(
          parentId,
          cursor,
          pageSize
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchLastMessageWithChatThread) {
      const { chatThreadIds } = this.state.fetchLastMessageWithChatThread;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchLastMessageWithChatThread(
          chatThreadIds
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.fetchChatThreadFromServer) {
      const { chatThreadId } = this.state.fetchChatThreadFromServer;
      this.tryCatch(
        ChatClient.getInstance().chatManager.fetchChatThreadFromServer(
          chatThreadId
        ),
        ChatManagerLeafScreen.TAG,
        name
      );
    } else if (name === MN.getMessageThread) {
      const { msgId } = this.state.getMessageThread;
      this.tryCatch(
        ChatClient.getInstance().chatManager.getMessageThread(msgId),
        ChatManagerLeafScreen.TAG,
        name
      );
    }
  }
}
