export const getHash = (str1, str2) => {
    const str = str1.concat(str2);
    const arr = str.split('');
    let hash = 0;
    arr.forEach(i=> {
        hash += i.charCodeAt(0)
    })
    return hash;
}
