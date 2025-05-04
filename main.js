var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => HxToWikiLinkPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var HxToWikiLinkPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.addCommand({
      id: "convert-h1-to-wikilink",
      name: "Convert H1 to WikiLink",
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return;
        let text = await this.app.vault.read(file);
        text = text.replace(/^# (.+)$/gm, "[[$1]]");
        text = text.replace(/<h1>([^<]+)<\/h1>/gi, "[[$1]]");
        await this.app.vault.modify(file, text);
      }
    });
  }
};
