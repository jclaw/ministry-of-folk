function replaceEmbedColors(str) {
    bgcol = /(bgcol=).{6}/g;
    linkcol = /(linkcol=).{6}/g;
    return str.replace(bgcol, '$1000000').replace(linkcol, '$1a8a6a1');
};