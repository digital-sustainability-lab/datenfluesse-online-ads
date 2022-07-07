data = require("./clean_company_data_alt.json");
const fs = require("fs");

cleanJson = {};

for (const key in data) {
  let str = key.trim();
  str = str.replace("https://www.", "");
  str = str.replace("https://", "");
  str = str.replace("/", "");
  cleanJson[str] = data[key];
}

fs.writeFileSync("./clean_company_alt.json", JSON.stringify(cleanJson), {
  encoding: "utf8",
});
