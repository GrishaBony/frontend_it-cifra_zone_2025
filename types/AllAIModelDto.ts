export interface AllAIModelDto {
  modelId: string;
  displayName: string;
  description: string;
  modality: string;
  canRecognizeImages: boolean;
  maxContextLength: number;
};