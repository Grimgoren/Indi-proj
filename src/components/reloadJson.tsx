import readJson from './jsonRead';

async function reloadJson() {
    const projects = await readJson();
    if (projects) {
        console.log('Reloading the JSON file');
    } else {
        console.error('Failed to reload JSON');
    }
    console.log("This was reloaded: ", projects)
    return { Projects: projects };
}

export default reloadJson;
