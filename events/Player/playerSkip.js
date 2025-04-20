const { EmbedBuilder } = require('discord.js');
const { Translate } = require("../../process_tools");

module.exports = async (queue, track) => {
  const embed = new EmbedBuilder()
  .setAuthor({ name: await Translate(`Skipping <**${track.title}**> ! <✅>`)})
  .setColor('#EE4B2B');

  queue.metadata.channel.send({ embeds: [embed], iconURL: track.thumbnail });

  if (queue.metadata.lyricsThread) {
    queue.metadata.lyricsThread.delete();
    queue.setMetadata({
      channel: queue.metadata.channel
    });
  }
}
