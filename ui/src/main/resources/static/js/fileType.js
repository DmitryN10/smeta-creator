function determineType(input) {
    var toBytes = function (s) {
        var data = [];
        for (var i = 0; i < s.length; i++) {
            data.push(s.charCodeAt(i));
        }
        return data;
    };
    var buf = (input instanceof Uint8Array) ? input : new Uint8Array(input);
    if (!(buf && buf.length > 1)) return null;

    function check(header, options){
        options = Object.assign({offset: 0}, options);
        for (var i = 0; i < header.length; i++) {
            // If a bitmask is set
            if (options.mask) {
                // If header doesn't equal `buf` with bits masked off
                if (header[i] !== (options.mask[i] & buf[i + options.offset])) return false;
            } else if (header[i] !== buf[i + options.offset]) return false;
        }
        return true;
    }
    function checkString(header, options) {
        return check(toBytes(header), options);
    }

    // Zip-based file formats
    // Need to be before the `zip` check
    if (check([0x50, 0x4B, 0x3, 0x4])) {
        for (var i = 0; i < buf.length - 3; i++) {
            if (buf[i] === 0x77 && buf[i + 1] === 0x6F && buf[i + 2] === 0x72 && buf[i + 3] === 0x64) {
                return {
                    ext: '.docx',
                    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                };
            }
            if (buf[i] === 0x70 && buf[i + 1] === 0x70 && buf[i + 2] === 0x74 && buf[i + 3] === 0x2F) {
                return {
                    ext: '.pptx',
                    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                };
            }
        }
        for (var i = 0; i < buf.length - 7; i++) {
            if (buf[i] === 0x77 && buf[i + 1] === 0x6F && buf[i + 2] === 0x72 &&
                buf[i + 3] === 0x6B && buf[i + 4] === 0x62 && buf[i + 5] === 0x6f &&
                buf[i + 6] === 0x6F && buf[i + 7] === 0x6B) {
                return {
                    ext: '.xlsx',
                    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                };
            }
        }
    }

    if (check([0x50, 0x4B]) && (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) && (buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)) {
        return {ext: '.zip', mime: 'application/zip'};
    }

    if (check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) && (buf[6] === 0x0 || buf[6] === 0x1)) {
        return {ext: 'rar', mime: 'application/x-rar-compressed'};
    }

    if (check([0x75, 0x73, 0x74, 0x61, 0x72], {offset: 257})) {
        return {ext: 'tar', mime: 'application/x-tar'};
    }

    if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
        return {ext: '7z', mime: 'application/x-7z-compressed'};
    }

    if (checkString('<?xml ')) {
        return {ext: 'xml', mime: 'application/xml'};
    }

    if (check([0x4D, 0x5A])) {
        return {ext: 'exe', mime: 'application/x-msdownload'};
    }

    if (check([0xFF, 0xD8, 0xFF])) {
        return {ext: 'jpg', mime: 'image/jpeg'};
    }

    if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
        return {ext: 'png', mime: 'image/png'};
    }

    if (check([0x47, 0x49, 0x46])) {
        return {ext: 'gif', mime: 'image/gif'};
    }

    if (check([0x57, 0x45, 0x42, 0x50], {offset: 8})) {
        return {ext: 'webp', mime: 'image/webp'};
    }

    if (check([0x42, 0x4D])) {
        return {ext: 'bmp', mime: 'image/bmp'}
    }

    if (check([0x49, 0x49, 0xBC])) {
        return {ext: 'jxr', mime: 'image/vnd.ms-photo'};
    }

    if (check([0x25, 0x50, 0x44, 0x46])) {
        return {ext: 'pdf',mime: 'application/pdf'};
    }

    if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
        return {ext: 'ttf', mime: 'font/ttf'};
    }

    if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
        // JPEG-2000 family

        if (check([0x6A, 0x70, 0x32, 0x20], {offset: 20})) {
            return {ext: 'jp2', mime: 'image/jp2'};
        }

        if (check([0x6A, 0x70, 0x78, 0x20], {offset: 20})) {
            return {ext: 'jpx', mime: 'image/jpx'};
        }

        if (check([0x6A, 0x70, 0x6D, 0x20], {offset: 20})) {
            return {ext: 'jpm', mime: 'image/jpm'};
        }

        if (check([0x6D, 0x6A, 0x70, 0x32], {offset: 20})) {
            return {ext: 'mj2', mime: 'image/mj2'};
        }
    }
    return null;
}