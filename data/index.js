// This script transforms the webXray output data to a json
// to be able to create the visualization

const papa = require("papaparse");
const fs = require("fs");

const domainParser = require("./parse-domains");

domainParser.parseDomains();
