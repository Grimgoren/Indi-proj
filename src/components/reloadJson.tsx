import readJson from './jsonRead'

async function reloadJson() {
  setTimeout(() => {
    readJson()
    console.log('Reloading the JSON file')
  }, 600000)
}

export default reloadJson
