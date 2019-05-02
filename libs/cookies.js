exports.serialize = function(name, val, opt) {
    var pairs = [name + '=' + val]
    opt = opt || {}
    if (opt.maxAge) {
        pairs.push('Max-Age=' + opt.maxAge)
    }
    if (opt.domain) {
        pairs.push('Domain=' + opt.domain)
    }
    if (opt.path) {
        pairs.push('Path=' + opt.path)
    }
    if (opt.expires) {
        pairs.push('Expires=' + opt.exppires.toUTCString())
    }
    if (opt.httpOnly) {
        pairs.push('HttpOnly')
    }
    if (opt.secure) {
        pairs.push('Secure')
    }
    return pairs.join(';')
 }