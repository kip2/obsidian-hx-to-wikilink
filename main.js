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
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  mode: "replace"
};
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
    new import_obsidian.Setting(containerEl).setName("Conversion Mode").setDesc(
      "Choose wether to replace the heading or duplicate it with a WikiLink."
    ).addDropdown(
      (dropdown) => dropdown.addOption("replace", "Replace heading with WikiLink").addOption("duplicate", "Insert WikiLink below heading").setValue(this.plugin.settings.mode).onChange((value) => __async(this, null, function* () {
        if (value === "replace" || value === "duplicate") {
          this.plugin.settings.mode = value;
          yield this.plugin.saveSettings();
        }
      }))
    );
  }
};
var HxToWikiLinkPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings");
  }
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettngs();
      this.addSettingTab(new HxToWikiLinkSettingsTab(this.app, this));
      this.addCommand({
        id: "convert-h1-to-wikilink",
        name: "Convert H1 to WikiLink",
        callback: () => __async(this, null, function* () {
          const file = this.app.workspace.getActiveFile();
          if (!file) return;
          let text = yield this.app.vault.read(file);
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
          yield this.app.vault.modify(file, modifiedLines.join("\n"));
        })
      });
    });
  }
  loadSettngs() {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIEh4VG9XaWtpTGlua1NldHRpbmdzIHtcbiAgbW9kZTogXCJyZXBsYWNlXCIgfCBcImR1cGxpY2F0ZVwiO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBIeFRvV2lraUxpbmtTZXR0aW5ncyA9IHtcbiAgbW9kZTogXCJyZXBsYWNlXCIsXG59O1xuXG5jbGFzcyBIeFRvV2lraUxpbmtTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IEh4VG9XaWtpTGlua1BsdWdpbjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IGFueSwgcGx1Z2luOiBIeFRvV2lraUxpbmtQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBvdmVycmlkZSBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiSHggdG8gV2lraUxpbmsgLSBTZXR0aW5nc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbnZlcnNpb24gTW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ2hvb3NlIHdldGhlciB0byByZXBsYWNlIHRoZSBoZWFkaW5nIG9yIGR1cGxpY2F0ZSBpdCB3aXRoIGEgV2lraUxpbmsuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PlxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oXCJyZXBsYWNlXCIsIFwiUmVwbGFjZSBoZWFkaW5nIHdpdGggV2lraUxpbmtcIilcbiAgICAgICAgICAuYWRkT3B0aW9uKFwiZHVwbGljYXRlXCIsIFwiSW5zZXJ0IFdpa2lMaW5rIGJlbG93IGhlYWRpbmdcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJyZXBsYWNlXCIgfHwgdmFsdWUgPT09IFwiZHVwbGljYXRlXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIeFRvV2lraUxpbmtQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5ncyE6IEh4VG9XaWtpTGlua1NldHRpbmdzO1xuXG4gIG92ZXJyaWRlIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0bmdzKCk7XG5cbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IEh4VG9XaWtpTGlua1NldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29udmVydC1oMS10by13aWtpbGlua1wiLFxuICAgICAgbmFtZTogXCJDb252ZXJ0IEgxIHRvIFdpa2lMaW5rXCIsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlOiBURmlsZSB8IG51bGwgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBpZiAoIWZpbGUpIHJldHVybjtcblxuICAgICAgICBsZXQgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcblxuICAgICAgICBjb25zdCBtb2RpZmllZExpbmVzID0gbGluZXMuZmxhdE1hcCgobGluZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaCgvXigjezEsNn0pICguKykkLyk7XG4gICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkaW5nID0gbWF0Y2hbMl07XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5tb2RlID09IFwicmVwbGFjZVwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBbYFtbJHtoZWFkaW5nfV1dYF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gW2xpbmUsIGBbWyR7aGVhZGluZ31dXWBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2xpbmVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIG1vZGlmaWVkTGluZXMuam9pbihcIlxcblwiKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRuZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
