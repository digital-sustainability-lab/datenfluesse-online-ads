const fs = require("fs");

const data = fs.readFileSync("types_sizes.json", { encoding: "utf-8" });
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

let swiss = objects.filter((o) => {
  return swissPages.includes(o.page);
});

let alt = objects.filter((o) => {
  return altPages.includes(o.page);
});

let result = parseTypes(objects);
let resultSwiss = parseTypes(swiss);
let resultAlt = parseTypes(alt);

let network = parseNetwork(result);
let networkSwiss = parseNetwork(resultSwiss);
let networkAlt = parseNetwork(resultAlt);

writeTypes(result, "parsed/types_sizes_parsed_all.json");
writeTypes(resultSwiss, "parsed/types_sizes_parsed_swiss.json");
writeTypes(resultAlt, "parsed/types_sizes_parsed_alt.json");

writeNetwork(network, "parsed/network_all.json");
writeNetwork(networkSwiss, "parsed/network_swiss.json");
writeNetwork(networkAlt, "parsed/network_alt.json");

function parseTypes(objects) {
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
      const { country, id, page, ...rest } = entry;
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

function parseNetwork(result) {
  const network = {
    nodes: [],
    links: [],
  };

  let pageId = 0;

  for (let page in result) {
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

  for (let page in result) {
    let pageNode = network.nodes.find(
      (node) => node.name === formatPageName(page)
    );

    for (let domain in result[page]) {
      let node;
      let country = undefined;
      if (result[page][domain][0]["country"]) {
        country = result[page][domain][0]["country"];
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
      for (let request in result[page][domain]) {
        let requestData = result[page][domain][request];
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

function writeTypes(result, filePath) {
  fs.writeFile(filePath, JSON.stringify(result), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("success saving to " + filePath);
    // file written successfully
  });
}

function writeNetwork(network, filePath) {
  fs.writeFile(filePath, JSON.stringify(network), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("success saving to " + filePath);
    // file written successfully
  });
}

function formatPageName(key) {
  if (key.indexOf("https://") != -1) {
    key = key.substr(8).toLowerCase();
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
