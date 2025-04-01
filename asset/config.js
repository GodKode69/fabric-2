// asset/config.js

module.exports = {
  token:
    "", // Your Discord bot toke
  clientId: "1226510987407130624", // Your Discord application's client ID
  prefix: "-", // Default prefix for commands
  mongoURI:
    "mongodb+srv://godkode:noprefix@cluster0.mmfongd.mongodb.net/?retryWrites=true&w=majorit", // Your MongoDB connection URI
  owner: "761102755107438594", // Bot owner's Discord ID
  lavalink: [
    {
      name: "Jirayu Node",
      url: "lavalink.jirayu.net:13592",
      auth: "youshallnotpass",
      secure: false,
    },
    /*{
      name: "Ajie Dev Node",
      url: "lava-v4.ajieblogs.eu.org:80", // host:port format
      auth: "https://dsc.gg/ajidevserver",
      secure: false,
    },
    {
      name: "Alya Node",
      url: "lavalink.alya-project.me:2333",
      auth: "https://alya-project.me/",
      secure: false,
    },
    {
      name: "Catfein US Node",
      url: "lava-us.catfein.co.id:5000",
      auth: "catfein",
      secure: false,
    },
    {
      name: "Catfein SG Node",
      url: "lava-sg.catfein.co.id:5000",
      auth: "catfein",
      secure: false,
    },*/
  ],
  spotify: {
    clientId: "7b9f0aeabd3f485ab19027c516ae2c8f",
    clientSecret: "222507c6638b4244a4856c0ddf8a3d66",
  },
};
