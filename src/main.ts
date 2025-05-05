import { Plugin, PluginSettingTab, Setting, TFile } from "obsidian";

interface HxToWikiLinkSettings {
  mode: "replace" | "duplicate";
  enableAll: boolean;
  enableH1: boolean;
  enableH2: boolean;
  enableH3: boolean;
  enableH4: boolean;
  enableH5: boolean;
  enableH6: boolean;
}

const DEFAULT_SETTINGS: HxToWikiLinkSettings = {
  mode: "replace",
  enableAll: true,
  enableH1: true,
  enableH2: true,
  enableH3: true,
  enableH4: true,
  enableH5: true,
  enableH6: true,
};

type HxToggleKey =
  | "enableH1"
  | "enableH2"
  | "enableH3"
  | "enableH4"
  | "enableH5"
  | "enableH6";

class HxToWikiLinkSettingsTab extends PluginSettingTab {
  plugin: HxToWikiLinkPlugin;

  constructor(app: any, plugin: HxToWikiLinkPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  override display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Hx to WikiLink - Settings" });
    containerEl.createEl("h2", { text: "Duplicate WikiLink" });

    new Setting(containerEl)
      .setName("Duplicate WikiLink")
      .setDesc(
        "Insert WikiLink below heading instead of replacing it.",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.mode === "duplicate")
          .onChange(async (value: boolean) => {
            this.plugin.settings.mode = value ? "duplicate" : "replace";
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h2", { text: "Enabled Comamnds" });

    new Setting(containerEl)
      .setName("Enable All Hx command")
      .setDesc(
        "Register a command to convert all heading levels (H1-H6).",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableAll)
          .onChange(async (value: boolean) => {
            this.plugin.settings.enableAll = value;
            await this.plugin.saveSettings();

            const id = "convert-all-hx-to-wikilink";
            if (value) {
              this.plugin.addHxCommand(id, "Convert all Hx to WikiLink", 0);
            } else {
              this.plugin.removeCommand(id);
            }
          })
      );

    for (let level = 1; level <= 6; level++) {
      const key = `enableH${level}` as HxToggleKey;
      const id = `convert-h${level}-to-wikilink`;

      new Setting(containerEl)
        .setName(`Enable H${level} command`)
        .setDesc(`Register a command for converting H${level} headings.`)
        .addToggle((toggle) =>
          toggle
            .setValue(this.plugin.settings[key] as boolean)
            .onChange(async (value: boolean) => {
              this.plugin.settings[key] = value;
              await this.plugin.saveSettings();

              if (value) {
                this.plugin.addHxCommand(
                  id,
                  `Convert only H${level} to WikiLink`,
                  level,
                );
              } else {
                this.plugin.removeCommand(id);
              }
            })
        );
    }
  }
}

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
