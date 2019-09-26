import * as slackify from 'slackify-markdown';

export default class MrkdwnConverter {
  public static convertFromMarkdown(markdownText: string) {
    return slackify(markdownText);
  }
}
