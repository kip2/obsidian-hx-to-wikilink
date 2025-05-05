export type HxMode = "replace" | "duplicate";

export interface HxToWikiLinkSettings {
  mode: HxMode;
  enableAll: boolean;
  enableH1: boolean;
  enableH2: boolean;
  enableH3: boolean;
  enableH4: boolean;
  enableH5: boolean;
  enableH6: boolean;
}

export const DEFAULT_SETTINGS: HxToWikiLinkSettings = {
  mode: "replace",
  enableAll: true,
  enableH1: true,
  enableH2: true,
  enableH3: true,
  enableH4: true,
  enableH5: true,
  enableH6: true,
};

export type HxToggleKey =
  | "enableH1"
  | "enableH2"
  | "enableH3"
  | "enableH4"
  | "enableH5"
  | "enableH6";
