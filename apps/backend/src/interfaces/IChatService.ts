// Interface for chat services - Dependency Inversion
export interface IChatService {
  sendMessage(content: string, context?: string): Promise<string>;
  checkHealth(): Promise<boolean>;
}

export interface IContextGenerator {
  generateAcademicContext(data: unknown[]): string;
}
