/**
 * Navigation Bar Button Logic and click logic
 */
document.querySelector('.card').addEventListener('click', () => {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('active')
    })
})

document.querySelectorAll('.btn, .video-card, .main').forEach(element => {
    element.addEventListener('click', (event) => {
        event.stopPropagation()
        if (element.classList.contains('btn') && !element.classList.contains('active')) {
            document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'))
            element.classList.add('active')
        }
    })
})

document.querySelector('body').addEventListener('click', () => {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('active')
    })
    const mainContainer = document.querySelector('main')
    if (mainContainer) {
        mainContainer.innerHTML = ''
    }
    const videoContainer = document.getElementById('video-container')
    if (videoContainer) {
        videoContainer.innerHTML = ''
    }
    isVideoTabLoaded = false
    isScriptTabLoaded = false
})

/**
 * Route Logic
 */
/**
 * Video logic
 */
document.getElementById('videos').addEventListener('click', () => {
    isScriptTabLoaded = false

    if (isVideoTabLoaded) {
        return
    } else {
        isVideoTabLoaded = true
    }

    const mainContainer = document.querySelector('main')
    if (mainContainer) {
        // Clear the main container
        Array.from(mainContainer.children).forEach(child => {
            if (child.id !== 'video-container') {
                mainContainer.removeChild(child)
            }
        })
    }

    fetch('/videos/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            data.forEach(video => {
                const element = document.createElement('div')
                element.className = "video-selector glass"
                element.innerHTML = video
                element.addEventListener('click', () => {
                    document.querySelectorAll('.video-selector').forEach(element => {
                        element.classList.remove('active')
                    })
                    element.classList.add('active')
                    handleVideoClick(video)
                })
                if (mainContainer) {
                    mainContainer.appendChild(element)
                }
            })
        })

    function handleVideoClick(elementName) {
        let elementNameTrimmed = elementName
        if (elementName.length > 11) {
            elementNameTrimmed = elementName.substring(0, 9) + '...'
        }
        document.getElementById('current-video-selector').innerHTML = elementNameTrimmed

        const videoContainer = document.getElementById('video-container')
        if (videoContainer) {
            videoContainer.innerHTML = '' // Clear the video container
        }

        const videoElement = document.createElement('video')
        videoElement.src = `/video/display?elementName=${encodeURIComponent(elementName)}`
        videoElement.controls = true
        videoElement.className = 'video-player'

        if (videoContainer) {
            videoContainer.appendChild(videoElement)
        }
    }
})

let isVideoTabLoaded = false

let isScriptTabLoaded = false
let selectedVideos = []

// Update the UI based on the selectedVideos array when the video selection page is loaded
function updateUI() {
    const selectedVideoList = document.querySelector('.video-script-editor-video-list-selected')
    selectedVideoList.innerHTML = '' // Clear the selected video list

    selectedVideos.forEach(videoName => {
        const videoElement = document.getElementById(videoName) // Get the button by its id
        if (videoElement) {
            selectedVideoList.appendChild(videoElement) // Add the button to the selected list
        }
    })
}

/**
 * Script logic
 */
document.getElementById('script').addEventListener('click', () => {
    isVideoTabLoaded = false

    if (isScriptTabLoaded) {
        return
    } else {
        isScriptTabLoaded = true
    }

    const mainContainer = document.querySelector('main')
    if (mainContainer) {
        // Clear the main container
        Array.from(mainContainer.children).forEach(child => {
            if (child.id !== 'video-container') {
                mainContainer.removeChild(child)
            }
        })
    }

    // Create a new div element and append it to the main container
    const divElement = document.createElement('div')
    divElement.innerHTML = `
            <p style="margin: 0px; padding: 0px; margin-top: 10px; margin-left: 10px">Videos: (drag and drop)</p>
            <div class='video-script-editor-video-list glass'></div>
            <p style="margin: 0px; padding: 0px; margin-top: 10px; margin-left: 10px">Selected Videos:</p>
            <div class='video-script-editor-video-list-selected glass'></div>
        `
    mainContainer.appendChild(divElement)

    // Fetch videos
    fetch('/videos/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            const videoList = document.querySelector('.video-script-editor-video-list')
            const selectedVideoList = document.querySelector('.video-script-editor-video-list-selected')

            data.forEach(video => {
                const videoElement = document.createElement('button')
                videoElement.innerHTML = video
                videoElement.id = video // Set the id of the button to the video name
                videoElement.draggable = true

                videoElement.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('text/plain', video)
                })

                videoList.appendChild(videoElement)
            })

            // Allow dropping videos into the selected list
            selectedVideoList.addEventListener('dragover', (event) => {
                event.preventDefault()
            })

            selectedVideoList.addEventListener('drop', (event) => {
                event.preventDefault()
                const videoName = event.dataTransfer.getData('text/plain')

                // Remove the videoName from its current position in the array
                const index = selectedVideos.indexOf(videoName)
                if (index > -1) {
                    selectedVideos.splice(index, 1)
                    console.log(`Rearranged video: ${videoName}`) // Log rearranging
                } else {
                    console.log(`Added video: ${videoName}`) // Log adding
                }

                const videoElement = document.getElementById(videoName) // Get the button by its id
                if (videoElement) {
                    selectedVideoList.appendChild(videoElement) // Move the button to the selected list
                }

                // Rebuild the array based on the current order of videos in the UI
                selectedVideos = Array.from(selectedVideoList.children).map(child => child.id)
                console.log('Current array:', selectedVideos) // Log the entire array
                setOrder()
            })

            // Allow dropping videos back into the original list
            videoList.addEventListener('dragover', (event) => {
                event.preventDefault()
            })

            videoList.addEventListener('drop', (event) => {
                event.preventDefault()
                const videoName = event.dataTransfer.getData('text/plain')
                const index = selectedVideos.indexOf(videoName)
                if (index > -1) {
                    selectedVideos.splice(index, 1)
                    console.log(`Removed video: ${videoName}`) // Log removing
                    setOrder()
                }

                const videoElement = document.getElementById(videoName) // Get the button by its id
                if (videoElement) {
                    videoList.appendChild(videoElement) // Move the button back to the original list
                }
            })

            updateUI() // Update the UI when the video selection page is loaded
        })
})

function setOrder() {
    console.log('Setting order...')
}