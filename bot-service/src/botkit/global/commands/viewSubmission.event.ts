import { BotkitMessage } from 'botkit/src/core';
import { SlackBotWorker } from 'botbuilder-adapter-slack';

export class ViewSubmissionEvent {
  constructor(
    public readonly callbackId: string,
    public readonly message: BotkitMessage,
    public readonly bot: SlackBotWorker,
  ) {
  }
}
