export interface AIModelDto {
    id: number;
    modelId: string;
    displayName: string;
    description: string | null;
    isFree: boolean;
    pricePerMToken: number;
    createdAt: Date;
    canRecognizeImages: boolean;
    maxContextLength: number;
}