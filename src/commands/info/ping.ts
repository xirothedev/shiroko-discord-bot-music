import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "ping",
    {
        description: {
            content: "desc.ping",
            examples: ["ping"],
            usage: "ping",
        },
        aliases: ["pong"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, guild, user, message, args) => {
        const msg = await message.channel.send(client.locale(guild, "ping.checking"));

        const botLatency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const botLatencySign = botLatency < 600 ? "+" : "-";
        const apiLatencySign = apiLatency < 500 ? "+" : "-";

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Pong",
                iconURL: client.user?.displayAvatarURL(),
            })
            .setColor(client.color.main)
            .addFields([
                {
                    name: client.locale(guild, "ping.bot_latency"),
                    value: `\`\`\`diff\n${botLatencySign} ${botLatency}ms\n\`\`\``,
                    inline: true,
                },
                {
                    name: client.locale(guild, "ping.api_latency"),
                    value: `\`\`\`diff\n${apiLatencySign} ${apiLatency}ms\n\`\`\``,
                    inline: true,
                },
            ])
            .setFooter({
                text: `@${message.author.username}`,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp();

        return await msg.edit({ content: "", embeds: [embed] });
    },
);
