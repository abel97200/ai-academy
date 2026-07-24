export type ModelRequest = {
  systemInstruction: string;
  userInput: string;
};

export interface ResourceModel {
  generate(request: ModelRequest): Promise<unknown>;
}
