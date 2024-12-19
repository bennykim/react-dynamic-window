export type ListItem = {
  title: string;
  author: string;
  description: string;
  content: string;
  imageUrl?: string;
};

export type MockGeneratorConfig = {
  batchSize: number;
  maxGenerationCount: number;
  intervalMs: number;
};
