import {Client, Message} from 'discord.js';
// @ts-ignore
import {prefix, envTokenKey} from '../config.json'


declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      "DISCORD_TOKEN": string;
    }
  }
}

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  if (message.content.charAt(0) === prefix) {
    handleCommand(message);
  }
});

const handleCommand = (message: Message) => {
  const [command, argsList] = removePrefix(message.content).split(" ");

  console.log(command);
  switch (command) {
    case "help":
      message.channel.send("Help has not been implemented");
      break;
    default:
      message.channel.send("Sorry command not found");
  }
}

const removePrefix = (commandMessage: String) => {
  return commandMessage.substring(prefix.length, commandMessage.length);
}

client.login(DISCORD_TOKEN);