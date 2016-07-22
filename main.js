getName = function(user) {
  return user.profile.name || user.username;
}
hashStringToColor = function(str) {
  var hash = djb2(str);
  var r = (hash & 0xFF0000) >> 16;
  var g = (hash & 0x00FF00) >> 8;
  var b = hash & 0x0000FF;
  return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
}
djb2 = function(str){
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}
rangeAge = function(birthday) {
  var year = moment().year();
  var age = Math.floor(year - birthday);
  switch (true) {
  case age > 60:
    return "60+";
    break;
  case age > 50:
    return "50-60";
    break;
  case age > 40:
    return "40-50";
    break;
  case age > 35:
    return "35-40";
    break;
  case age > 30:
    return "30-35";
    break;
  case age > 25:
    return "25-30";
    break;
  case age > 20:
    return "20-25";
    break;
  case age > 15:
    return "15-20";
    break;
  case age > 10:
    return "10-15";
    break;
  case age > 5:
    return "5-10";
    break;
  case age <= 5:
    return "0-5";
    break;
  }
}
