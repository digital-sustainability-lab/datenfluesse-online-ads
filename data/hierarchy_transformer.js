const company_data = require("./company_data.json");
const domains = require("./domains.json");
const pdomains = require("./3p_domains.json");
const fs = require("fs");

hierarchy = {
  name: "hierarchy",
  value: 100,
  children: [{ name: "all categories", value: 0, children: [] }],
};

function getCategoriesAndChildren(data) {
  for (const key in data) {
    hierarchy.children[0].children.push({ name: key, children: [], value: 0 });
    hierarchy.children[0].value += 1;
    for (const cats of data[key].domain.categories) {
      if (cats.confidence > 0.75) {
        const catsToAdd = cats.name.split("/");
        for (const category of catsToAdd) {
          if (category) {
            let found = hierarchy.children.find((cat) => cat.name == category);
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

function addDomains() {
  for (const element of hierarchy.children) {
    for (const child of element.children) {
      let name = domains.find((website) => website.name == child.name);
      if (name) {
        child.value = name.thirdParties.length;
        child.children = name.thirdParties.map((obj) => {
          let finalValue = 0;
          for (const perc of pdomains) {
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
}

getCategoriesAndChildren(company_data);
addDomains();

fs.writeFileSync("./hierarchy.json", JSON.stringify(hierarchy), {
  encoding: "utf8",
});
