import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "autoplay",
    {
        description: {
            content: "cmd.autoplay",
            examples: ["autoplay"],
            usage: "autoplay",
        },
        aliases: ["ap"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player) {
            embed.setDescription(client.locale(guild, "error.no_player")).setColor(client.color.red);
            return await message.channel.send({ embeds: [embed] });
        }

        const autoplayEnabled = player.get<boolean>("autoplay");
        player.set("autoplay", !autoplayEnabled);

        const statusMessage = client.locale(guild, autoplayEnabled ? "success.autoplay_off" : "success.autoplay_on");

        embed.setDescription(`✅ | ${statusMessage}`).setColor(client.color.main);

        await message.channel.send({ embeds: [embed] });
    },
);
