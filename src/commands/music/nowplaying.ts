import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import type { Requester } from "@/typings/player";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "nowplaying",
    {
        description: {
            content: "desc.nowplaying",
            examples: ["nowplaying"],
            usage: "nowplaying",
        },
        aliases: ["np"],
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
        const track = player.queue.current;

        const embed = new EmbedBuilder().setColor(client.color.main);

        if (!track) {
            embed
                .setColor(client.color.red)
                .setDescription(T(guild.language, "error.player.no_track_playing"));
            return await message.channel.send({ embeds: [embed] });
        }

        const position = player.position;
        const duration = track.info.duration;
        const bar = client.utils.progressBar(position, duration, 20);
        const requesterId = (track.requester as Requester).id;

        embed
            .setAuthor({
                name: T(guild.language, "use_many.player.playing"),
                iconURL: message.guild.iconURL()!,
            })
            .setThumbnail(track.info.artworkUrl)
            .setDescription(
                `[${track.info.title}](${track.info.uri}) - ${T(guild.language, "use_many.request_by")}: <@${requesterId}>\n\n\`${bar}\``,
            )
            .addFields({
                name: "\u200b",
                value: `\`${client.utils.formatTime(position)} / ${client.utils.formatTime(duration)}\``,
            });

        return await message.channel.send({ embeds: [embed] });
    },
);
