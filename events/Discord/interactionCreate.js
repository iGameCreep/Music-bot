const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = async (client, inter) => {
  await inter.deferReply({ ephemeral: true });
  if (inter.type === InteractionType.ApplicationCommand) {
    await handleCommand(inter, client);
  } else if (inter.type === InteractionType.MessageComponent) {
    await handleButton(inter, client);
  }
}

async function handleCommand(inter, client) {
  const DJ = client.config.opt.DJ;
  const command = client.commands.get(inter.commandName);

  const errorEmbed = new EmbedBuilder().setColor('#ff0000');

  if (!command) {
    errorEmbed.setDescription(await Translate('<❌> | Error! Please contact Developers!'));
    inter.editReply({ embeds: [errorEmbed], ephemeral: true });
    return client.slash.delete(inter.commandName);
  }

  if (command.permissions && !inter.member.permissions.has(command.permissions)) {
    errorEmbed.setDescription(await Translate(`<❌> | You don't have the proper permissions to execute this command!`));
    return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
  }

  const djRole = inter.guild.roles.cache.find(x => x.name === DJ.roleName)?.id;
  if (DJ.enabled && DJ.commands.includes(command) && djRole && !inter.member._roles.includes(djRole)) {
    errorEmbed.setDescription(await Translate(`<❌> | This command is reserved for members with the role <\`${djRole}\`> !`));
    return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
  }

  if (command.voiceChannel) {
    if (!inter.member.voice.channel) {
      errorEmbed.setDescription(await Translate(`<❌> | You are not in a voice channel!`));
      return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
      errorEmbed.setDescription(await Translate(`<❌> | You are not in the same voice channel as the bot!`));
      return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
  }

  command.execute({ inter, client });
}

async function handleButton(inter, client) {
  const customId = inter.customId;
  if (!customId) return;

  const queue = useQueue(inter.guild);
  const path = `../../buttons/${customId}.js`;

  delete require.cache[require.resolve(path)];
  const button = require(path);
  if (button) return button({ client, inter, customId, queue });
}