import { Plugin, TFile } from "obsidian";
import {
  DEFAULT_SETTINGS,
  HxToggleKey,
  HxToWikiLinkSettings,
} from "./settings.ts";
import { HxToWikiLinkSettingsTab } from "./settings-tab.ts";

export default class HxToWikiLinkPlugin extends Plugin {
  settings!: HxToWikiLinkSettings;

  registerdCommandIds: string[] = [];

  override async onload() {
    await this.loadSettings();

    this.addSettingTab(new HxToWikiLinkSettingsTab(this.app, this));

    // all Hx tag.
    if (this.settings.enableAll) {
      this.addHxCommand(
        "convert-all-hx-to-wikilink",
        "Convert all Hx to WikiLink",
        0,
      );
    }

    // h1 ~ h6 tag.
    for (let level = 1; level <= 6; level++) {
      const key = `enableH${level}` as HxToggleKey;

      if (this.settings[key]) {
        this.addHxCommand(
          `convert-h${level}-to-wikilink`,
          `Convert only H${level} to WikiLink`,
          level,
        );
      }
    }
  }

  addHxCommand(id: string, name: string, level: Number) {
    this.registerdCommandIds.push(id);

    this.addCommand({
      id,
      name,
      callback: async () => {
        const file: TFile | null = this.app.workspace.getActiveFile();
        if (!file) return;

        const text = await this.app.vault.read(file);
        const lines = text.split("\n");

        const modifiedLines = lines.flatMap((line) => {
          const match = line.match(/^(#{1,6}) (.+)$/);
          if (match) {
            const hashes = match[1];
            const heading = match[2];

            if (level === 0 || hashes.length === level) {
              if (this.settings.mode === "replace") {
                return [`[[${heading}]]`];
              } else {
                return [line, `[[${heading}]]`];
              }
            }
          }
          return [line];
        });

        await this.app.vault.modify(file, modifiedLines.join("\n"));
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
