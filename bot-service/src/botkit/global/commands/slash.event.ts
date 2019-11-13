import { BotkitMessage } from 'botkit/src/core';
import { SlackBotWorker } from 'botbuilder-adapter-slack';

export class SlashEvent {
  constructor(
    public readonly command: string,
    public readonly message: BotkitMessage,
    public readonly bot: SlackBotWorker,
  ) {
  }
}
