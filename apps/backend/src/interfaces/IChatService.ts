/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// Interface for chat services - Dependency Inversion
export interface IChatService {
  sendMessage(content: string): Promise<string>;
  checkHealth(): Promise<boolean>;
}

export interface IContextGenerator {
  generateAcademicContext(data: unknown[]): string;
}
