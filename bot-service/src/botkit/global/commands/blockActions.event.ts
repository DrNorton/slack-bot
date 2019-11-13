import { BotkitMessage } from 'botkit/src/core';
import { SlackBotWorker } from 'botbuilder-adapter-slack';

export class BlockActionsEvent {
  constructor(
    public readonly action: string,
    public readonly value: string,
    public readonly message: BotkitMessage,
    public readonly bot: SlackBotWorker,
  ) {
  }
}
