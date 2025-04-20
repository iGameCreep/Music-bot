const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
  name: 'nowplaying',
  description: 'See what song is currently playing!',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild);
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

    const track = queue.currentTrack;
    const methods = ['disabled', 'track', 'queue'];
    const timestamp = track.duration;
    const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;
    const progress = queue.node.createProgressBar();

    let emojisEnabled = client.config?.emojis ? client.config.app.enableEmojis : false;

    const embed = new EmbedBuilder()
      .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
      .setThumbnail(track.thumbnail)
      .setDescription(await Translate(`Volume <**${queue.node.volume}**%> <\n> <Duration **${trackDuration}**> <\n> Progress <${progress}> <\n >Loop mode <**${methods[queue.repeatMode]}**> <\n>Requested by <${track.requestedBy}>`))
      .setFooter({ text: await Translate('Music comes first - Made with heart by the Community <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })
      .setColor('#2f3136')
      .setTimestamp();

    const saveButton = new ButtonBuilder()
      .setLabel(emojisEnabled ? emojis.savetrack : ('Save this track'))
      .setCustomId('savetrack')
      .setStyle('Danger');

    const volumeup = new ButtonBuilder()
      .setLabel(emojisEnabled ? emojis.volumeUp : ('Volume Up'))
      .setCustomId('volumeup')
      .setStyle('Primary');

    const volumedown = new ButtonBuilder()
      .setLabel(emojisEnabled ? emojis.volumeDown : ('Volume Down'))
      .setCustomId('volumedown')
      .setStyle('Primary');

    const loop = new ButtonBuilder()
      .setLabel(emojisEnabled ? emojis.loop : ('Loop'))
      .setCustomId('loop')
      .setStyle('Danger');

    const resumepause = new ButtonBuilder()
      .setLabel(emojisEnabled ? emojis.ResumePause : ('Resume <&> Pause'))
      .setCustomId('resume&pause')
      .setStyle('Success');

    const row = new ActionRowBuilder().addComponents(volumedown, resumepause, volumeup, loop, saveButton);
    inter.editReply({ embeds: [embed], components: [row] });
  }
}
