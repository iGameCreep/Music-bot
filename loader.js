const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const { Translate, GetTranslationModule } = require("./process_tools");

const player = useMainPlayer();

client.commands = new Collection();
const commandsArray = [];

const discordEvents = readdirSync("./events/Discord/").filter((file) =>
  file.endsWith(".js")
);
const playerEvents = readdirSync("./events/Player/").filter((file) =>
  file.endsWith(".js")
);

GetTranslationModule().then(() => {
  console.log("| Translation Module Loaded |");

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

  readdirSync("./commands/").forEach((dirs) => {
    const commands = readdirSync(`./commands/${dirs}`).filter((files) =>
      files.endsWith(".js")
    );

    for (const file of commands) {
      const command = require(`./commands/${dirs}/${file}`);
      if (command.name && command.description) {
        commandsArray.push(command);
        parseLog(`< -> > [Loaded Command] <${command.name.toLowerCase()}>`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
      } else {
        parseLog(`< -> > [Failed Command] <${command.name.toLowerCase()}>`);
      }
    }
  });

  client.on("ready", (client) => {
    if (client.config.app.global)
      client.application.commands.set(commandsArray);
    else
      client.guilds.cache
        .get(client.config.app.guild)
        .commands.set(commandsArray);
  });

  async function parseLog(txtEvent) {
    console.log(await Translate(txtEvent, null));
  }
});