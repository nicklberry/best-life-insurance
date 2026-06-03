declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function pushDataLayerEvent(eventName: string, eventData: Record<string, unknown> = {}): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...eventData });
}
