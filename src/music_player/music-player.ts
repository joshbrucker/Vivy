// import { DefaultExtractors } from "@discord-player/extractor";
import auth from "../auth.json";
import { Player } from "discord-player";
import { YoutubeExtractor, YoutubeOptions } from "discord-player-youtubei";
import { Client } from "discord.js";

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

    await this.extractors.register(YoutubeExtractor, youtubeiSettings);
  }
}
