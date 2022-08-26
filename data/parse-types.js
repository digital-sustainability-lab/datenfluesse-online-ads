const fs = require("fs");

const data = fs.readFileSync("types_sizes.json", { encoding: "utf-8" });

// console.log(data.slice(0, 1000));

const objects = JSON.parse(data);

// console.log(objects[0]);
// console.log(objects[1]);

// console.log(objects.length);

let dataMap = new Map();

for (let object of objects) {
  let key = generateKeyString(object.page);
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

let inbetween = JSON.stringify(result).length;

// console.log(result);

for (let page in result) {
  // console.log(page);
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

console.log(result);

function generateKeyString(key) {
  key = key.substr(8).toLowerCase();
  if (key.lastIndexOf("/") == key.length - 1) {
    key = key.substr(0, key.length - 1);
  }
  if (key.indexOf("www.") == 0) {
    key = key.substr(4);
  }
  return key;
}

fs.writeFile("test.json", JSON.stringify(result), (err) => {
  if (err) {
    console.error(err);
  }
  console.log("success");
  // file written successfully
});
