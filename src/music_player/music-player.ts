import auth from "auth.json";
import { Player } from "discord-player";
import { YoutubeiExtractor, YoutubeiOptions } from "discord-player-youtubei";
import { Client } from "discord.js";
import settings from "settings.json";
import { ProxyAgent } from "undici";

export class MusicPlayer extends Player {
  constructor(client: Client) {
    super(client, {
      connectionTimeout: 600000,
    });
  }

  async registerYoutubeiExtractor() {
    const youtubeiSettings: YoutubeiOptions = {
      cookie: auth["youtubeCookies"],
      generateWithPoToken: true,
    };

    if (settings.proxyAddress) {
      youtubeiSettings.proxy = new ProxyAgent(settings.proxyAddress);
    }

    await this.extractors.register(YoutubeiExtractor, youtubeiSettings);
  }
}
