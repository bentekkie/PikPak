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
