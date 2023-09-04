function generateIDFromTime() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    // Generate a random hash
    let randomHash = '';
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 4; i++) {
        randomHash += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const id = day + hours + minutes + seconds + milliseconds + randomHash;
    return id;
}

function generateIDFromHash(length: number = 9) {
    let randomHash = '';
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
        randomHash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomHash;
}

export { generateIDFromTime, generateIDFromHash }