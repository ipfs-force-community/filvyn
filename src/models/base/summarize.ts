import { SummarizeModel, ModelConfig, ChatMessage } from '../../types/model.js';

export abstract class BaseSummarizeModel implements SummarizeModel {
    protected config: ModelConfig;

    constructor(config: ModelConfig) {
        this.config = config;
    }

    abstract summarize(messages: ChatMessage[]): Promise<string>;
}
