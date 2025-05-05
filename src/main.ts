import { Plugin, PluginSettingTab, Setting, TFile } from "obsidian";

interface HxToWikiLinkSettings {
  mode: "replace" | "duplicate";
}

const DEFAULT_SETTINGS: HxToWikiLinkSettings = {
  mode: "replace",
};

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

    new Setting(containerEl)
      .setName("Conversion Mode")
      .setDesc(
        "Choose wether to replace the heading or duplicate it with a WikiLink.",
      )
      .addDropdown((dropdown) =>
        dropdown
          .addOption("replace", "Replace heading with WikiLink")
          .addOption("duplicate", "Insert WikiLink below heading")
          .setValue(this.plugin.settings.mode)
          .onChange(async (value: string) => {
            if (value === "replace" || value === "duplicate") {
              this.plugin.settings.mode = value;
              await this.plugin.saveSettings();
            }
          })
      );
  }
}

export default class HxToWikiLinkPlugin extends Plugin {
  settings!: HxToWikiLinkSettings;

  override async onload() {
    await this.loadSettings();

    this.addSettingTab(new HxToWikiLinkSettingsTab(this.app, this));

    for (let i = 1; i <= 6; i++) {
      this.addHxCommand(
        `convert-h${i}-to-wikilink`,
        `Convert only H${i} to WikiLink`,
        i,
      );
    }

    this.addHxCommand(
      "convert-all-hx-to-wikilink",
      "Convert all Hx to WikiLink",
      0,
    );
  }

  addHxCommand(id: string, name: string, level: Number) {
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
