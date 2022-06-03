const papa = require("papaparse");
const fs = require("fs");

const domainRows = papa
  .parse(fs.readFileSync("./per_site_network_report.csv", { encoding: "utf8" }))
  .data.slice(1);

const thirdParyDomains = papa
  .parse(fs.readFileSync("./3p_domains.csv", { encoding: "utf8" }))
  .data.slice(1);

module.exports = {
  parseDomains: function () {
    const domainMap = domainRows.reduce((map, row, index) => {
      if (!map[row[0]]) map[row[0]] = { thirdParties: [] };
      map[row[0]].thirdParties.push(createThirdPartyDomain(row));
      return map;
    }, {});
    const domains = Object.keys(domainMap).map((key) => {
      return { name: key, ...domainMap[key] };
    });
    fs.writeFileSync("./domains.json", JSON.stringify(domains), {
      encoding: "utf8",
    });
  },
};

function createThirdPartyDomain(row) {
  return {
    requestDomain: row[1],
    owner: row[2],
    ownerCountry: row[3],
    ownerLineage: getOwnerLineage(row[1]),
  };
}
function getOwnerLineage(requestDomain) {
  const thirdPartyInformation = thirdParyDomains.find(
    (row) => row[1] === requestDomain
  );
  if (!thirdPartyInformation) return "unkown";
  return thirdPartyInformation[4];
}
