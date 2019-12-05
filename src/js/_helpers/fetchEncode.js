export const fetchEncode = (params = {}) => {
    return Object.keys(params).map(k => {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) })
        .join('&')
}