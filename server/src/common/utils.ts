export function parsePoint(b : Buffer){
    const endian = b.readUInt8(1);
    return {
        endian,
        srid : (endian)?b.readInt32LE(2):b.readInt32BE(2),
        mbr_min_x : (endian)?b.readDoubleLE(6):b.readDoubleBE(6),
        mbr_min_y : (endian)?b.readDoubleLE(14):b.readDoubleBE(14),
        mbr_max_x : (endian)?b.readDoubleLE(22):b.readDoubleBE(22),
        mbr_max_y : (endian)?b.readDoubleLE(30):b.readDoubleBE(30),
        class_type : (endian)?b.readInt32LE(39):b.readInt32BE(39),
        y : (endian)?b.readDoubleLE(51):b.readDoubleBE(51),
        x : (endian)?b.readDoubleLE(43):b.readDoubleBE(43),
    }
}

export function parseCoords(b : Buffer){
    const {x,y} = parsePoint(b)
    return {
        lat:x,
        lon:y
    }
}