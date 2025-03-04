// handler/builders.js
function initBuilders(client) {
    client.buildEmbed = require("../util/embed.js");
    client.buildButton = require("../util/button.js").buildButton;
    client.pager = require("../util/pager.js");
  }
  
  module.exports = { initBuilders };
  