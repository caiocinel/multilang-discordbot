import Discord, { SlashCommandBuilder } from "discord.js";
export const client = new Discord.Client({ intents: 7796 });
import fs from "fs";
import path from "path";
import { parse } from "json-bigint";
const config: { token: string, guild: bigint, client: bigint } = parse(fs.readFileSync(path.join(__dirname, "../config.json"), "utf-8"));

if (config.token == "") {
  console.log("Please enter a token in config.json");
  process.exit();

}

if (config.guild == BigInt(0)) {
  console.log("Please enter a guild id in config.json");
  process.exit();
}

client.once("ready", (e) => {
  console.log(`Auth ID: ${e.user.id}`);
});

(async () => {
  const rest = new Discord.REST().setToken(config.token);
  await rest.put(
    Discord.Routes.applicationGuildCommands(config.client.toString(), config.guild.toString()),   //
    {
      body: [new SlashCommandBuilder()
        .setName("send")
        .setDescription("Send message from BOT account")
        .addStringOption(option =>
          option.setName("text").setDescription("Text to send").setRequired(true)
        ).toJSON()]
    }
  );
})();

client.on(Discord.Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  await interaction.reply(interaction.options.getString("text"));
});



client.login(config.token);