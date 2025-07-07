import { EmbeddingModel, ModelConfig } from '../../types/model.js';

export abstract class BaseEmbeddingModel implements EmbeddingModel {
    protected config: ModelConfig;

    constructor(config: ModelConfig) {
        this.config = config;
    }

    abstract createEmbedding(text: string): Promise<number[]>;
}
