const { EmbedBuilder } = require('discord.js');
module.exports = async ({ client, inter, queue }) => { 
    if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });

    queue.delete();

    const StopEmbed = new EmbedBuilder()
    .setColor('#2f3136')
    .setAuthor({name: `Music stopped by ${inter.member.user.username} into this server, see you next time ✅`, iconURL: inter.member.user.displayAvatarURL() })


       return inter.reply({ embeds: [StopEmbed], ephemeral: true });

}