function getAppStatus(updatedClient, discordGuild) {
  const guild = updatedClient.guilds.cache.get(discordGuild);
  if ( guild && updatedClient.queues[discordGuild] ) {
    
    const botMember = guild ? guild.members.cache.get(updatedClient.user.id) : null;
    const botNickname = botMember ? botMember.nickname : null;
    const guildName = guild.name;
    const guildIconURL = guild.iconURL();
  
    const currentTrack = updatedClient.queues[discordGuild].currentTrack;
    const progressBar = updatedClient.queues[discordGuild].node.createProgressBar({separator: "", indicator: "", length: 1});
    const times = progressBar && progressBar.split(" ");
    const currentDuration = progressBar && times[0];
    const currentTrackData = {
        id: currentTrack && currentTrack.id,
        title: currentTrack && currentTrack.title,
        description: currentTrack && currentTrack.duration,
        author: currentTrack && currentTrack.author,
        url: currentTrack && currentTrack.url,
        thumbnail: currentTrack && currentTrack.thumbnail,
        duration: currentTrack && currentTrack.duration,
        currentDuration: currentDuration,
        durationMS: currentTrack && currentTrack.durationMS,
        views: currentTrack && currentTrack.views,
        requestedBy: currentTrack && currentTrack.requestedBy,
        playlist: currentTrack && currentTrack.playlist
    }
  
    const tracks = updatedClient.queues[discordGuild].tracks.toArray();
    const fullQueue = [currentTrack, ...tracks];
    const volumeString = updatedClient.queues[discordGuild].filters.volume ? updatedClient.queues[discordGuild].filters.volume.toString() : 0;
    const volumeNumber = volumeString && parseInt(volumeString.replace('%', ''), 10);
    const volume = volumeNumber && volumeNumber;
    let isPlaying
    if (updatedClient.queues[discordGuild].node.isPaused())
        isPlaying = false
    else{
        isPlaying = updatedClient.queues[discordGuild].isPlaying();
    }
    const connectedChannel = isPlaying ? updatedClient.queues[discordGuild].channel : null;
    const isShuffling = updatedClient.queues[discordGuild].isShuffling;
    const isRepeating = updatedClient.queues[discordGuild].repeatMode;
    return {
        currentTrack: currentTrackData,
        tracks: fullQueue,
        volume,
        isPlaying,
        channel: connectedChannel ? connectedChannel.id : null,
        shuffle: isShuffling,
        repeat: isRepeating,
        botNickname: botNickname ? botNickname : null,
        guildInfo: {
          guildName,
          guildIconURL
        }
    }
  } else {
    const guild = updatedClient.guilds.cache.get(discordGuild);
    const botMember = guild ? guild.members.cache.get(updatedClient.user.id) : null;
    const botNickname = botMember ? botMember.nickname : null;
    const guildName = guild ? guild.name : null;
    const guildIconURL = guild ? guild.iconURL() : null;
    return {
      currentTrack: "",
      tracks: [],
      volume: updatedClient.defaultVolume,
      isPlaying: null,
      channel: null,
      shuffle: null,
      repeat: null,
      botNickname: botNickname ? botNickname : null,
      guildInfo: {
        guildName: guildName ? guildName : null,
        guildIconURL: guildIconURL ? guildIconURL : null
      }
    };
  }
}

module.exports = getAppStatus;