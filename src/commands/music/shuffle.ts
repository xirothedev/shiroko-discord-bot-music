import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "shuffle",
    {
        description: {
            content: "desc.shuffle",
            examples: ["shuffle"],
            usage: "shuffle",
        },
        aliases: ["sh"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
        ],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);

        if (player.queue.tracks.length === 0) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color.red)
                        .setDescription(T(guild.language, "error.player.no_song_in_queue")),
                ],
            });
        }

        await player.queue.shuffle();
        return await message.react(client.emoji.done);
    },
);
