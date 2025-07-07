import { ChatMessage, ChatModel, ModelConfig } from '../../types/model.js';

export abstract class BaseChatModel implements ChatModel {
    protected config: ModelConfig;

    constructor(config: ModelConfig) {
        this.config = config;
    }

    abstract chat(messages: ChatMessage[]): Promise<string>;
}
