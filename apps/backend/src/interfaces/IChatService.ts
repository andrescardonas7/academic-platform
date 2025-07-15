// Interface for chat services - Dependency Inversion
export interface IChatService {
  sendMessage(message: string, context?: string): Promise<string>;
  checkHealth(): Promise<boolean>;
}

export interface IContextGenerator {
  generateAcademicContext(data: any[]): string;
}
