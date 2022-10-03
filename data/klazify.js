const axios = require("axios");
const fs = require("fs");

urls = [
  "http://antikrieg.com",
  "http://austrianetz.com",
  "http://berliner-express.com",
  "http://bewusst.tv",
  "http://de.europenews.dk",
  "http://denken-macht-frei.info",
  "http://erstaunlich.at",
  "http://exomagazin.tv",
  "http://faktum-magazin.de",
  "http://ffd365.de",
  "http://fk-un.de",
  "http://free21.org",
  "http://freie-medien.tv",
  "http://freie-nachrichten.de",
  "http://freitum.de",
  "http://gegenargument.at",
  "http://gegenfrage.com",
  "http://german-foreign-policy.com",
  "http://journal21.ch",
  "http://jungefreiheit.de",
  "http://jungewelt.de",
  "http://kenfm.de",
  "http://kraftzeitung.net",
  "http://kritischeperspektive.com",
  "http://links-netz.de",
  "http://mietspiegelnews.com",
  "http://netkompakt.de",
  "http://news2day.net",
  "http://noch.info",
  "http://nrhz.de",
  "http://oesterreich.press",
  "http://pappenheim-aktuell.com",
  "http://politonline.ch",
  "http://propagandafront.de",
  "http://quer-denken.tv",
  "http://roteanneliese.ch",
  "http://rubikon.news",
  "http://scharf-links.de",
  "http://trend.infopartisan.net",
  "http://truth24.net",
  "http://ungeheuerliches.de",
  "http://unsere-zeit.de",
  "http://volksverpetzer.de",
  "http://votum1.de",
  "https://achgut.com",
  "https://addendum.org",
  "https://adpunktum.de",
  "https://alles-schallundrauch.blogspot.com",
  "https://alpenparlament.tv",
  "https://alpenschau.com",
  "https://alternativepresseschau.wordpress.com",
  "https://anderweltonline.com",
  "https://anonymousnews.ru",
  "https://antilobby.wordpress.com",
  "https://aufgewachter.wordpress.com",
  "https://bachheimer.com",
  "https://berlinjournal.biz",
  "https://bildblog.de",
  "https://blauenarzisse.de",
  "https://cashkurs.com",
  "https://cicero.de",
  "https://compact-online.de",
  "https://daslamm.ch",
  "https://ddbnews.wordpress.com",
  "https://de.news-front.info",
  "https://de.sott.net",
  "https://derfunke.at",
  "https://derwaechter.net",
  "https://deutsch.rt.com",
  "https://deutsche-mittelstands-nachrichten.de",
  "https://deutsche-wirtschafts-nachrichten.de",
  "https://deutschelobby.com",
  "https://deutschlandkurier.de",
  "https://diefreiemeinung.de",
  "https://dieunbestechlichen.com",
  "https://dossier.at",
  "https://ef-magazin.de",
  "https://eingeschenkt.tv",
  "https://einprozent.de",
  "https://epochtimes.de",
  "https://expresszeitung.com",
  "https://exsuscitati.wordpress.com",
  "https://extremnews.com",
  "https://fischundfleisch.com",
  "https://freebsdler-unglaubliches.blogspot.com",
  "https://freie-presse.net",
  "https://freie-welt.eu",
  "https://freiesicht.org",
  "https://freiewelt.net",
  "https://geolitico.de",
  "https://graswurzel.net",
  "https://hintergrund.de",
  "https://info-direkt.eu",
  "https://internetz-zeitung.eu",
  "https://journalistenwatch.com",
  "https://kf.neopresse.com",
  "https://kla.tv",
  "https://konkret-magazin.de",
  "https://kontrast.at",
];

api =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGUyMDNmNTgwMmExZmZjNTllMjllZGIyOGJlZmUwNGI0YzUxZGY3MzU1MzYyNzkzNzAzYTMzNThjOGNlMTJiNzdmMzk0YWM4Yjk3OTcwYTIiLCJpYXQiOjE2NjQ3ODU5OTksIm5iZiI6MTY2NDc4NTk5OSwiZXhwIjoxNjk2MzIxOTk5LCJzdWIiOiI3NzE5Iiwic2NvcGVzIjpbXX0.D1gaWdFMwirYP1uQviTjJQFHj7ahpzDO9_A2cksc4hvr1j-6GTJKAjLwKCZRMhRlRtFu9iMOl-yg0a6yca_nYw";

fullList = {};
promises = [];

urls.forEach((url) => {
  settings = {
    async: true,
    crossDomain: true,
    url: "https://www.klazify.com/api/categorize",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${api}`,
      "cache-control": "no-cache",
    },
    processData: false,
    data: `{"url":"${url}"}\n`,
  };
  promises.push(
    axios(settings).then((response) => {
      fullList[url] = response.data;
    })
  );
});

// Promise.all(promises).then(() => {
//   console.log("promises", promises);
//   fs.writeFileSync("parsed/klazify_data_all.json", JSON.stringify(fullList), {
//     encoding: "utf8",
//   });
// });
