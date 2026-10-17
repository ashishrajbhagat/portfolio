export interface Options {
  production?: boolean;
  /** Origins the site may embed in an iframe. */
  frameSources?: string[];
}
export function contentSecurityPolicy(options?: Options): string;
export function securityHeaders(options?: Options): Array<{ key: string; value: string }>;
export function headerRules(options?: Options): Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
