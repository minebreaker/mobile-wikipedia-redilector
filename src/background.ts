export {}

declare const chrome: any


const HOST_REGEX = /^(.+)\.m\.wikipedia\.org$/

async function rewrite(request: any): Promise<any> {

    const url = new URL(request.url)
    const host = url.host

    const newHost = host.replace(HOST_REGEX, (_, m) => `${m}.wikipedia.org`)
    const newUrl = (() => {
        const newUrl = new URL(url)
        newUrl.host = newHost
        return newUrl
    })()
    console.log(`URL rewrite: from "${url}" to "${newUrl}"`)

    if (url.toString() === newUrl.toString()) {
        // If the url is the same as previous one, don't redirect to it so to prevent infinite redirecting.
        return
    }

    return { redirectUrl: newUrl.toString() }
}

chrome.webRequest.onBeforeRequest.addListener(
    rewrite,
    {
        urls: [
            "*://*.m.wikipedia.org/*"
        ],
        types: ["main_frame", "sub_frame"]
    },
    ["blocking"]
)
