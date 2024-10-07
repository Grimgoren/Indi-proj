import readJson from './jsonRead'

async function reloadJson() {
    readJson()
    console.log('Reloading the JSON file')
}

export default reloadJson
