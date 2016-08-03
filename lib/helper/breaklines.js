UI.registerHelper('breaklines', function(text, options) {
  text = text.replace(/(\r\n|\n|\r)/gm, '<br/>');
  return new Spacebars.SafeString(text);
});
