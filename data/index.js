// This script transforms the webXray output data to a json
// to be able to create the visualization

const papa = require("papaparse");
const fs = require("fs");
const { Interface } = require("readline");

const domainParser = require("./parse-domains");

domainParser.parseDomains();
const network = {
  nodes: [],
  links: [],
};

// const parsedReport = papa.parse(
//   fs.readFileSync("./per_site_network_report_subset.csv", { encoding: "utf8" })
// );
// const domainRows = parsedReport.data.slice(1);
// const domainMap = domainRows.reduce((map, row, index) => {
//   if (!map[row[0]]) map[row[0]] = { thirdParties: [] };
//   map[row[0]].thirdParties.push(createThirdPartyDomain(row));
//   return map;
// }, {});
// const domains = Object.keys(domainMap).map((key) => {
//   return { name: key, ...domainMap[key] };
// });
// console.log(domains);
// fs.writeFileSync("./domains_subset.json", JSON.stringify(domains), {
//   encoding: "utf8",
// });
// function createThirdPartyDomain(row) {
//   return { requestDomain: row[1], owner: row[2], ownerCountry: row[3] };
// }

const networkStructure = JSON.parse(fs.readFileSync("./domains_subset.json"));
networkStructure.forEach((element, i) => {
  let idx = 1;
  if (network.nodes.length > 0) {
    idx = getHighestIdx(network.nodes) + 1;
  }
  network.nodes.push({ id: idx, name: element.name, count: 0 });
  element.thirdParties.forEach((nested, k) => {
    let plus = network.nodes.find((node) => node.id == idx);
    let plusIdx = network.nodes.indexOf(plus);
    network.nodes[plusIdx]["count"] += 1;
    const obj = network.nodes.find((node) => node.name == nested.requestDomain);
    if (obj) {
      let objIdx = network.nodes.indexOf(obj);
      network.nodes[objIdx].count += 1;
      network.links.push({ source: obj.id, target: idx });
    } else {
      let index = getHighestIdx(network.nodes) + 1;
      network.nodes.push({ id: index, name: nested.requestDomain, count: 1 });
      network.links.push({ source: index, target: idx });
    }
  });
});

console.log(network);

fs.writeFileSync("./network.json", JSON.stringify(network), {
  encoding: "utf8",
});

function getHighestIdx(array) {
  array = array.map((element) => element.id);
  return Math.max(...array);
}
