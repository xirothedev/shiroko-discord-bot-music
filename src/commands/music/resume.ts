import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "resume",
    {
        description: {
            content: "desc.resume",
            examples: ["resume"],
            usage: "resume",
        },
        aliases: ["r", "continue"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message) => {
        const player = client.manager.getPlayer(message.guildId);

        if (!player) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color.red)
                        .setDescription(client.locale(guild, "error.no_player ")),
                ],
            });
        }

        if (!player.paused) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor(client.color.red).setDescription(client.locale(guild, "error.resumed"))],
            });
        }

        await player.resume();
        return message.react(client.emoji.done);
    },
);
