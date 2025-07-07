import { ModelType, ModelConfig, ChatModel, SummarizeModel, EmbeddingModel } from '../types/model.js';
import { OpenAIChatModel } from './openai/chat.js';
import { OpenAISummarizeModel } from './openai/summarize.js';
import { OpenAIEmbeddingModel } from './openai/embedding.js';
import { SecretAIChatModel } from './secretai/chat.js';

export class ModelFactory {
    static createChatModel(type: ModelType, config: ModelConfig): ChatModel {
        switch (type) {
            case 'openai':
                return new OpenAIChatModel(config);
            case 'secretai':
                return new SecretAIChatModel(config);
            case 'anthropic':
            case 'google':
                throw new Error(`Model type ${type} not implemented yet`);
            default:
                throw new Error(`Unsupported model type: ${type}`);
        }
    }

    static createSummarizeModel(type: ModelType, config: ModelConfig): SummarizeModel {
        switch (type) {
            case 'openai':
                return new OpenAISummarizeModel(config);
            case 'secretai':
                throw new Error(`Model type ${type} not implemented yet`);
            case 'anthropic':
            case 'google':
                throw new Error(`Model type ${type} not implemented yet`);
            default:
                throw new Error(`Unsupported model type: ${type}`);
        }
    }

    static createEmbeddingModel(type: ModelType, config: ModelConfig): EmbeddingModel {
        switch (type) {
            case 'openai':
                return new OpenAIEmbeddingModel(config);
            case 'secretai':
                throw new Error(`Model type ${type} not implemented yet`);
            case 'anthropic':
            case 'google':
                throw new Error(`Model type ${type} not implemented yet`);
            default:
                throw new Error(`Unsupported model type: ${type}`);
        }
    }
}
