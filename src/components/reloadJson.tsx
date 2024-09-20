import readJson from "./jsonRead";

async function reloadJson() {
  setTimeout(() => {
    readJson()
  }, 600000);
}

export default reloadJson;
