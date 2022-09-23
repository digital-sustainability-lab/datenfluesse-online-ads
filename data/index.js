// This script transforms the webXray output data to a json
// to be able to create the visualization

const papa = require("papaparse");
const fs = require("fs");
const { Interface } = require("readline");

const domainParser = require("./parse-domains");
const { privateDecrypt } = require("crypto");

domainParser.parseDomains();

const parsedReport = papa.parse(
  fs.readFileSync("./3p_domains_new.csv", {
    encoding: "utf8",
  })
);
const domainRows = parsedReport.data.slice(1);
const domainMap = domainRows.reduce((map, row, index) => {
  if (!map[row[0]]) map[row[0]] = { thirdParties: [] };
  map[row[0]].thirdParties.push(createThirdPartyDomain(row));
  return map;
}, {});
const domains = Object.keys(domainMap).map((key) => {
  return { name: key, ...domainMap[key] };
});
console.log(domains);
fs.writeFileSync("./3pdomain_schwaiger.json", JSON.stringify(domains), {
  encoding: "utf8",
});
function createThirdPartyDomain(row) {
  return { requestDomain: row[1], owner: row[2], ownerCountry: row[3] };
}
