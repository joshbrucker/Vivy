// import { DefaultExtractors } from "@discord-player/extractor";
import auth from "../auth.json";
import settings from "../settings.json";
import { Player } from "discord-player";
import { YoutubeExtractor, YoutubeOptions } from "discord-player-youtubei";
import { Client } from "discord.js";
import { ProxyAgent } from "undici";

export class MusicPlayer extends Player {
  constructor(client: Client) {
    super(client, {
      connectionTimeout: 600000,
    });
  }

  async registerYoutubeiExtractor() {
    const youtubeiSettings: YoutubeOptions = {
      cookie: auth["youtubeCookies"],
      downloads: {
        trialOrder: ["sabr"],
      },
    };

    for (const url of settings.proxyAddress) {
      youtubeiSettings.proxy = new ProxyAgent({ uri: url });
    }

    await this.extractors.register(YoutubeExtractor, youtubeiSettings);
  }
}
