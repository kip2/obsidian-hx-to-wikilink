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
    new import_obsidian.Setting(containerEl).setName("Duplicate instead of replacing").setDesc(
      "If enabled, WikiLink will be inserted below the heading instead of replacing it."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.mode === "duplicate").onChange((value) => __async(this, null, function* () {
        this.plugin.settings.mode = value ? "duplicate" : "replace";
        yield this.plugin.saveSettings();
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
      yield this.loadSettings();
      this.addSettingTab(new HxToWikiLinkSettingsTab(this.app, this));
      for (let i = 1; i <= 6; i++) {
        this.addHxCommand(
          `convert-h${i}-to-wikilink`,
          `Convert only H${i} to WikiLink`,
          i
        );
      }
      this.addHxCommand(
        "convert-all-hx-to-wikilink",
        "Convert all Hx to WikiLink",
        0
      );
    });
  }
  addHxCommand(id, name, level) {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIEh4VG9XaWtpTGlua1NldHRpbmdzIHtcbiAgbW9kZTogXCJyZXBsYWNlXCIgfCBcImR1cGxpY2F0ZVwiO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBIeFRvV2lraUxpbmtTZXR0aW5ncyA9IHtcbiAgbW9kZTogXCJyZXBsYWNlXCIsXG59O1xuXG5jbGFzcyBIeFRvV2lraUxpbmtTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IEh4VG9XaWtpTGlua1BsdWdpbjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IGFueSwgcGx1Z2luOiBIeFRvV2lraUxpbmtQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBvdmVycmlkZSBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiSHggdG8gV2lraUxpbmsgLSBTZXR0aW5nc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkR1cGxpY2F0ZSBpbnN0ZWFkIG9mIHJlcGxhY2luZ1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiSWYgZW5hYmxlZCwgV2lraUxpbmsgd2lsbCBiZSBpbnNlcnRlZCBiZWxvdyB0aGUgaGVhZGluZyBpbnN0ZWFkIG9mIHJlcGxhY2luZyBpdC5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1vZGUgPT09IFwiZHVwbGljYXRlXCIpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSA9IHZhbHVlID8gXCJkdXBsaWNhdGVcIiA6IFwicmVwbGFjZVwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHhUb1dpa2lMaW5rUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3MhOiBIeFRvV2lraUxpbmtTZXR0aW5ncztcblxuICBvdmVycmlkZSBhc3luYyBvbmxvYWQoKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcblxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgSHhUb1dpa2lMaW5rU2V0dGluZ3NUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDY7IGkrKykge1xuICAgICAgdGhpcy5hZGRIeENvbW1hbmQoXG4gICAgICAgIGBjb252ZXJ0LWgke2l9LXRvLXdpa2lsaW5rYCxcbiAgICAgICAgYENvbnZlcnQgb25seSBIJHtpfSB0byBXaWtpTGlua2AsXG4gICAgICAgIGksXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuYWRkSHhDb21tYW5kKFxuICAgICAgXCJjb252ZXJ0LWFsbC1oeC10by13aWtpbGlua1wiLFxuICAgICAgXCJDb252ZXJ0IGFsbCBIeCB0byBXaWtpTGlua1wiLFxuICAgICAgMCxcbiAgICApO1xuICB9XG5cbiAgYWRkSHhDb21tYW5kKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgbGV2ZWw6IE51bWJlcikge1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZCxcbiAgICAgIG5hbWUsXG4gICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlOiBURmlsZSB8IG51bGwgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBpZiAoIWZpbGUpIHJldHVybjtcblxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgY29uc3QgbGluZXMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICAgIGNvbnN0IG1vZGlmaWVkTGluZXMgPSBsaW5lcy5mbGF0TWFwKChsaW5lKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9eKCN7MSw2fSkgKC4rKSQvKTtcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc2hlcyA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgY29uc3QgaGVhZGluZyA9IG1hdGNoWzJdO1xuXG4gICAgICAgICAgICBpZiAobGV2ZWwgPT09IDAgfHwgaGFzaGVzLmxlbmd0aCA9PT0gbGV2ZWwpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kZSA9PT0gXCJyZXBsYWNlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2BbWyR7aGVhZGluZ31dXWBdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbGluZSwgYFtbJHtoZWFkaW5nfV1dYF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFtsaW5lXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIG1vZGlmaWVkTGluZXMuam9pbihcIlxcblwiKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUF5RDtBQU16RCxJQUFNLG1CQUF5QztBQUFBLEVBQzdDLE1BQU07QUFDUjtBQUVBLElBQU0sMEJBQU4sY0FBc0MsaUNBQWlCO0FBQUEsRUFHckQsWUFBWSxLQUFVLFFBQTRCO0FBQ2hELFVBQU0sS0FBSyxNQUFNO0FBSG5CO0FBSUUsU0FBSyxTQUFTO0FBQUEsRUFDaEI7QUFBQSxFQUVTLFVBQWdCO0FBQ3ZCLFVBQU0sRUFBRSxZQUFZLElBQUk7QUFFeEIsZ0JBQVksTUFBTTtBQUVsQixnQkFBWSxTQUFTLE1BQU0sRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRWhFLFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLGdDQUFnQyxFQUN4QztBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFVLENBQUMsV0FDVixPQUNHLFNBQVMsS0FBSyxPQUFPLFNBQVMsU0FBUyxXQUFXLEVBQ2xELFNBQVMsQ0FBTyxVQUFtQjtBQUNsQyxhQUFLLE9BQU8sU0FBUyxPQUFPLFFBQVEsY0FBYztBQUNsRCxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQUEsTUFDakMsRUFBQztBQUFBLElBQ0w7QUFBQSxFQUNKO0FBQ0Y7QUFFQSxJQUFxQixxQkFBckIsY0FBZ0QsdUJBQU87QUFBQSxFQUF2RDtBQUFBO0FBQ0U7QUFBQTtBQUFBLEVBRWUsU0FBUztBQUFBO0FBQ3RCLFlBQU0sS0FBSyxhQUFhO0FBRXhCLFdBQUssY0FBYyxJQUFJLHdCQUF3QixLQUFLLEtBQUssSUFBSSxDQUFDO0FBRTlELGVBQVMsSUFBSSxHQUFHLEtBQUssR0FBRyxLQUFLO0FBQzNCLGFBQUs7QUFBQSxVQUNILFlBQVksQ0FBQztBQUFBLFVBQ2IsaUJBQWlCLENBQUM7QUFBQSxVQUNsQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBRUEsV0FBSztBQUFBLFFBQ0g7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxFQUVBLGFBQWEsSUFBWSxNQUFjLE9BQWU7QUFDcEQsU0FBSyxXQUFXO0FBQUEsTUFDZDtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVUsTUFBWTtBQUNwQixjQUFNLE9BQXFCLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDNUQsWUFBSSxDQUFDLEtBQU07QUFFWCxjQUFNLE9BQU8sTUFBTSxLQUFLLElBQUksTUFBTSxLQUFLLElBQUk7QUFDM0MsY0FBTSxRQUFRLEtBQUssTUFBTSxJQUFJO0FBRTdCLGNBQU0sZ0JBQWdCLE1BQU0sUUFBUSxDQUFDLFNBQVM7QUFDNUMsZ0JBQU0sUUFBUSxLQUFLLE1BQU0saUJBQWlCO0FBQzFDLGNBQUksT0FBTztBQUNULGtCQUFNLFNBQVMsTUFBTSxDQUFDO0FBQ3RCLGtCQUFNLFVBQVUsTUFBTSxDQUFDO0FBRXZCLGdCQUFJLFVBQVUsS0FBSyxPQUFPLFdBQVcsT0FBTztBQUMxQyxrQkFBSSxLQUFLLFNBQVMsU0FBUyxXQUFXO0FBQ3BDLHVCQUFPLENBQUMsS0FBSyxPQUFPLElBQUk7QUFBQSxjQUMxQixPQUFPO0FBQ0wsdUJBQU8sQ0FBQyxNQUFNLEtBQUssT0FBTyxJQUFJO0FBQUEsY0FDaEM7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUNBLGlCQUFPLENBQUMsSUFBSTtBQUFBLFFBQ2QsQ0FBQztBQUVELGNBQU0sS0FBSyxJQUFJLE1BQU0sT0FBTyxNQUFNLGNBQWMsS0FBSyxJQUFJLENBQUM7QUFBQSxNQUM1RDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVNLGVBQWU7QUFBQTtBQUNuQixXQUFLLFdBQVcsT0FBTyxPQUFPLENBQUMsR0FBRyxrQkFBa0IsTUFBTSxLQUFLLFNBQVMsQ0FBQztBQUFBLElBQzNFO0FBQUE7QUFBQSxFQUVNLGVBQWU7QUFBQTtBQUNuQixZQUFNLEtBQUssU0FBUyxLQUFLLFFBQVE7QUFBQSxJQUNuQztBQUFBO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
