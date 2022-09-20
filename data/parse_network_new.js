const fs = require("fs");

const data = fs.readFileSync("types_sizes.json", { encoding: "utf-8" });
const countryData = fs.readFileSync("clean_company_data_all.json", {
  encoding: "utf-8",
});

const objects = JSON.parse(data);

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
  const entries = val.map((entry) => {
    const { page, ...rest } = entry;
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
    if (!nodeExists(domain)) {
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
    if (!nodeExists(domain)) {
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

fs.writeFile("network_new.json", JSON.stringify(network), (err) => {
  if (err) {
    console.error(err);
  }
  console.log("success");
  // file written successfully
});

function formatPageName(key) {
  key = key.substr(8).toLowerCase();
  if (key.lastIndexOf("/") == key.length - 1) {
    key = key.substr(0, key.length - 1);
  }
  if (key.indexOf("www.") == 0) {
    key = key.substr(4);
  }
  return key;
}

function nodeExists(domain) {
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
    if (node.country == "") {
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
