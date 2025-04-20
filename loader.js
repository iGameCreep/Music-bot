const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const { Translate } = require("./process_tools");

const player = useMainPlayer();

client.commands = new Collection();
const commandsArray = [];

const discordEvents = readdirSync("./events/Discord/").filter((file) =>
  file.endsWith(".js")
);
const playerEvents = readdirSync("./events/Player/").filter((file) =>
  file.endsWith(".js")
);

for (const file of discordEvents) {
  const discordEvent = require(`./events/Discord/${file}`);

  parseLog(`< -> > [Loaded Discord Event] <${file.split(".")[0]}>`);

  client.on(file.split(".")[0], discordEvent.bind(null, client));
  delete require.cache[require.resolve(`./events/Discord/${file}`)];
}

for (const file of playerEvents) {
  const playerEvent = require(`./events/Player/${file}`);

  parseLog(`< -> > [Loaded Player Event] <${file.split(".")[0]}>`);

  player.events.on(file.split(".")[0], playerEvent.bind(null));
  delete require.cache[require.resolve(`./events/Player/${file}`)];
}

readdirSync("./commands/").forEach((dir) => {
  const commands = readdirSync(`./commands/${dir}`).filter((files) =>
    files.endsWith(".js")
  );

  for (const file of commands) {
    const command = require(`./commands/${dir}/${file}`);

    if (command.name && command.description) {
      commandsArray.push(command);

      parseLog(`< -> > [Loaded Command] <${command.name.toLowerCase()}>`);

      client.commands.set(command.name.toLowerCase(), command);
      delete require.cache[require.resolve(`./commands/${dir}/${file}`)];
    } else {
      parseLog(`< -> > [Failed Command] <${command.name.toLowerCase()}>`);
    }
  }
});

client.on("ready", (client) => {
  if (client.config.app.global) {
    client.application.commands.set(commandsArray);
  } else {
    const guild = client.guilds.cache.get(client.config.app.guild);
    guild.commands.set(commandsArray);
  }
});

async function parseLog(txtEvent) {
  console.log(await Translate(txtEvent, null));
}