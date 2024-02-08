chrome.action.onClicked.addListener(async tab => {

    let recording = false
    const existingContexts = await chrome.runtime.getContexts({})
    const offscreenDocument = existingContexts.find(c => c.contextType === 'OFFSCREEN_DOCUMENT')

    if (!offscreenDocument) {
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['USER_MEDIA'],
            justification: 'Recording from chrome.tabCapture API'
        })
    } else {
        recording = offscreenDocument.documentUrl.endsWith('#recording')
    }

    if (recording) {
        chrome.runtime.sendMessage({
            type: 'stop-stream',
            target: 'offscreen'
        })

        chrome.action.setIcon({
            path: '/icons/not-recording.png'
        })
    }
    else {
        const streamId = await chrome.tabCapture.getMediaStreamId({
            targetTabId: tab.id
        })
    
        chrome.runtime.sendMessage({
            type: 'start-stream',
            target: 'offscreen',
            data: streamId
        })
    
        chrome.action.setIcon({
            path: '/icons/recording.png'
        })
    }
})