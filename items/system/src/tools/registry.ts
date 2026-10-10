// The shape of Rein's own tool definitions, which system/tools.ts and env/stack.ts build; index.ts
// hands them to Rein through the extension API.
export type ToolDef = {
  name: string;
  label: string;
  description: string;
  describe?(): string;
  inputSchema: Record<string, unknown>;
  mutating: boolean;
  enabled?(): boolean;
  summarize(args: any): string;
  run(ctx: {root: string}, args: any): Promise<{ok: boolean; text: string}>;
};
