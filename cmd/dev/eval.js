module.exports = {
  name: "eval",
  aliases: [""],
  description: "Evaluates the given JavaScript code.",
  usage: "<code>",
  category: "dev",
  args: true,
  owner: true,
  execute: async (client, message, args) => {
    try {
      let code = args.join(" ");

      // **Check if code is wrapped in a code block (` ```js ... ``` `)**
      if (code.startsWith("```") && code.endsWith("```")) {
        code = code.slice(3, -3).trim(); // Remove first & last 3 characters (` ``` `)
        if (code.startsWith("js")) code = code.slice(2).trim(); // Remove `js` if provided
      }

      // **Check if the code is async**
      const isAsync = code.includes("await") || code.includes("return");

      // **Evaluate the code**
      let result;
      if (isAsync) {
        result = await eval(`(async () => { ${code} })()`);
      } else {
        result = eval(code);
      }

      // **Format the result (handle objects & large outputs)**
      if (typeof result !== "string")
        result = require("util").inspect(result, { depth: 1 });

      if (result.length > 1990) result = result.slice(0, 1990) + "..."; // Discord limit

      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            title: "Eval Output",
            description: `\`\`\`js\n${result}\n\`\`\``,
          }),
        ],
      });
    } catch (err) {
      return message.channel.send({
        embeds: [
          client.buildEmbed(client, {
            title: "Eval Error",
            description: `\`\`\`js\n${err.message}\n\`\`\``,
          }),
        ],
      });
    }
  },
};
