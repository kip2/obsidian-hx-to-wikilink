var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => HxToWikiLinkPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/settings.ts
var DEFAULT_SETTINGS = {
  mode: "replace",
  enableAll: true,
  enableH1: true,
  enableH2: true,
  enableH3: true,
  enableH4: true,
  enableH5: true,
  enableH6: true
};

// src/settings-tab.ts
var import_obsidian = require("obsidian");
var HxToWikiLinkSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    __publicField(this, "plugin");
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Hx to WikiLink - Settings" });
    containerEl.createEl("h2", { text: "Duplicate WikiLink" });
    new import_obsidian.Setting(containerEl).setName("Duplicate WikiLink").setDesc(
      "Insert WikiLink below heading instead of replacing it."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.mode === "duplicate").onChange((value) => __async(this, null, function* () {
        this.plugin.settings.mode = value ? "duplicate" : "replace";
        yield this.plugin.saveSettings();
      }))
    );
    containerEl.createEl("h2", { text: "Enabled Comamnds" });
    new import_obsidian.Setting(containerEl).setName("Enable All Hx command").setDesc(
      "Register a command to convert all heading levels (H1-H6)."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableAll).onChange((value) => __async(this, null, function* () {
        this.plugin.settings.enableAll = value;
        yield this.plugin.saveSettings();
        const id = "convert-all-hx-to-wikilink";
        if (value) {
          this.plugin.addHxCommand(id, "Convert all Hx to WikiLink", 0);
        } else {
          this.plugin.removeCommand(id);
        }
      }))
    );
    for (let level = 1; level <= 6; level++) {
      const key = `enableH${level}`;
      const id = `convert-h${level}-to-wikilink`;
      new import_obsidian.Setting(containerEl).setName(`Enable H${level} command`).setDesc(`Register a command for converting H${level} headings.`).addToggle(
        (toggle) => toggle.setValue(this.plugin.settings[key]).onChange((value) => __async(this, null, function* () {
          this.plugin.settings[key] = value;
          yield this.plugin.saveSettings();
          if (value) {
            this.plugin.addHxCommand(
              id,
              `Convert only H${level} to WikiLink`,
              level
            );
          } else {
            this.plugin.removeCommand(id);
          }
        }))
      );
    }
  }
};

// src/main.ts
var HxToWikiLinkPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings");
    __publicField(this, "registerdCommandIds", []);
  }
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addSettingTab(new HxToWikiLinkSettingsTab(this.app, this));
      if (this.settings.enableAll) {
        this.addHxCommand(
          "convert-all-hx-to-wikilink",
          "Convert all Hx to WikiLink",
          0
        );
      }
      for (let level = 1; level <= 6; level++) {
        const key = `enableH${level}`;
        if (this.settings[key]) {
          this.addHxCommand(
            `convert-h${level}-to-wikilink`,
            `Convert only H${level} to WikiLink`,
            level
          );
        }
      }
    });
  }
  addHxCommand(id, name, level) {
    this.registerdCommandIds.push(id);
    this.addCommand({
      id,
      name,
      callback: () => __async(this, null, function* () {
        const file = this.app.workspace.getActiveFile();
        if (!file) return;
        const text = yield this.app.vault.read(file);
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
        yield this.app.vault.modify(file, modifiedLines.join("\n"));
      })
    });
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3NldHRpbmdzLnRzIiwgInNyYy9zZXR0aW5ncy10YWIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFBsdWdpbiwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7XG4gIERFRkFVTFRfU0VUVElOR1MsXG4gIEh4VG9nZ2xlS2V5LFxuICBIeFRvV2lraUxpbmtTZXR0aW5ncyxcbn0gZnJvbSBcIi4vc2V0dGluZ3MudHNcIjtcbmltcG9ydCB7IEh4VG9XaWtpTGlua1NldHRpbmdzVGFiIH0gZnJvbSBcIi4vc2V0dGluZ3MtdGFiLnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh4VG9XaWtpTGlua1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzITogSHhUb1dpa2lMaW5rU2V0dGluZ3M7XG5cbiAgcmVnaXN0ZXJkQ29tbWFuZElkczogc3RyaW5nW10gPSBbXTtcblxuICBvdmVycmlkZSBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcblxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgSHhUb1dpa2lMaW5rU2V0dGluZ3NUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgIC8vIGFsbCBIeCB0YWcuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZW5hYmxlQWxsKSB7XG4gICAgICB0aGlzLmFkZEh4Q29tbWFuZChcbiAgICAgICAgXCJjb252ZXJ0LWFsbC1oeC10by13aWtpbGlua1wiLFxuICAgICAgICBcIkNvbnZlcnQgYWxsIEh4IHRvIFdpa2lMaW5rXCIsXG4gICAgICAgIDAsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGgxIH4gaDYgdGFnLlxuICAgIGZvciAobGV0IGxldmVsID0gMTsgbGV2ZWwgPD0gNjsgbGV2ZWwrKykge1xuICAgICAgY29uc3Qga2V5ID0gYGVuYWJsZUgke2xldmVsfWAgYXMgSHhUb2dnbGVLZXk7XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzW2tleV0pIHtcbiAgICAgICAgdGhpcy5hZGRIeENvbW1hbmQoXG4gICAgICAgICAgYGNvbnZlcnQtaCR7bGV2ZWx9LXRvLXdpa2lsaW5rYCxcbiAgICAgICAgICBgQ29udmVydCBvbmx5IEgke2xldmVsfSB0byBXaWtpTGlua2AsXG4gICAgICAgICAgbGV2ZWwsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkSHhDb21tYW5kKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgbGV2ZWw6IE51bWJlcikge1xuICAgIHRoaXMucmVnaXN0ZXJkQ29tbWFuZElkcy5wdXNoKGlkKTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZCxcbiAgICAgIG5hbWUsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlOiBURmlsZSB8IG51bGwgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBpZiAoIWZpbGUpIHJldHVybjtcblxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkTGluZXMgPSBsaW5lcy5mbGF0TWFwKChsaW5lKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9eKCN7MSw2fSkgKC4rKSQvKTtcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc2hlcyA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgY29uc3QgaGVhZGluZyA9IG1hdGNoWzJdO1xuXG4gICAgICAgICAgICBpZiAobGV2ZWwgPT09IDAgfHwgaGFzaGVzLmxlbmd0aCA9PT0gbGV2ZWwpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kZSA9PT0gXCJyZXBsYWNlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2BbWyR7aGVhZGluZ31dXWBdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbGluZSwgYFtbJHtoZWFkaW5nfV1dYF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFtsaW5lXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIG1vZGlmaWVkTGluZXMuam9pbihcIlxcblwiKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cbn1cbiIsICJleHBvcnQgdHlwZSBIeE1vZGUgPSBcInJlcGxhY2VcIiB8IFwiZHVwbGljYXRlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSHhUb1dpa2lMaW5rU2V0dGluZ3Mge1xuICBtb2RlOiBIeE1vZGU7XG4gIGVuYWJsZUFsbDogYm9vbGVhbjtcbiAgZW5hYmxlSDE6IGJvb2xlYW47XG4gIGVuYWJsZUgyOiBib29sZWFuO1xuICBlbmFibGVIMzogYm9vbGVhbjtcbiAgZW5hYmxlSDQ6IGJvb2xlYW47XG4gIGVuYWJsZUg1OiBib29sZWFuO1xuICBlbmFibGVINjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEh4VG9XaWtpTGlua1NldHRpbmdzID0ge1xuICBtb2RlOiBcInJlcGxhY2VcIixcbiAgZW5hYmxlQWxsOiB0cnVlLFxuICBlbmFibGVIMTogdHJ1ZSxcbiAgZW5hYmxlSDI6IHRydWUsXG4gIGVuYWJsZUgzOiB0cnVlLFxuICBlbmFibGVINDogdHJ1ZSxcbiAgZW5hYmxlSDU6IHRydWUsXG4gIGVuYWJsZUg2OiB0cnVlLFxufTtcblxuZXhwb3J0IHR5cGUgSHhUb2dnbGVLZXkgPVxuICB8IFwiZW5hYmxlSDFcIlxuICB8IFwiZW5hYmxlSDJcIlxuICB8IFwiZW5hYmxlSDNcIlxuICB8IFwiZW5hYmxlSDRcIlxuICB8IFwiZW5hYmxlSDVcIlxuICB8IFwiZW5hYmxlSDZcIjtcbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBIeFRvV2lraUxpbmtQbHVnaW4gZnJvbSBcIi4vbWFpbi50c1wiO1xuaW1wb3J0IHsgSHhUb2dnbGVLZXkgfSBmcm9tIFwiLi9zZXR0aW5ncy50c1wiO1xuXG5leHBvcnQgY2xhc3MgSHhUb1dpa2lMaW5rU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBIeFRvV2lraUxpbmtQbHVnaW47XG5cbiAgY29uc3RydWN0b3IoYXBwOiBhbnksIHBsdWdpbjogSHhUb1dpa2lMaW5rUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgb3ZlcnJpZGUgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkh4IHRvIFdpa2lMaW5rIC0gU2V0dGluZ3NcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJEdXBsaWNhdGUgV2lraUxpbmtcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEdXBsaWNhdGUgV2lraUxpbmtcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkluc2VydCBXaWtpTGluayBiZWxvdyBoZWFkaW5nIGluc3RlYWQgb2YgcmVwbGFjaW5nIGl0LlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSA9PT0gXCJkdXBsaWNhdGVcIilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RlID0gdmFsdWUgPyBcImR1cGxpY2F0ZVwiIDogXCJyZXBsYWNlXCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkVuYWJsZWQgQ29tYW1uZHNcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmFibGUgQWxsIEh4IGNvbW1hbmRcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlJlZ2lzdGVyIGEgY29tbWFuZCB0byBjb252ZXJ0IGFsbCBoZWFkaW5nIGxldmVscyAoSDEtSDYpLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQWxsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUFsbCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlkID0gXCJjb252ZXJ0LWFsbC1oeC10by13aWtpbGlua1wiO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmFkZEh4Q29tbWFuZChpZCwgXCJDb252ZXJ0IGFsbCBIeCB0byBXaWtpTGlua1wiLCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlbW92ZUNvbW1hbmQoaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgZm9yIChsZXQgbGV2ZWwgPSAxOyBsZXZlbCA8PSA2OyBsZXZlbCsrKSB7XG4gICAgICBjb25zdCBrZXkgPSBgZW5hYmxlSCR7bGV2ZWx9YCBhcyBIeFRvZ2dsZUtleTtcbiAgICAgIGNvbnN0IGlkID0gYGNvbnZlcnQtaCR7bGV2ZWx9LXRvLXdpa2lsaW5rYDtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKGBFbmFibGUgSCR7bGV2ZWx9IGNvbW1hbmRgKVxuICAgICAgICAuc2V0RGVzYyhgUmVnaXN0ZXIgYSBjb21tYW5kIGZvciBjb252ZXJ0aW5nIEgke2xldmVsfSBoZWFkaW5ncy5gKVxuICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Nba2V5XSBhcyBib29sZWFuKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5nc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmFkZEh4Q29tbWFuZChcbiAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgYENvbnZlcnQgb25seSBIJHtsZXZlbH0gdG8gV2lraUxpbmtgLFxuICAgICAgICAgICAgICAgICAgbGV2ZWwsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5yZW1vdmVDb21tYW5kKGlkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBQUFBLG1CQUE4Qjs7O0FDYXZCLElBQU0sbUJBQXlDO0FBQUEsRUFDcEQsTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUNaOzs7QUN0QkEsc0JBQTBDO0FBSW5DLElBQU0sMEJBQU4sY0FBc0MsaUNBQWlCO0FBQUEsRUFHNUQsWUFBWSxLQUFVLFFBQTRCO0FBQ2hELFVBQU0sS0FBSyxNQUFNO0FBSG5CO0FBSUUsU0FBSyxTQUFTO0FBQUEsRUFDaEI7QUFBQSxFQUVTLFVBQWdCO0FBQ3ZCLFVBQU0sRUFBRSxZQUFZLElBQUk7QUFFeEIsZ0JBQVksTUFBTTtBQUVsQixnQkFBWSxTQUFTLE1BQU0sRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ2hFLGdCQUFZLFNBQVMsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFekQsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsb0JBQW9CLEVBQzVCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFD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
