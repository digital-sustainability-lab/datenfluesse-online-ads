const data = require("./clean_company_data.json");
const fs = require("fs");

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

for (const key in data) {
  if (!colorCoding.hasOwnProperty(data[key].categories[0])) {
    colorCoding[data[key].categories[0]] = colors[counter];
    counter += 1;
  }
}

fs.writeFileSync("./colorCoding.json", JSON.stringify(colorCoding), {
  encoding: "utf8",
});
