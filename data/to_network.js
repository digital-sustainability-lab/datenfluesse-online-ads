const fs = require("fs");

const network = {
  nodes: [],
  links: [],
};

const networkStructure = JSON.parse(fs.readFileSync("./domains_all.json"));
networkStructure.forEach((element, i) => {
  let idx = 1;
  if (network.nodes.length > 0) {
    idx = network.nodes[network.nodes.length - 1].id + 1;
  }
  let found = network.nodes.find((node) => node.name == element.name);
  if (!found) {
    network.nodes.push({ id: idx, name: element.name, count: 0 });
  } else {
    idx = found.id;
  }
  element.thirdParties.forEach((nested, k) => {
    let plus = network.nodes.find((node) => node.id == idx);
    let plusIdx = network.nodes.indexOf(plus);
    network.nodes[plusIdx]["count"] += 1;
    const obj = network.nodes.find((node) => node.name == nested.requestDomain);
    let idl = 1;
    if (network.links.length > 0) {
      idl = network.links[network.links.length - 1].id + 1;
    }
    if (obj) {
      let objIdx = network.nodes.indexOf(obj);
      network.nodes[objIdx].count += 1;
      network.links.push({ source: obj.id, target: idx, id: idl });
    } else {
      let index = getHighestIdx(network.nodes) + 1;
      network.nodes.push({
        id: index,
        name: nested.requestDomain,
        count: 1,
        country: nested.ownerCountry,
      });
      network.links.push({
        source: index,
        target: idx,
        id: idl,
        name: nested.requestDomain,
      });
    }
  });
});

fs.writeFileSync("./network_all.json", JSON.stringify(network), {
  encoding: "utf8",
});

function getHighestIdx(array) {
  array = array.map((element) => element.id);
  return Math.max(...array);
}
