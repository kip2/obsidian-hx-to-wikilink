import { PluginSettingTab, Setting } from "obsidian";
import type HxToWikiLinkPlugin from "./main.ts";
import { HxToggleKey } from "./settings.ts";

export class HxToWikiLinkSettingsTab extends PluginSettingTab {
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
