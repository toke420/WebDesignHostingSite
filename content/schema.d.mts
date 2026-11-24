export type TrackingScript = { src: string } & Record<string, string>;
export function parseTrackingScripts(snippet: string): TrackingScript[];
