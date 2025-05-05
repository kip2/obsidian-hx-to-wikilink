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
        id: "convert-all-hx-to-wikilink",
        name: "Convert all hx to WikiLink",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIEh4VG9XaWtpTGlua1NldHRpbmdzIHtcbiAgbW9kZTogXCJyZXBsYWNlXCIgfCBcImR1cGxpY2F0ZVwiO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBIeFRvV2lraUxpbmtTZXR0aW5ncyA9IHtcbiAgbW9kZTogXCJyZXBsYWNlXCIsXG59O1xuXG5jbGFzcyBIeFRvV2lraUxpbmtTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IEh4VG9XaWtpTGlua1BsdWdpbjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IGFueSwgcGx1Z2luOiBIeFRvV2lraUxpbmtQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBvdmVycmlkZSBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiSHggdG8gV2lraUxpbmsgLSBTZXR0aW5nc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbnZlcnNpb24gTW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ2hvb3NlIHdldGhlciB0byByZXBsYWNlIHRoZSBoZWFkaW5nIG9yIGR1cGxpY2F0ZSBpdCB3aXRoIGEgV2lraUxpbmsuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PlxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oXCJyZXBsYWNlXCIsIFwiUmVwbGFjZSBoZWFkaW5nIHdpdGggV2lraUxpbmtcIilcbiAgICAgICAgICAuYWRkT3B0aW9uKFwiZHVwbGljYXRlXCIsIFwiSW5zZXJ0IFdpa2lMaW5rIGJlbG93IGhlYWRpbmdcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJyZXBsYWNlXCIgfHwgdmFsdWUgPT09IFwiZHVwbGljYXRlXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIeFRvV2lraUxpbmtQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5ncyE6IEh4VG9XaWtpTGlua1NldHRpbmdzO1xuXG4gIG92ZXJyaWRlIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0bmdzKCk7XG5cbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IEh4VG9XaWtpTGlua1NldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29udmVydC1hbGwtaHgtdG8td2lraWxpbmtcIixcbiAgICAgIG5hbWU6IFwiQ29udmVydCBhbGwgaHggdG8gV2lraUxpbmtcIixcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGU6IFRGaWxlIHwgbnVsbCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCB0ZXh0ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkTGluZXMgPSBsaW5lcy5mbGF0TWFwKChsaW5lKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9eKCN7MSw2fSkgKC4rKSQvKTtcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRpbmcgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGUgPT0gXCJyZXBsYWNlXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFtgW1ske2hlYWRpbmd9XV1gXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBbbGluZSwgYFtbJHtoZWFkaW5nfV1dYF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbGluZV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgbW9kaWZpZWRMaW5lcy5qb2luKFwiXFxuXCIpKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dG5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
