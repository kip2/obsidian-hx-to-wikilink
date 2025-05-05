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
  mode: "replace",
  enableAll: true,
  enableH1: true,
  enableH2: true,
  enableH3: true,
  enableH4: true,
  enableH5: true,
  enableH6: true
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
var HxToWikiLinkPlugin = class extends import_obsidian.Plugin {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIEh4VG9XaWtpTGlua1NldHRpbmdzIHtcbiAgbW9kZTogXCJyZXBsYWNlXCIgfCBcImR1cGxpY2F0ZVwiO1xuICBlbmFibGVBbGw6IGJvb2xlYW47XG4gIGVuYWJsZUgxOiBib29sZWFuO1xuICBlbmFibGVIMjogYm9vbGVhbjtcbiAgZW5hYmxlSDM6IGJvb2xlYW47XG4gIGVuYWJsZUg0OiBib29sZWFuO1xuICBlbmFibGVINTogYm9vbGVhbjtcbiAgZW5hYmxlSDY6IGJvb2xlYW47XG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEh4VG9XaWtpTGlua1NldHRpbmdzID0ge1xuICBtb2RlOiBcInJlcGxhY2VcIixcbiAgZW5hYmxlQWxsOiB0cnVlLFxuICBlbmFibGVIMTogdHJ1ZSxcbiAgZW5hYmxlSDI6IHRydWUsXG4gIGVuYWJsZUgzOiB0cnVlLFxuICBlbmFibGVINDogdHJ1ZSxcbiAgZW5hYmxlSDU6IHRydWUsXG4gIGVuYWJsZUg2OiB0cnVlLFxufTtcblxudHlwZSBIeFRvZ2dsZUtleSA9XG4gIHwgXCJlbmFibGVIMVwiXG4gIHwgXCJlbmFibGVIMlwiXG4gIHwgXCJlbmFibGVIM1wiXG4gIHwgXCJlbmFibGVINFwiXG4gIHwgXCJlbmFibGVINVwiXG4gIHwgXCJlbmFibGVINlwiO1xuXG5jbGFzcyBIeFRvV2lraUxpbmtTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IEh4VG9XaWtpTGlua1BsdWdpbjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IGFueSwgcGx1Z2luOiBIeFRvV2lraUxpbmtQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBvdmVycmlkZSBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiSHggdG8gV2lraUxpbmsgLSBTZXR0aW5nc1wiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkR1cGxpY2F0ZSBXaWtpTGlua1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkR1cGxpY2F0ZSBXaWtpTGlua1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiSW5zZXJ0IFdpa2lMaW5rIGJlbG93IGhlYWRpbmcgaW5zdGVhZCBvZiByZXBsYWNpbmcgaXQuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RlID09PSBcImR1cGxpY2F0ZVwiKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1vZGUgPSB2YWx1ZSA/IFwiZHVwbGljYXRlXCIgOiBcInJlcGxhY2VcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiRW5hYmxlZCBDb21hbW5kc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuYWJsZSBBbGwgSHggY29tbWFuZFwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiUmVnaXN0ZXIgYSBjb21tYW5kIHRvIGNvbnZlcnQgYWxsIGhlYWRpbmcgbGV2ZWxzIChIMS1INikuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVBbGwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlQWxsID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblxuICAgICAgICAgICAgY29uc3QgaWQgPSBcImNvbnZlcnQtYWxsLWh4LXRvLXdpa2lsaW5rXCI7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uYWRkSHhDb21tYW5kKGlkLCBcIkNvbnZlcnQgYWxsIEh4IHRvIFdpa2lMaW5rXCIsIDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVtb3ZlQ29tbWFuZChpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBmb3IgKGxldCBsZXZlbCA9IDE7IGxldmVsIDw9IDY7IGxldmVsKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGBlbmFibGVIJHtsZXZlbH1gIGFzIEh4VG9nZ2xlS2V5O1xuICAgICAgY29uc3QgaWQgPSBgY29udmVydC1oJHtsZXZlbH0tdG8td2lraWxpbmtgO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoYEVuYWJsZSBIJHtsZXZlbH0gY29tbWFuZGApXG4gICAgICAgIC5zZXREZXNjKGBSZWdpc3RlciBhIGNvbW1hbmQgZm9yIGNvbnZlcnRpbmcgSCR7bGV2ZWx9IGhlYWRpbmdzLmApXG4gICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5nc1trZXldIGFzIGJvb2xlYW4pXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cbiAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uYWRkSHhDb21tYW5kKFxuICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICBgQ29udmVydCBvbmx5IEgke2xldmVsfSB0byBXaWtpTGlua2AsXG4gICAgICAgICAgICAgICAgICBsZXZlbCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlbW92ZUNvbW1hbmQoaWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIeFRvV2lraUxpbmtQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5ncyE6IEh4VG9XaWtpTGlua1NldHRpbmdzO1xuXG4gIHJlZ2lzdGVyZENvbW1hbmRJZHM6IHN0cmluZ1tdID0gW107XG5cbiAgb3ZlcnJpZGUgYXN5bmMgb25sb2FkKCkge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG5cbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IEh4VG9XaWtpTGlua1NldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICAvLyBhbGwgSHggdGFnLlxuICAgIGlmICh0aGlzLnNldHRpbmdzLmVuYWJsZUFsbCkge1xuICAgICAgdGhpcy5hZGRIeENvbW1hbmQoXG4gICAgICAgIFwiY29udmVydC1hbGwtaHgtdG8td2lraWxpbmtcIixcbiAgICAgICAgXCJDb252ZXJ0IGFsbCBIeCB0byBXaWtpTGlua1wiLFxuICAgICAgICAwLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBoMSB+IGg2IHRhZy5cbiAgICBmb3IgKGxldCBsZXZlbCA9IDE7IGxldmVsIDw9IDY7IGxldmVsKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGBlbmFibGVIJHtsZXZlbH1gIGFzIEh4VG9nZ2xlS2V5O1xuXG4gICAgICBpZiAodGhpcy5zZXR0aW5nc1trZXldKSB7XG4gICAgICAgIHRoaXMuYWRkSHhDb21tYW5kKFxuICAgICAgICAgIGBjb252ZXJ0LWgke2xldmVsfS10by13aWtpbGlua2AsXG4gICAgICAgICAgYENvbnZlcnQgb25seSBIJHtsZXZlbH0gdG8gV2lraUxpbmtgLFxuICAgICAgICAgIGxldmVsLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEh4Q29tbWFuZChpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGxldmVsOiBOdW1iZXIpIHtcbiAgICB0aGlzLnJlZ2lzdGVyZENvbW1hbmRJZHMucHVzaChpZCk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQsXG4gICAgICBuYW1lLFxuICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZTogVEZpbGUgfCBudWxsID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcblxuICAgICAgICBjb25zdCBtb2RpZmllZExpbmVzID0gbGluZXMuZmxhdE1hcCgobGluZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaCgvXigjezEsNn0pICguKykkLyk7XG4gICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25zdCBoYXNoZXMgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRpbmcgPSBtYXRjaFsyXTtcblxuICAgICAgICAgICAgaWYgKGxldmVsID09PSAwIHx8IGhhc2hlcy5sZW5ndGggPT09IGxldmVsKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGUgPT09IFwicmVwbGFjZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtgW1ske2hlYWRpbmd9XV1gXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2xpbmUsIGBbWyR7aGVhZGluZ31dXWBdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBbbGluZV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBtb2RpZmllZExpbmVzLmpvaW4oXCJcXG5cIikpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxz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O0FBQ3ZDLGNBQU0sTUFBTSxVQUFVLEtBQUs7QUFFM0IsWUFBSSxLQUFLLFNBQVMsR0FBRyxHQUFHO0FBQ3RCLGVBQUs7QUFBQSxZQUNILFlBQVksS0FBSztBQUFBLFlBQ2pCLGlCQUFpQixLQUFLO0FBQUEsWUFDdEI7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxFQUVBLGFBQWEsSUFBWSxNQUFjLE9BQWU7QUFDcEQsU0FBSyxvQkFBb0IsS0FBSyxFQUFFO0FBRWhDLFNBQUssV0FBVztBQUFBLE1BQ2Q7QUFBQSxNQUNBO0FBQUEsTUFDQSxVQUFVLE1BQVk7QUFDcEIsY0FBTSxPQUFxQixLQUFLLElBQUksVUFBVSxjQUFjO0FBQzVELFlBQUksQ0FBQyxLQUFNO0FBRVgsY0FBTSxPQUFPLE1BQU0sS0FBSyxJQUFJLE1BQU0sS0FBSyxJQUFJO0FBQzNDLGNBQU0sUUFBUSxLQUFLLE1BQU0sSUFBSTtBQUU3QixjQUFNLGdCQUFnQixNQUFNLFFBQVEsQ0FBQyxTQUFTO0FBQzVDLGdCQUFNLFFBQVEsS0FBSyxNQUFNLGlCQUFpQjtBQUMxQyxjQUFJLE9BQU87QUFDVCxrQkFBTSxTQUFTLE1BQU0sQ0FBQztBQUN0QixrQkFBTSxVQUFVLE1BQU0sQ0FBQztBQUV2QixnQkFBSSxVQUFVLEtBQUssT0FBTyxXQUFXLE9BQU87QUFDMUMsa0JBQUksS0FBSyxTQUFTLFNBQVMsV0FBVztBQUNwQyx1QkFBTyxDQUFDLEtBQUssT0FBTyxJQUFJO0FBQUEsY0FDMUIsT0FBTztBQUNMLHVCQUFPLENBQUMsTUFBTSxLQUFLLE9BQU8sSUFBSTtBQUFBLGNBQ2hDO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFDQSxpQkFBTyxDQUFDLElBQUk7QUFBQSxRQUNkLENBQUM7QUFFRCxjQUFNLEtBQUssSUFBSSxNQUFNLE9BQU8sTUFBTSxjQUFjLEtBQUssSUFBSSxDQUFDO0FBQUEsTUFDNUQ7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFTSxlQUFlO0FBQUE7QUFDbkIsV0FBSyxXQUFXLE9BQU8sT0FBTyxDQUFDLEdBQUcsa0JBQWtCLE1BQU0sS0FBSyxTQUFTLENBQUM7QUFBQSxJQUMzRTtBQUFBO0FBQUEsRUFFTSxlQUFlO0FBQUE7QUFDbkIsWUFBTSxLQUFLLFNBQVMsS0FBSyxRQUFRO0FBQUEsSUFDbkM7QUFBQTtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
