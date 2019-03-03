export function getData() {
    return 1000
}


export function toggleValue<T>(arr : T[], val: T){
    if(arr.findIndex(x => x === val) > -1){
        return arr.filter(x => x !== val)
    }else{
        arr.push(val)
        return arr
    }
}