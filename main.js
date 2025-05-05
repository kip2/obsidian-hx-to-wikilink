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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIEh4VG9XaWtpTGlua1NldHRpbmdzIHtcbiAgbW9kZTogXCJyZXBsYWNlXCIgfCBcImR1cGxpY2F0ZVwiO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBIeFRvV2lraUxpbmtTZXR0aW5ncyA9IHtcbiAgbW9kZTogXCJyZXBsYWNlXCIsXG59O1xuXG5jbGFzcyBIeFRvV2lraUxpbmtTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IEh4VG9XaWtpTGlua1BsdWdpbjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IGFueSwgcGx1Z2luOiBIeFRvV2lraUxpbmtQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBvdmVycmlkZSBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiSHggdG8gV2lraUxpbmsgLSBTZXR0aW5nc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbnZlcnNpb24gTW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ2hvb3NlIHdldGhlciB0byByZXBsYWNlIHRoZSBoZWFkaW5nIG9yIGR1cGxpY2F0ZSBpdCB3aXRoIGEgV2lraUxpbmsuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PlxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oXCJyZXBsYWNlXCIsIFwiUmVwbGFjZSBoZWFkaW5nIHdpdGggV2lraUxpbmtcIilcbiAgICAgICAgICAuYWRkT3B0aW9uKFwiZHVwbGljYXRlXCIsIFwiSW5zZXJ0IFdpa2lMaW5rIGJlbG93IGhlYWRpbmdcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJyZXBsYWNlXCIgfHwgdmFsdWUgPT09IFwiZHVwbGljYXRlXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSA9IHZhbHVlO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIeFRvV2lraUxpbmtQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5ncyE6IEh4VG9XaWtpTGlua1NldHRpbmdzO1xuXG4gIG92ZXJyaWRlIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBIeFRvV2lraUxpbmtTZXR0aW5nc1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gNjsgaSsrKSB7XG4gICAgICB0aGlzLmFkZEh4Q29tbWFuZChcbiAgICAgICAgYGNvbnZlcnQtaCR7aX0tdG8td2lraWxpbmtgLFxuICAgICAgICBgQ29udmVydCBvbmx5IEgke2l9IHRvIFdpa2lMaW5rYCxcbiAgICAgICAgaSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5hZGRIeENvbW1hbmQoXG4gICAgICBcImNvbnZlcnQtYWxsLWh4LXRvLXdpa2lsaW5rXCIsXG4gICAgICBcIkNvbnZlcnQgYWxsIEh4IHRvIFdpa2lMaW5rXCIsXG4gICAgICAwLFxuICAgICk7XG4gIH1cblxuICBhZGRIeENvbW1hbmQoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBsZXZlbDogTnVtYmVyKSB7XG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkLFxuICAgICAgbmFtZSxcbiAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGU6IFRGaWxlIHwgbnVsbCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuICAgICAgICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoXCJcXG5cIik7XG5cbiAgICAgICAgY29uc3QgbW9kaWZpZWRMaW5lcyA9IGxpbmVzLmZsYXRNYXAoKGxpbmUpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL14oI3sxLDZ9KSAoLispJC8pO1xuICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgaGFzaGVzID0gbWF0Y2hbMV07XG4gICAgICAgICAgICBjb25zdCBoZWFkaW5nID0gbWF0Y2hbMl07XG5cbiAgICAgICAgICAgIGlmIChsZXZlbCA9PT0gMCB8fCBoYXNoZXMubGVuZ3RoID09PSBsZXZlbCkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5tb2RlID09PSBcInJlcGxhY2VcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBbYFtbJHtoZWFkaW5nfV1dYF07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsaW5lLCBgW1ske2hlYWRpbmd9XV1gXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gW2xpbmVdO1xuICAgICAgICB9KTtcblxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgbW9kaWZpZWRMaW5lcy5qb2luKFwiXFxuXCIpKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQXlEO0FBTXpELElBQU0sbUJBQXlDO0FBQUEsRUFDN0MsTUFBTTtBQUNSO0FBRUEsSUFBTSwwQkFBTixjQUFzQyxpQ0FBaUI7QUFBQSxFQUdyRCxZQUFZLEtBQVUsUUFBNEI7QUFDaEQsVUFBTSxLQUFLLE1BQU07QUFIbkI7QUFJRSxTQUFLLFNBQVM7QUFBQSxFQUNoQjtBQUFBLEVBRVMsVUFBZ0I7QUFDdkIsVUFBTSxFQUFFLFlBQVksSUFBSTtBQUV4QixnQkFBWSxNQUFNO0FBRWxCLGdCQUFZLFNBQVMsTUFBTSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFaEUsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsaUJBQWlCLEVBQ3pCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVksQ0FBQyxhQUNaLFNBQ0csVUFBVSxXQUFXLCtCQUErQixFQUNwRCxVQUFVLGFBQWEsK0JBQStCLEVBQ3RELFNBQVMsS0FBSyxPQUFPLFNBQVMsSUFBSSxFQUNsQyxTQUFTLENBQU8sVUFBa0I7QUFDakMsWUFBSSxVQUFVLGFBQWEsVUFBVSxhQUFhO0FBQ2hELGVBQUssT0FBTyxTQUFTLE9BQU87QUFDNUIsZ0JBQU0sS0FBSyxPQUFPLGFBQWE7QUFBQSxRQUNqQztBQUFBLE1BQ0YsRUFBQztBQUFBLElBQ0w7QUFBQSxFQUNKO0FBQ0Y7QUFFQSxJQUFxQixxQkFBckIsY0FBZ0QsdUJBQU87QUFBQSxFQUF2RDtBQUFBO0FBQ0U7QUFBQTtBQUFBLEVBRWUsU0FBUztBQUFBO0FBQ3RCLFlBQU0sS0FBSyxhQUFhO0FBRXhCLFdBQUssY0FBYyxJQUFJLHdCQUF3QixLQUFLLEtBQUssSUFBSSxDQUFDO0FBRTlELGVBQVMsSUFBSSxHQUFHLEtBQUssR0FBRyxLQUFLO0FBQzNCLGFBQUs7QUFBQSxVQUNILFlBQVksQ0FBQztBQUFBLFVBQ2IsaUJBQWlCLENBQUM7QUFBQSxVQUNsQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBRUEsV0FBSztBQUFBLFFBQ0g7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxFQUVBLGFBQWEsSUFBWSxNQUFjLE9BQWU7QUFDcEQsU0FBSyxXQUFXO0FBQUEsTUFDZDtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVUsTUFBWTtBQUNwQixjQUFNLE9BQXFCLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDNUQsWUFBSSxDQUFDLEtBQU07QUFFWCxjQUFNLE9BQU8sTUFBTSxLQUFLLElBQUksTUFBTSxLQUFLLElBQUk7QUFDM0MsY0FBTSxRQUFRLEtBQUssTUFBTSxJQUFJO0FBRTdCLGNBQU0sZ0JBQWdCLE1BQU0sUUFBUSxDQUFDLFNBQVM7QUFDNUMsZ0JBQU0sUUFBUSxLQUFLLE1BQU0saUJBQWlCO0FBQzFDLGNBQUksT0FBTztBQUNULGtCQUFNLFNBQVMsTUFBTSxDQUFDO0FBQ3RCLGtCQUFNLFVBQVUsTUFBTSxDQUFDO0FBRXZCLGdCQUFJLFVBQVUsS0FBSyxPQUFPLFdBQVcsT0FBTztBQUMxQyxrQkFBSSxLQUFLLFNBQVMsU0FBUyxXQUFXO0FBQ3BDLHVCQUFPLENBQUMsS0FBSyxPQUFPLElBQUk7QUFBQSxjQUMxQixPQUFPO0FBQ0wsdUJBQU8sQ0FBQyxNQUFNLEtBQUssT0FBTyxJQUFJO0FBQUEsY0FDaEM7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUNBLGlCQUFPLENBQUMsSUFBSTtBQUFBLFFBQ2QsQ0FBQztBQUVELGNBQU0sS0FBSyxJQUFJLE1BQU0sT0FBTyxNQUFNLGNBQWMsS0FBSyxJQUFJLENBQUM7QUFBQSxNQUM1RDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVNLGVBQWU7QUFBQTtBQUNuQixXQUFLLFdBQVcsT0FBTyxPQUFPLENBQUMsR0FBRyxrQkFBa0IsTUFBTSxLQUFLLFNBQVMsQ0FBQztBQUFBLElBQzNFO0FBQUE7QUFBQSxFQUVNLGVBQWU7QUFBQTtBQUNuQixZQUFNLEtBQUssU0FBUyxLQUFLLFFBQVE7QUFBQSxJQUNuQztBQUFBO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
