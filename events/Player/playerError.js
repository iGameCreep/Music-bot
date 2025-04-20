const { EmbedBuilder } = require('discord.js');
const { Translate } = require("../../process_tools");

module.exports = async (queue, error) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: await Translate(`Bot had an unexpected error, please check the console imminently!`) })
    .setColor('#EE4B2B');

  queue.metadata.channel.send({ embeds: [embed] });

  if (queue.metadata.lyricsThread) {
    queue.metadata.lyricsThread.delete();
    queue.setMetadata({
      channel: queue.metadata.channel
    });
  }

  console.log((`Error emitted from the player <${error.message}>`));
}
