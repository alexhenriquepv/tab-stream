chrome.runtime.onMessage.addListener(async message => {
    if (message.target === 'offscreen') {
        switch (message.type) {
            case 'start-stream':
                startStream(message.data)
                break
            case 'stop-stream':
                stopStream()
                break
            default:
                throw new Error('Unrecocnized Message')
        }
    }
})

let recorder, media
const peer = new Peer('id46940699-5394-4a48-919a-27f96979fdb7')

peer.on('open', remoteId => {
    alert('client id' + remoteId)
})
peer.on('error', err => alert(err))
peer.on('close', err => alert('close'))
peer.on('disconnect', err => alert('disconnect'))
peer.on('call', call => {
    if (media) {
        call.answer(media)
    }
})

async function startStream(streamId) {

    media = await navigator.mediaDevices.getUserMedia({
        video: {
            mandatory: {
                chromeMediaSource: 'tab',
                chromeMediaSourceId: streamId
            }
        }
    })

    recorder = new MediaRecorder(media, {
        mimeType: 'video/webm'
    })

    recorder.onstop = () => {
        recorder = undefined;
    }

    recorder.start()
    window.location.hash = 'recording'
}

function stopStream() {
    if (recorder == undefined) return
    recorder.stop()
    recorder.stream.getTracks().forEach(t => t.stop())
    window.location.hash = ''
}