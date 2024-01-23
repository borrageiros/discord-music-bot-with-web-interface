import config from "../config"
const url = config.apiUrl;

// --------------------------------------------------------------
export async function playSong(trackUrl, voiceChannel) {
    try {
        const response = await fetch(url+"/play", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: trackUrl,
                voiceChannelId: voiceChannel
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function connect(voiceChannel) {
        try {
            const response = await fetch(url+"/connect", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    voiceChannelId: voiceChannel
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function seek(milliseconds) {
    try {
        const response = await fetch(url+"/seek", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time: milliseconds
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function searcher(query, engine) {
    try {
        const response = await fetch(url+"/searcher", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query, engine: engine })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function moveTrack(from, to) {
    try {
        const response = await fetch(url+"/move-track", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: from, to: to })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function setVolume(volume) {
    try {
        const response = await fetch(url+"/set-volume", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                volume: volume
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function getAppStatus() {
    try {
        const response = await fetch(url+"/get-app-status", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function toggleShuffle() {
    try {
        const response = await fetch(url+"/toggle-shuffle", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function toggleRepeat() {
    try {
        const response = await fetch(url+"/toggle-repeat", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function getChannels() {
    try {
        const response = await fetch(url+"/get-channels", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function getCurrentTrack() {
    try {
        const response = await fetch(url+"/get-current-track", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function pause() {
    try {
        const response = await fetch(url+"/pause", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function resume() {
    try {
        const response = await fetch(url+"/resume", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function skip() {
    try {
        const response = await fetch(url+"/skip", {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------


// --------------------------------------------------------------
export async function deleteTrack(trackUrl) {
    try {
        const response = await fetch(url+"/delete-track", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: trackUrl
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
// --------------------------------------------------------------