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
    await this.loadSettngs();

    this.addSettingTab(new HxToWikiLinkSettingsTab(this.app, this));

    this.addCommand({
      id: "convert-h1-to-wikilink",
      name: "Convert H1 to WikiLink",
      callback: async () => {
        const file: TFile | null = this.app.workspace.getActiveFile();
        if (!file) return;

        let text = await this.app.vault.read(file);
        const lines = text.split("\n");

        const modifiedLines = lines.flatMap((line) => {
          const match = line.match(/^(#{1,6}) (.+)$/);
          if (match) {
            const heading = match[2];
            if (this.settings.mode == "replace") {
              return [`[[${heading}]]`];
            } else {
              return [line, `[[${heading}]]`];
            }
          } else {
            return [line];
          }
        });

        await this.app.vault.modify(file, modifiedLines.join("\n"));
      },
    });
  }

  async loadSettngs() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
