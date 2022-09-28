const fs = require("fs");
const papa = require("papaparse");

const domains3Percent = papa.parse(
  fs.readFileSync("raw_data/3p_domains.csv", {
    encoding: "utf-8",
  }),
  {
    header: true,
  }
).data;

const data = fs.readFileSync("raw_data/sql_req.json", { encoding: "utf-8" });

const countryData = fs.readFileSync("clean_company_data_all.json", {
  encoding: "utf-8",
});

const objects = JSON.parse(data);

let swissPages = [
  "https://20min.ch",
  "https://9gag.com",
  "https://Admin.ch",
  "https://Aliexpress.com",
  "https://Amazon.com",
  "https://Amazon.de",
  "https://Bing.com",
  "https://Blick.ch",
  "https://Bluewin.ch",
  "https://Booking.com",
  "https://Digitec.ch",
  "https://Facebook.com",
  "https://Fandom.com",
  "https://Galaxus.ch",
  "https://Github.com",
  "https://Google.ch",
  "https://Google.com",
  "https://Instagram.com",
  "https://Linkedin.com",
  "https://Live.com",
  "https://Microsoft.com",
  "https://Netflix.com",
  "https://Office.com",
  "https://Paypal.com",
  "https://Post.ch",
  "https://Reddit.com",
  "https://Ricardo.ch",
  "https://Rts.ch",
  "https://Sbb.ch",
  "https://Srf.ch",
  "https://Stackoverflow.com",
  "https://Swisscom.ch",
  "https://Tiktok.com",
  "https://Tutti.ch",
  "https://Twitch.tv",
  "https://Twitter.com",
  "https://Watson.ch",
  "https://Whatsapp.com",
  "https://Yahoo.com",
  "https://Youtube.com",
  "https://Zoom.us",
];

let altPages = [
  "https://auf1.tv/",
  "https://de.news-front.info/",
  "https://journalistenwatch.com/",
  "https://nuoflix.de/",
  "https://report24.news/",
  "https://uncutnews.ch/",
  "https://www.compact-online.de/",
  "https://www.info-direkt.eu/",
  "https://www.unzensuriert.at/",
  "https://www.wochenblick.at/",
  "https://zeitpunkt.ch/",
];

let schwaigerPages = [
  "https://achgut.com",
  "https://addendum.org",
  "https://adpunktum.de",
  "https://alles-schallundrauch.blogspot.com",
  "https://allesroger.at",
  "https://alpenparlament.tv",
  "https://alpenschau.com",
  "https://alternativreport.de",
  "https://alternativemedien.online",
  "https://alternativepresseschau.wordpress.com",
  "https://anderweltonline.com",
  "https://anonymousnews.ru",
  "https://antikrieg.com",
  "https://antilobby.wordpress.com",
  "https://aufgewachter.wordpress.com",
  "https://austrianetz.com",
  "https://bachheimer.com",
  "https://pressecop24.com",
  "https://berliner-express.com",
  "https://berlinjournal.biz",
  "https://bewusst.tv",
  "https://bildblog.de",
  "https://blauenarzisse.de",
  "https://cashkurs.com",
  "https://cicero.de",
  "https://compact-online.de",
  "https://contramagazin.com",
  "https://daslamm.ch",
  "https://ddbnews.wordpress.com",
  "https://de.europenews.dk",
  "https://de.news-front.info",
  "https://de.sott.net",
  "https://de.sputniknews.com",
  "https://denken-macht-frei.info",
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
  "https://erstaunlich.at",
  "https://exomagazin.tv",
  "https://expresszeitung.com",
  "https://exsuscitati.wordpress.com",
  "https://extremnews.com",
  "https://faktum-magazin.de",
  "https://ffd365.de",
  "https://fischundfleisch.com",
  "https://fk-un.de",
  "https://free21.org",
  "https://freebsdler-unglaubliches.blogspot.com",
  "https://freie-medien.tv",
  "https://freie-presse.net",
  "https://freie-welt.eu",
  "https://freie-nachrichten.de",
  "https://freiesicht.org",
  "https://freiewelt.net",
  "https://freitum.de",
  "https://gegenargument.at",
  "https://gegenfrage.com",
  "https://geolitico.de",
  "https://german-foreign-policy.com",
  "https://graswurzel.net",
  "https://halle-leaks.de",
  "https://hintergrund.de",
  "https://info-direkt.eu",
  "https://infosperber.ch",
  "https://internetz-zeitung.eu",
  "https://journal21.ch",
  "https://journalistenwatch.com",
  "https://jungefreiheit.de",
  "https://jungewelt.de",
  "https://kenfm.de",
  "https://kla.tv",
  "https://konkret-magazin.de",
  "https://kontrast.at",
  "https://kopp-report.de",
  "https://kraftzeitung.net",
  "https://krautreporter.de",
  "https://krisenfrei.com",
  "https://kf.neopresse.com",
  "https://kritischeperspektive.com",
  "https://legitim.ch",
  "https://links-netz.de",
  "https://linksnet.de",
  "https://lobbycontrol.de",
  "https://menschenzeitung.de",
  "https://mietspiegelnews.com",
  "https://mosaik-blog.at",
  "https://nachdenkseiten.de",
  "https://neopresse.com",
  "https://netkompakt.de",
  "https://netzfrauen.org",
  "https://news.feed-reader.net",
  "https://news2day.net",
  "https://newsde.eu",
  "https://newskritik.com",
  "https://newstopaktuell.wordpress.com",
  "https://ngo-online.de",
  "https://noch.info",
  "https://novo-argumente.com",
  "https://npr.news.eulu.info",
  "https://nrhz.de",
  "https://nuoviso.tv",
  "https://oesterreich.press",
  "https://pappenheim-aktuell.com",
  "https://perspective-daily.de",
  "https://peymani.de",
  "https://philosophia-perennis.com",
  "https://pi-news.net",
  "https://politaia.org",
  "https://politikstube.com",
  "https://politikversagen.net",
  "https://politnews.org",
  "https://politonline.ch",
  "https://pravda-tv.com",
  "https://preussischeranzeiger.de",
  "https://propagandafront.de",
  "https://propagandaschau.wordpress.com",
  "https://publicomag.com",
  "https://qpress.de",
  "https://quer-denken.tv",
  "https://quotenqueen.wordpress.com",
  "https://radio-utopie.de",
  "https://republik.ch",
  "https://rf-news.de",
  "https://roteanneliese.ch",
  "https://rubikon.news",
  "https://sachsen-depesche.de",
  "https://scharf-links.de",
  "https://schweizerzeit.ch",
  "https://sezession.de",
  "https://smopo.ch",
  "https://tagesstimme.com",
  "https://tagnews.de",
  "https://telepolis.de",
  "https://terra-kurier.de",
  "https://terraherz.wordpress.com",
  "https://theeuropean.de",
  "https://theintelligence.de",
  "https://tichyseinblick.de",
  "https://topzeitung.com",
  "https://trend.infopartisan.net",
  "https://truth24.net",
  "https://uebermedien.de",
  "https://un-vogtland.de",
  "https://uncut-news.ch",
  "https://ungeheuerliches.de",
  "https://unser-mitteleuropa.com",
  "https://unsere-zeit.de",
  "https://unsere-zeitung.at",
  "https://unzensuriert.at",
  "https://unzensuriert.de",
  "https://volksverpetzer.de",
  "https://votum1.de",
  "https://wakenews.net",
  "https://watergate.tv",
  "https://welt-im-wandel.tv",
  "https://weltnetz.tv",
  "https://weltwoche.ch",
  "https://wochenblick.at",
  "https://yoice.net",
  "https://zaronews.world",
  "https://zeit-zum-aufwachen.blogspot.com",
  "https://zensiertevideos.de",
  "https://zuercherin.com",
  "https://zuerst.de",
  "https://zurzeit.at",
];

let swiss = objects.filter((o) => {
  return swissPages.includes(o.page);
});

let alt = objects.filter((o) => {
  return altPages.includes(o.page);
});

let schwaiger = objects.filter((o) => {
  return schwaigerPages.includes(o.page);
});

let parsed = parseSQL(objects);
let parsedSwiss = parseSQL(swiss);
let parsedAlt = parseSQL(alt);
let parsedSchwaiger = parseSQL(schwaiger);

let types = parseTypes(parsed);
let typesSwiss = parseTypes(parsedSwiss);
let typesAlt = parseTypes(parsedAlt);
let typesSchwaiger = parseTypes(parsedSchwaiger);

let domains = parseDomains(parsed);
let domainsSwiss = parseDomains(parsedSwiss);
let domainsAlt = parseDomains(parsedAlt);
let domainsSchwaiger = parseDomains(parsedSchwaiger);

let domainPercentages = parseDomainPercentages(objects);
let domainPercentagesSwiss = parseDomainPercentages(swiss);
let domainPercentagesAlt = parseDomainPercentages(alt);
let domainPercentagesSchwaiger = parseDomainPercentages(schwaiger);

let network = parseNetwork(parsed);
let networkSwiss = parseNetwork(parsedSwiss);
let networkAlt = parseNetwork(parsedAlt);
let networkSchwaiger = parseNetwork(parsedSchwaiger);

let hierarchy = parseHierarchy(parsed);

writeFile(types, "parsed/types_all");
writeFile(typesSwiss, "parsed/types_swiss");
writeFile(typesAlt, "parsed/types_alt");
writeFile(typesSchwaiger, "parsed/types_schwaiger");

writeFile(domains, "parsed/domains_all");
writeFile(domainsSwiss, "parsed/domains_swiss");
writeFile(domainsAlt, "parsed/domains_alt");
writeFile(domainsSchwaiger, "parsed/domains_schwaiger");

writeFile(domainPercentages, "parsed/domainPercentages");
writeFile(domainPercentagesSwiss, "parsed/domainPercentagesSwiss");
writeFile(domainPercentagesAlt, "parsed/domainPercentagesAlt");
writeFile(domainPercentagesSchwaiger, "parsed/domainPercentagesSchwaiger");

writeFile(network, "parsed/network_all");
writeFile(networkSwiss, "parsed/network_swiss");
writeFile(networkAlt, "parsed/network_alt");
writeFile(networkSchwaiger, "parsed/network_schwaiger");

function parseSQL(objects) {
  let dataMap = new Map();

  for (let object of objects) {
    let key = object.page;
    if (!dataMap.has(key)) {
      dataMap.set(key, []);
    }
    dataMap.get(key).push(object);
  }

  let result = {};
  dataMap.forEach((val, key) => {
    key = formatPageName(key);
    const entries = val.map((entry) => {
      const { id, page, ...rest } = entry;
      return rest;
    });
    result[key] = entries;
  });

  for (let page in result) {
    let thirdPartyMap = new Map();
    for (let request of result[page]) {
      if (!thirdPartyMap.has(request.third_party_domain)) {
        thirdPartyMap.set(request.third_party_domain, []);
      }
      thirdPartyMap.get(request.third_party_domain).push(request);
    }

    const thirdParties = {};
    thirdPartyMap.forEach((val, key) => {
      const entries = val.map((entry) => {
        const { third_party_domain, ...rest } = entry;
        return rest;
      });
      thirdParties[key] = entries;
    });

    result[page] = thirdParties;
  }
  return result;
}

function parseTypes(parsed) {
  parsed = JSON.parse(JSON.stringify(parsed));
  for (let page in parsed) {
    for (let domain in parsed[page]) {
      parsed[page][domain] = parsed[page][domain].map((entry) => {
        const { country, owner, ...rest } = entry;
        return rest;
      });
    }
  }
  return parsed;
}

function calcDomainPercentages(objects) {
  const pagesAndDomains = [];
  const pages = [];
  const percentages = [];
  for (let o of objects) {
    if (!pages.find((p) => p == o.page)) {
      pages.push(o.page);
    }
  }
  for (let o of objects) {
    if (
      !pagesAndDomains.find(
        (pad) => pad.page == o.page && pad.domain == o.third_party_domain
      )
    ) {
      pagesAndDomains.push({
        page: o.page,
        domain: o.third_party_domain,
      });
    }
  }
  for (let pad of pagesAndDomains) {
    let foundEntry = percentages.find((p) => p.domain == pad.domain);
    if (!foundEntry) {
      foundEntry = {
        domain: pad.domain,
        count: 0,
        percentage: 0,
      };
      percentages.push(foundEntry);
    }
    foundEntry.count++;
  }
  for (let percentage of percentages) {
    percentage.percentage =
      Math.round((1 / pages.length) * percentage.count * 10000) / 100;
  }
  return percentages;
}

function parseDomainPercentages(objects) {
  let calculatedPercentages = calcDomainPercentages(objects);
  for (let cP of calculatedPercentages) {
    let foundObject = objects.find((o) => o.third_party_domain == cP.domain);
    if (foundObject) {
      cP.owner = foundObject.owner;
      cP.country = foundObject.country;
    }
  }

  let domainPercentages = [];
  for (let cP of calculatedPercentages) {
    let foundDomain = domainPercentages.find((d) => d.name == cP.percentage);
    if (!foundDomain) {
      foundDomain = {
        name: cP.percentage,
        thirdParties: [],
      };
      domainPercentages.push(foundDomain);
    }
    let requestDomain = cP.domain;
    let owner = getOwner(cP.domain);
    let ownerCountry = cP.country;
    foundDomain.thirdParties.push({
      requestDomain: requestDomain,
      owner: owner,
      ownerCountry: ownerCountry,
    });
  }
  domainPercentages = domainPercentages.filter((d) => d.name != "");
  return domainPercentages.sort((a, b) => b.name - a.name);
}

function getOwner(page) {
  let domain = domains3Percent.find((domain) => {
    return domain.domain == page;
  });
  if (domain) {
    if (domain.owner == "") {
      return undefined;
    }
    return domain.owner;
  }
  return undefined;
}

function parseDomains(parsed) {
  let resultDomains = [];
  for (let page in parsed) {
    let domains = {
      name: page,
      thirdParties: [],
    };
    for (let domain in parsed[page]) {
      let ownerCountry = undefined;
      if (parsed[page][domain][0].country) {
        ownerCountry = parsed[page][domain][0].country;
      }
      let singleDomain = {
        requestDomain: domain,
        owner: parsed[page][domain][0].owner,
        ownerCountry: ownerCountry,
        ownerLineage: getOwnerLineage(domain),
      };
      domains.thirdParties.push(singleDomain);
    }
    resultDomains.push(domains);
  }
  return resultDomains;
}

function getOwnerLineage(page) {
  let domain = domains3Percent.find((domain) => {
    return domain.domain == page;
  });
  if (domain) {
    if (domain.owner_lineage == "") {
      return undefined;
    }
    return domain.owner_lineage;
  }
  return undefined;
}

function parseNetwork(parsed) {
  const network = {
    nodes: [],
    links: [],
  };

  let pageId = 0;

  for (let page in parsed) {
    pageNode = {
      id: pageId,
      name: formatPageName(page),
      count: 0,
      country: "",
    };

    pageId++;

    network.nodes.push(pageNode);
  }

  let nodeId = 100;
  let linkId = 0;

  for (let page in parsed) {
    let pageNode = network.nodes.find(
      (node) => node.name === formatPageName(page)
    );

    for (let domain in parsed[page]) {
      let node;
      let country = undefined;
      if (parsed[page][domain][0]["country"]) {
        country = parsed[page][domain][0]["country"];
      }
      if (!nodeExists(network, domain)) {
        node = {
          id: nodeId,
          name: domain,
          count: 0,
          country: country,
        };
      } else {
        node = network.nodes.find((node) => node.name === domain);
      }
      let link = {
        source: pageNode.id,
        target: node.id,
        id: linkId,
        name: domain,
        requestData: [],
      };
      for (let request in parsed[page][domain]) {
        let requestData = parsed[page][domain][request];
        link.requestData.push({
          extension: requestData.extension,
          type: requestData.type,
          size: requestData.size,
        });
      }
      network.links.push(link);
      if (!nodeExists(network, domain)) {
        network.nodes.push(node);
        nodeId++;
      }
      linkId++;
    }
  }

  calculateNodeCount(network);

  getNodeCountries(network);

  network.nodes = network.nodes.sort((a, b) => {
    return a.id - b.id;
  });
  return network;
}

function parseHierarchy(parsed) {
  let hierarchy = {
    name: "hierarchy",
    value: 100,
    children: [{ name: "all categories", value: 0, children: [] }],
  };
}

function writeFile(data, filePath, fileEnding = "") {
  let fullPath = filePath;
  if (fileEnding != "") {
    fullPath += "." + fileEnding;
  }
  fs.writeFile(fullPath, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
    }
    // console.log("success saving to " + fullPath);
    // file written successfully
  });
}

function formatPageName(key) {
  if (key.indexOf("https://") != -1) {
    key = key.substr(8).toLowerCase();
  }
  if (key.indexOf("http://") != -1) {
    key = key.substr(7).toLowerCase();
  }
  if (key.lastIndexOf("/") == key.length - 1) {
    key = key.substr(0, key.length - 1);
  }
  if (key.indexOf("www.") == 0) {
    key = key.substr(4);
  }
  return key;
}

function nodeExists(network, domain) {
  return (
    network.nodes.filter((node) => {
      return node.name === domain;
    }).length > 0
  );
}

function calculateNodeCount(network) {
  for (let node of network.nodes) {
    let count = network.links.filter((link) => {
      return link.source === node.id || link.target === node.id;
    }).length;
    node.count = count;
  }
}

function getNodeCountries(network) {
  let countries = JSON.parse(countryData);

  for (let node of network.nodes) {
    let object = objects.find(
      (object) => object.third_party_domain == node.name
    );
    if (object) {
      node.country = object.country;
    }
    if (node.country == "" || node.country == null) {
      node.country = undefined;
    }
    if (countries["https://" + node.name]) {
      node.country = countries["https://" + node.name]["countryCode"];
    }
    if (countries["https://" + node.name + " "]) {
      node.country = countries["https://" + node.name + " "]["countryCode"];
    }
  }
}
