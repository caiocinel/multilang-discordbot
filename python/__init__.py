import discord
from discord import app_commands
import json

config = json.loads(open("config.json", "r").read())

if(config['token'] == ''):
    print("Please enter a token in config.json")
    exit()

if(config['guild'] == 0):
    print("Please enter a guild id in config.json")
    exit()


class Client(discord.Client):
    def __init__(self):
        super().__init__(intents=discord.Intents.all())
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        self.tree.copy_global_to(guild=discord.Object(id=config['guild']))
        await self.tree.sync(guild=discord.Object(id=config['guild']))

client = Client()


@client.event
async def on_ready():
    print(f'Auth ID: {client.user.id})')

@client.tree.command()
@app_commands.rename(text_to_send='text')
@app_commands.describe(text_to_send='Send message from BOT account')
async def send(interaction: discord.Interaction, text_to_send: str):
    await interaction.response.send_message(text_to_send)

client.run(config['token'])