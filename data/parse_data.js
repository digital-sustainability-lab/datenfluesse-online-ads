const fs = require("fs");
const axios = require("axios");
const papa = require("papaparse");

const domains3Percent = papa.parse(
  fs.readFileSync("raw_data/3p_domains.csv", {
    encoding: "utf-8",
  }),
  {
    header: true,
  }
).data;

const companyData = JSON.parse(
  fs.readFileSync("raw_data/klazify_data_all.json", {
    encoding: "utf-8",
  })
);

const cleanCompanyData = parseCleanCompanyData(companyData);

const data = fs.readFileSync("raw_data/sql_req.json", { encoding: "utf-8" });
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
  "https://kopp-report.de",
  "https://krautreporter.de",
  "https://krisenfrei.com",
  "https://legitim.ch",
  "https://linksnet.de",
  "https://lobbycontrol.de",
  "https://menschenzeitung.de",
  "https://mosaik-blog.at",
  "https://nachdenkseiten.de",
  "https://neopresse.com",
  "https://netzfrauen.org",
  "https://news.feed-reader.net",
  "https://newsde.eu",
  "https://newstopaktuell.wordpress.com",
  "https://ngo-online.de",
  "https://novo-argumente.com",
  "https://npr.news.eulu.info",
  "https://nuoviso.tv",
  "https://perspective-daily.de",
  "https://peymani.de",
  "https://philosophia-perennis.com",
  "https://pi-news.net",
  "https://politaia.org",
  "https://politikstube.com",
  "https://politikversagen.net",
  "https://politnews.org",
  "https://pravda-tv.com",
  "https://pressecop24.com",
  "https://propagandaschau.wordpress.com",
  "https://publicomag.com",
  "https://qpress.de",
  "https://quotenqueen.wordpress.com",
  "https://radio-utopie.de",
  "https://republik.ch",
  "https://rf-news.de",
  "https://sachsen-depesche.de",
  "https://schweizerzeit.ch",
  "https://sezession.de",
  "https://tagesstimme.com",
  "https://tagnews.de",
  "https://telepolis.de",
  "https://terra-kurier.de",
  "https://terraherz.wordpress.com",
  "https://theeuropean.de",
  "https://theintelligence.de",
  "https://tichyseinblick.de",
  "https://topzeitung.com",
  "https://uebermedien.de",
  "https://un-vogtland.de",
  "https://uncut-news.ch",
  "https://unser-mitteleuropa.com",
  "https://unsere-zeitung.at",
  "https://unzensuriert.at",
  "https://unzensuriert.de",
  "https://wakenews.net",
  "https://watergate.tv",
  "https://welt-im-wandel.tv",
  "https://weltnetz.tv",
  "https://weltwoche.ch",
  "https://wochenblick.at",
  "https://yoice.net",
  "https://zaronews.world",
  "https://zeit-zum-aufwachen.blogspot.com",
  "https://zuercherin.com",
  "https://zuerst.de",
  "https://zurzeit.at",
  "https://infosperber.ch",
];

let bothPages = JSON.parse(JSON.stringify(swissPages));
bothPages.push(...altPages);

let swiss = objects.filter((o) => {
  return swissPages.includes(o.page);
});

let alt = objects.filter((o) => {
  return altPages.includes(o.page);
});

let schwaiger = objects.filter((o) => {
  return schwaigerPages.includes(o.page);
});

let both = objects.filter((o) => {
  return bothPages.includes(o.page);
});

let parsedBoth = parseSQL(both);
let parsedSwiss = parseSQL(swiss);
let parsedAlt = parseSQL(alt);
let parsedSchwaiger = parseSQL(schwaiger);

let typesBoth = parseTypes(parsedBoth);
let typesSwiss = parseTypes(parsedSwiss);
let typesAlt = parseTypes(parsedAlt);
let typesSchwaiger = parseTypes(parsedSchwaiger);

let domainsBoth = parseDomains(parsedBoth);
let domainsSwiss = parseDomains(parsedSwiss);
let domainsAlt = parseDomains(parsedAlt);
let domainsSchwaiger = parseDomains(parsedSchwaiger);

let domainPercentagesBoth = parseDomainPercentages(both);
let domainPercentagesSwiss = parseDomainPercentages(swiss);
let domainPercentagesAlt = parseDomainPercentages(alt);
let domainPercentagesSchwaiger = parseDomainPercentages(schwaiger);

let networkBoth = parseNetwork(parsedBoth);
let networkSwiss = parseNetwork(parsedSwiss);
let networkAlt = parseNetwork(parsedAlt);
let networkSchwaiger = parseNetwork(parsedSchwaiger);

let companyDataBoth = filterCompanyData(bothPages, companyData);
let companyDataSwiss = filterCompanyData(swissPages, companyData);
let companyDataAlt = filterCompanyData(altPages, companyData);
let companyDataSchwaiger = filterCompanyData(schwaigerPages, companyData);

let hierarchyBoth = parseHierarchy(
  companyDataBoth,
  domainsBoth,
  domainPercentagesBoth
);
let hierarchySwiss = parseHierarchy(
  companyDataSwiss,
  domainsSwiss,
  domainPercentagesSwiss
);
let hierarchyAlt = parseHierarchy(
  companyDataAlt,
  domainsAlt,
  domainPercentagesAlt
);
let hierarchySchwaiger = parseHierarchy(
  companyDataSchwaiger,
  domainsSchwaiger,
  domainPercentagesSchwaiger
);

let categoryColors = assignCategoryColors(cleanCompanyData);

let countryColors = assignCountryColors(parseDomains(parseSQL(objects)));

let cleanCompanyDataBoth = parseCleanCompanyData(companyDataBoth);
let cleanCompanyDataSwiss = parseCleanCompanyData(companyDataSwiss);
let cleanCompanyDataAlt = parseCleanCompanyData(companyDataAlt);
let cleanCompanyDataSchwaiger = parseCleanCompanyData(companyDataSchwaiger);

writeFile(typesBoth, "parsed/both/types_both", "types_both", "ts");
writeFile(typesSwiss, "parsed/swiss/types_swiss", "types_swiss", "ts");
writeFile(typesAlt, "parsed/alt/types_alt", "types_alt", "ts");
writeFile(
  typesSchwaiger,
  "parsed/schwaiger/types_schwaiger",
  "types_schwaiger",
  "ts"
);

writeFile(domainsBoth, "parsed/both/domains_both", "domain_both", "ts");
writeFile(domainsSwiss, "parsed/swiss/domains_swiss", "domain_swiss", "ts");
writeFile(domainsAlt, "parsed/alt/domains_alt", "domain_alt", "ts");
writeFile(
  domainsSchwaiger,
  "parsed/schwaiger/domains_schwaiger",
  "domain_schwaiger",
  "ts"
);

writeFile(networkBoth, "parsed/both/network_both", "network_both", "ts");
writeFile(networkSwiss, "parsed/swiss/network_swiss", "network_swiss", "ts");
writeFile(networkAlt, "parsed/alt/network_alt", "network_alt", "ts");
writeFile(
  networkSchwaiger,
  "parsed/schwaiger/network_schwaiger",
  "network_schwaiger",
  "ts"
);

writeFile(hierarchyBoth, "parsed/both/hierarchy_both", "hierarchy_both", "ts");
writeFile(
  hierarchySwiss,
  "parsed/swiss/hierarchy_swiss",
  "hierarchy_swiss",
  "ts"
);
writeFile(hierarchyAlt, "parsed/alt/hierarchy_alt", "hierarchy_alt", "ts");
writeFile(
  hierarchySchwaiger,
  "parsed/schwaiger/hierarchy_schwaiger",
  "hierarchy_schwaiger",
  "ts"
);

writeFile(
  cleanCompanyDataBoth,
  "parsed/both/category_both",
  "category_both",
  "ts"
);
writeFile(
  cleanCompanyDataSwiss,
  "parsed/swiss/category_swiss",
  "category_swiss",
  "ts"
);
writeFile(cleanCompanyDataAlt, "parsed/alt/category_alt", "category_alt", "ts");
writeFile(
  cleanCompanyDataSchwaiger,
  "parsed/schwaiger/category_schwaiger",
  "category_schwaiger",
  "ts"
);

writeFile(categoryColors, "parsed/category_colors", "category_color", "ts");

writeFile(countryColors, "parsed/country_colors", "country_color", "ts");

function filterCompanyData(pages, companyData) {
  let result = JSON.parse(JSON.stringify(companyData));
  for (let page in result) {
    if (!pages.includes(page)) {
      delete result[page];
    }
  }
  return result;
}

function parseCleanCompanyData(companyData) {
  cleanedObject = {};

  for (const key in companyData) {
    let page = formatPageName(key);
    cleanedObject[page] = {};
    cleanedObject[page].categories = [];
    if (companyData[key].objects) {
      if (companyData[key].objects.company) {
        if (companyData[key].objects.company.name) {
          cleanedObject[page].name = companyData[key].objects.company.name;
        }
        if (companyData[key].objects.company.city) {
          cleanedObject[page].city = companyData[key].objects.company.city;
        }
        if (companyData[key].objects.company.stateCode) {
          cleanedObject[page].stateCode =
            companyData[key].objects.company.stateCode;
        }
        if (companyData[key].objects.company.countryCode) {
          cleanedObject[page].countryCode =
            companyData[key].objects.company.countryCode;
        }
        if (companyData[key].objects.company.employeesRange) {
          cleanedObject[page].employeesRange =
            companyData[key].objects.company.employeesRange;
        }
        if (companyData[key].objects.company.revenue) {
          cleanedObject[page].revenue =
            companyData[key].objects.company.revenue;
        }
        if (companyData[key].objects.company.raised) {
          cleanedObject[page].raised = companyData[key].objects.company.raised;
        }
        if (companyData[key].objects.company.tags) {
          cleanedObject[page].tags = companyData[key].objects.company.tags;
        }
      }
    }
    let allCategories = [];
    let categories = [];
    if (companyData[key].domain) {
      for (const cat of companyData[key].domain.categories) {
        categories = cat.name.split("/");
        categories = [...new Set(categories)];
        categories = categories.filter((el) => el);
        allCategories.push(...categories);
      }
    }
    allCategories = [...new Set(allCategories)];
    cleanedObject[page].categories.push(...allCategories);
  }

  return cleanedObject;
}

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

function parseHierarchy(companyData, domains, domainPercentages) {
  let hierarchy = {
    name: "hierarchy",
    value: 100,
    children: [{ name: "all categories", value: 0, children: [] }],
  };

  for (const key in companyData) {
    hierarchy.children[0].children.push({ name: key, children: [], value: 0 });
    hierarchy.children[0].value += 1;
    if (companyData[key].domain) {
      for (const cats of companyData[key].domain.categories) {
        if (cats.confidence > 0.75) {
          const catsToAdd = cats.name.split("/");
          for (const category of catsToAdd) {
            if (category) {
              let found = hierarchy.children.find(
                (cat) => cat.name == category
              );
              if (!found) {
                hierarchy.children.push({
                  name: category,
                  children: [{ name: key, children: [], value: 0 }],
                  value: 1,
                });
              } else {
                let index = hierarchy.children.indexOf(found);
                let exists = hierarchy.children[index].children.find(
                  (site) => site.name == key
                );
                if (!exists) {
                  hierarchy.children[index].value += 1;
                  hierarchy.children[index].children.push({
                    name: key,
                    children: [],
                    value: 0,
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  for (const element of hierarchy.children) {
    for (const child of element.children) {
      let temp = formatPageName(child.name);
      let name = domains.find((website) => website.name == temp);
      if (name) {
        child.value = name.thirdParties.length;
        child.children = name.thirdParties.map((obj) => {
          let finalValue = 0;
          for (const perc of domainPercentages) {
            let found = perc.thirdParties.find(
              (el) => el.requestDomain == obj.requestDomain
            );
            if (found) {
              finalValue = parseInt(perc.name, 10);
              break;
            }
          }
          if (finalValue) {
            return { name: obj.requestDomain, value: finalValue };
          } else {
            return { name: obj.requestDomain, value: 0 };
          }
        });
      }
    }
  }

  for (let child of hierarchy.children) {
    for (let subChild of child.children) {
      subChild.name = formatPageName(subChild.name);
    }
  }

  return hierarchy;
}

function assignCategoryColors(cleanCompanyData) {
  const colors = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
    "#ffff99",
    "#b15928",
    "#140878",
    "#b400cc",
    "#5c4d5e",
    "#ff00a6",
    "#fff200",
  ];

  let colorCoding = {};

  let counter = 0;

  for (const key in cleanCompanyData) {
    if (!colorCoding.hasOwnProperty(cleanCompanyData[key].categories[0])) {
      colorCoding[cleanCompanyData[key].categories[0]] = colors[counter];
      counter += 1;
    }
  }

  return colorCoding;
}

function assignCountryColors(domains) {
  const colors = [
    "#67001f",
    "#b2182b",
    "#d6604d",
    "#f4a582",
    "#fddbc7",
    "#ffffff",
    "#e0e0e0",
    "#bababa",
    "#878787",
    "#4d4d4d",
    "#1a1a1a",
    "#543005",
    "#8c510a",
    "#bf812d",
    "#dfc27d",
    "#d9ef8b",
    "#a6d96a",
    "#66bd63",
    "#1a9850",
    "#006837",
  ];

  let colorCoding = {};

  let counter = 0;

  for (const element of domains) {
    for (const el of element.thirdParties) {
      if (!colorCoding.hasOwnProperty(el.ownerCountry)) {
        colorCoding[el.ownerCountry] = colors[counter];
        counter += 1;
      }
    }
  }

  return colorCoding;
}

function writeFile(data, filePath, constName = "", fileEnding = "") {
  let json = JSON.stringify(data);
  if (constName != "") {
    json = "export const " + constName + " = " + json;
  }
  let fullPath = filePath;
  if (fileEnding != "") {
    fullPath += "." + fileEnding;
  }
  fs.writeFile(fullPath, json, (err) => {
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
    if (cleanCompanyData["https://" + node.name]) {
      node.country = cleanCompanyData["https://" + node.name]["countryCode"];
    }
    if (cleanCompanyData["https://" + node.name + " "]) {
      node.country =
        cleanCompanyData["https://" + node.name + " "]["countryCode"];
    }
  }
}
