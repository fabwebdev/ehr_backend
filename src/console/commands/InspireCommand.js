import { Command } from "commander";

class InspireCommand {
  constructor() {
    this.command = new Command("inspire");
    this.configureCommand();
  }

  configureCommand() {
    this.command.description("Display an inspiring quote").action(() => {
      const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Stay hungry, stay foolish. - Steve Jobs",
        "Life is what happens to you while you're busy making other plans. - John Lennon",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "It does not matter how slowly you go as long as you do not stop. - Confucius",
        "Everything you've ever wanted is on the other side of fear. - George Addair",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The only impossible journey is the one you never begin. - Tony Robbins",
        "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
      ];

      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      console.log(randomQuote);
    });
  }

  getCommand() {
    return this.command;
  }
}

export default InspireCommand;
