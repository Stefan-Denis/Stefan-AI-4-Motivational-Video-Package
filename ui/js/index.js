/**
 * ? Navigation Bar Button Logic and click logic
 */
document.querySelector('.card').addEventListener('click', () => {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('active')
    })
})

/**
 * When clicking everything but `.btn` `.video-card` `.main` `.overlay`, it wont remove the content
 * When you click the background, everything goes away
 * It then makes the current button active
 */
document.querySelectorAll('.btn, .video-card, .main, .overlay').forEach(element => {
    element.addEventListener('click', (event) => {
        event.stopPropagation()
        if (element.classList.contains('btn') && !element.classList.contains('active')) {
            document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'))
            element.classList.add('active')
        }
    })
})

/**
 * When clicking the background, everything goes away
 */
document.querySelector('body').addEventListener('click', () => {

    // Remove the currently selected UI button active class
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('active')
    })

    // Remove the mainContainer content
    const mainContainer = document.querySelector('main')
    if (mainContainer) {
        mainContainer.innerHTML = ''
    }

    // Remove the video container content
    const videoContainer = document.getElementById('video-container')
    if (videoContainer) {
        videoContainer.innerHTML = ''
    }

    // Set all tabs to be unloaded
    isVideoTabLoaded = false
    isScriptTabLoaded = false
    isSubtitlesTabLoaded = false
    isStartTabLoaded = false
})

/**
 * ? Route Logic
 */
/**
 * ? Video logic
 */
document.getElementById('videos').addEventListener('click', () => {

    // Set only the video tab to be loaded
    isScriptTabLoaded = false
    isSubtitlesTabLoaded = false
    isStartTabLoaded = false

    // Prevent multiple reloads
    if (isVideoTabLoaded) {
        return
    } else {
        isVideoTabLoaded = true
    }


    // Clear the main container
    const mainContainer = document.querySelector('main')
    if (mainContainer) {
        Array.from(mainContainer.children).forEach(child => {
            if (child.id !== 'video-container') {
                mainContainer.removeChild(child)
            }
        })
    }

    // Get the video data
    fetch('/videos/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {

            // Create manage videos button
            const manageVideosButton = document.createElement('div')
            manageVideosButton.className = "glass video-manager-button "
            mainContainer.appendChild(manageVideosButton)
            manageVideosButton.innerHTML = 'Manage Videos'

            // When clicked, open file explorer
            manageVideosButton.addEventListener('click', () => {
                openExplorer()
            })

            /** 
             * For each video obtained, create a new button for that video
             * Handles the click, shows the video
             */
            data.forEach(video => {
                // Create a new div element for the video
                const element = document.createElement('div')
                element.className = "video-selector glass"
                element.innerHTML = video

                // When clicked, show the video
                element.addEventListener('click', () => {
                    document.querySelectorAll('.video-selector').forEach(element => {
                        element.classList.remove('active')
                    })
                    element.classList.add('active')
                    handleVideoClick(video)
                })

                // Append the element to the main container
                if (mainContainer) {
                    mainContainer.appendChild(element)
                }
            })
        })

    /**
     * Gets video and displays it
     * @param {string} elementName 
     */
    function handleVideoClick(elementName) {
        // Set the current video selector text
        let elementNameTrimmed = elementName

        // Trim the element name if it is too long and then add it to the dom
        const currentVideoSelectorHTML = document.getElementById('current-video-selector')
        elementName.length > 11 && (elementNameTrimmed = elementName.substring(0, 9) + '...'); currentVideoSelectorHTML.innerHTML = elementNameTrimmed

        const videoContainer = document.getElementById('video-container')
        if (videoContainer) {
            videoContainer.innerHTML = '' // Clear the video container
        }

        // Display the video
        const videoElement = document.createElement('video')
        videoElement.src = `/video/display?elementName=${encodeURIComponent(elementName)}`
        videoElement.controls = true
        videoElement.className = 'video-player'
        videoContainer && videoContainer.appendChild(videoElement)
    }

    function openExplorer() {
        fetch('/open/fs')
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
 * ? Script logic
 */
document.getElementById('script').addEventListener('click', () => {

    // Set only the script tab to be loaded
    isVideoTabLoaded = false
    isSubtitlesTabLoaded = false
    isStartTabLoaded = false

    // Prevent multiple reloads
    if (isScriptTabLoaded) {
        return
    } else {
        isScriptTabLoaded = true
    }

    // Clear the main container
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
            <p style="font-size: 16px; margin: 0px; padding: 0px; margin-top: 10px; margin-left: 10px">Videos: (drag and drop)</p>
            <div class='video-script-editor-video-list glass'></div>
            <p style="font-size: 16px; margin: 0px; padding: 0px; margin-top: 10px; margin-left: 10px">Selected Videos:</p>
            <div class='video-script-editor-video-list-selected glass'></div>
            <p style="font-size: 16px; margin-left: 10px; margin-top: 10px; margin-bottom: -3px;">Script: (auto saves, delimit per video with new line, processes in selected videos order)</p>
        `
    mainContainer.appendChild(divElement)

    // Add text area for script creation
    const textArea = document.createElement('textarea')
    textArea.className = 'glass video-script-editor-text-area'
    mainContainer.appendChild(textArea)

    // Load the current script
    fetch('/script/getScript', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            textArea.value = data
        })

    // Update the script when the text area is changed
    textArea.addEventListener('input', () => {
        fetch('/script/setScript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: textArea.value })
        })
    })

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

            // Allow drag and drop to rearrange the videos in the selected list
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


    function setOrder() {
        fetch('/videos/setorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedVideos)
        })
    }
})

/**
 * ? Subtitles Tab
 */
document.getElementById('subtitles').addEventListener('click', () => {

    // Set only the subtitles tab to be loaded
    isVideoTabLoaded = false
    isScriptTabLoaded = false
    isStartTabLoaded = false

    // Prevent multiple reloads
    if (isSubtitlesTabLoaded) {
        return
    } else {
        isSubtitlesTabLoaded = true
    }

    // Clear the main container
    const mainContainer = document.querySelector('main')
    if (mainContainer) {
        Array.from(mainContainer.children).forEach(child => {
            if (child.id !== 'video-container') {
                mainContainer.removeChild(child)
            }
        })
    }

    // Create a new div element and append it to the main container
    const p = document.createElement('p')
    p.innerHTML = 'Change Subtitle Default Style (auto-save when typing)'
    p.style = 'margin: 0px; margin-top: 10px; margin-left: 10px;'
    mainContainer.appendChild(p)

    // Create a new text area to change the default subtitle style 
    const textArea = document.createElement('textarea')
    textArea.className = 'glass'
    textArea.style = 'width: calc(100% - 20px); height: 475px; margin-left: 10px; margin-top: 10px; resize: none; border-radius: 20px 20px 14px 14px; outline: none; padding: 10px;'
    mainContainer.appendChild(textArea)

    // Fetch the default subtitle style
    fetch('/subtitles/getstyle', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            textArea.value = data
        })

    // Update the default subtitle style when the text area is changed
    textArea.addEventListener('input', () => {
        fetch('/subtitles/setstyle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: textArea.value })
        })
    })

})

let isSubtitlesTabLoaded = false

document.getElementById('start').addEventListener('click', () => {

    // Set only the start tab to be loaded
    isScriptTabLoaded = false
    isVideoTabLoaded = false
    isSubtitlesTabLoaded = false

    // Prevent multiple reloads
    if (isStartTabLoaded) {
        return
    } else {
        isStartTabLoaded = true
    }

    // Clear the main container
    const mainContainer = document.querySelector('main')
    if (mainContainer) {
        // Clear the main container
        Array.from(mainContainer.children).forEach(child => {
            if (child.id !== 'video-container') {
                mainContainer.removeChild(child)
            }
        })
    }

    // Create the title
    const p = document.createElement('p')
    p.innerHTML = 'Start Video Processing'
    p.style = 'margin: 0px; margin-top: 10px; margin-left: 10px;'
    mainContainer.appendChild(p)

    // Create a center div
    const centerDiv = document.createElement('div')
    centerDiv.style = 'display: flex; justify-content: center; align-items: center; height: calc(100% - 40px);'
    mainContainer.appendChild(centerDiv)

    // Add a start button
    const startButton = document.createElement('div')
    startButton.className = 'glass start-button'
    startButton.innerHTML = 'Start'
    centerDiv.appendChild(startButton)

    // When clicked, start the video processing
    startButton.addEventListener('click', () => {
        createLoaderBlockWebsite()
    })
})

function createLoaderBlockWebsite() {
    // Create a new div element for the overlay
    const overlay = document.createElement('div')
    overlay.className = 'overlay'
    document.querySelector('body').appendChild(overlay)

    // Create a new div element for the modal
    const modal = document.createElement('div')
    modal.className = 'glass modal'
    overlay.appendChild(modal)

    // Add a loader to it
    const spinner = `<div class="spinner"><div class="spinner1"></div></div>`
    modal.innerHTML = spinner

    // Add a text element
    const text = document.createElement('p')
    text.innerHTML = 'Loading the Terminal, hang on...'
    text.style = 'margin-left: 80px;'
    modal.appendChild(text)

    // Set the spinner to be a success one
    setTimeout(() => {
        document.querySelector('.spinner').classList.add('success')
        document.querySelector('.spinner1').classList.add('success1')
        text.innerHTML = 'Terminal Loaded!'

        fetch('/start')

        setTimeout(() => {
            // TODO close the popup only after the terminal is closed
            // Remove the overlay
            document.querySelector('body').removeChild(overlay)
        }, 3500)
    }, 2500)
}

let isStartTabLoaded = false