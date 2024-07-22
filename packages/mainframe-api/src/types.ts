import { supportedConnectProviders } from "@mainframe-api/server";

export interface HostConfig {
  apiUrl?: string;
  rootUrl?: string;
}

export interface MainframeClientConfig extends HostConfig {
  appId: string;
}

export type ProviderName = (typeof supportedConnectProviders)[number];