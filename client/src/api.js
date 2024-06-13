const currentUrl = window.location.href;
const urlObject = new URL(currentUrl);
const url = urlObject.origin + "/api";
const params = new URLSearchParams(urlObject.search);
const guild = params.get('guild');

// --------------------------------------------------------------
export async function playSong(trackUrl, voiceChannel) {
    try {
        const response = await fetch(url+"/play", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                discordGuild: guild,
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
                    discordGuild: guild,
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
                discordGuild: guild,
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
            body: JSON.stringify({
                discordGuild: guild,
                query: query,
                engine: engine
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
export async function moveTrack(from, to) {
    try {
        const response = await fetch(url+"/move-track", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                discordGuild: guild,
                from: from,
                to: to
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
export async function setVolume(volume) {
    try {
        const response = await fetch(url+"/set-volume", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                discordGuild: guild,
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
        const response = await fetch(url+"/get-app-status/"+guild, {
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
        const response = await fetch(url+"/toggle-shuffle/"+guild, {
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
        const response = await fetch(url+"/toggle-repeat/"+guild, {
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
export async function getChannels(guild) {
    try {
        const response = await fetch(url+"/get-channels/"+guild, {
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
        const response = await fetch(url+"/get-current-track/"+guild, {
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
        const response = await fetch(url+"/pause/"+guild, {
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
        const response = await fetch(url+"/resume/"+guild, {
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
        const response = await fetch(url+"/skip/"+guild, {
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
                discordGuild: guild,
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



// --------------------------------------------------------------
export async function deleteQueue() {
    try {
        const response = await fetch(url+"/delete-queue", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                discordGuild: guild
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