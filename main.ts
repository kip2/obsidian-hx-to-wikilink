import { Plugin, TFile } from 'obsidian';

export default class HxToWikiLinkPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'convert-h1-to-wikilink',
      name: 'Convert H1 to WikiLink',
      callback: async () => {
        const file: TFile | null = this.app.workspace.getActiveFile();
        if (!file) return;

        let text = await this.app.vault.read(file);

        text = text.replace(/^# (.+)$/gm, '[[$1]]');

        text = text.replace(/<h1>([^<]+)<\/h1>/gi, '[[$1]]');

        await this.app.vault.modify(file, text);
      },
    });
  }
}
