const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = async (queue, error) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: await Translate(`Bot had an unexpected error, please check the console imminently! <❌>`) })
    .setColor('#EE4B2B');

  queue.metadata.channel.send({ embeds: [embed] });

  console.log((`Error emitted from the Bot <${error}>`));
}