// This script can be run to generate codes for new coins

const length = 6;
const numberOfCodesToGenerate = 50;
const prefix = "AA";
const validCharacters = ["2", "3", "4", "6", "7", "9", "A", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "T", "U", "V", "W", "X", "Y", "Z"];

let generated = [];

for (let i = 0; i < numberOfCodesToGenerate; i++) {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array); // Better than Math.random()

    let code = prefix;
    for (let j = 0; j < array.length; j++) {
        let index = array[j] % validCharacters.length; // Take the random number and map it to an index of our valid characters
        code += validCharacters[index];
    }

    // Try to regenerate the code if it already exists
    if (generated.indexOf(code) >= 0) {
        i--;
        continue;
    } else {
        generated.push(code);
    }
}

console.log(generated);