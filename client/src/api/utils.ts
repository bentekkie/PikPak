export function postData(url = ``, data = {}) {
    // Default options are marked with *
    const token = sessionStorage.getItem('authToken')
    let headers : {} = {
        "Content-Type": "application/json"
    }
    if(token){
        headers = {
            ...headers,
            authorization:token
        }
    }
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers,
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then(response => response.json()).then(resp => {
            if(resp.status){
                throw resp
            }
            return resp
        }); // parses JSON response into native Javascript objects 
}

export async function postForm(url = ``, data : FormData){
    // Default options are marked with *
    const token = sessionStorage.getItem('authToken')
    let headers : {} = {}
    if(token){
        headers = {
            authorization:token
        }
    }
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers,
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: data, // body data type must match "Content-Type" header
    })
        .then(response => response.json()).then(resp => {
            if(resp.status){
                throw resp
            }
            return resp
        }); // parses JSON response into native Javascript objects 
}

export async function fetchData(url = ``) {
    // Default options are marked with *
    const token = sessionStorage.getItem('authToken')
    let headers : {} = {}
    if(token){
        headers = {
            ...headers,
            authorization:token
        }
    }
    return fetch(url, {headers})
        .then(response => response.json()).then(resp => {
            if(resp.status){
                throw resp
            }
            return resp
        })
}

export function dataURItoBlob(dataURI : string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


}
