const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = async (queue) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: await Translate('No more songs in the queue! <❌>') })
    .setColor('#2f3136');

  queue.metadata.channel.send({ embeds: [embed] });
}
