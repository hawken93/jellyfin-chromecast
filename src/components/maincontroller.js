import {
    reportPlaybackProgress,
    reportPlaybackStopped,
    play,
    startBackdropInterval,
    getPlaybackInfo,
    stopActiveEncodings,
    detectBitrate
} from './jellyfinActions';
import { getDeviceProfile as deviceProfileBuilder } from './deviceprofileBuilder';
import {
    getCurrentPositionTicks,
    getReportingParams,
    resetPlaybackScope,
    getMetadata,
    createStreamInfo,
    getStreamByIndex,
    getShuffleItems,
    getInstantMixItems,
    translateRequestedItems,
    extend,
    broadcastToMessageBus,
    broadcastConnectionErrorMessage,
    cleanName
} from '../helpers';

import { getMaxBitrateSupport } from './codecSupportHelper';

import { commandHandler } from './commandHandler';
import { playbackManager } from './playbackManager';

import { JellyfinApi } from './jellyfinApi';

window.castReceiverContext = cast.framework.CastReceiverContext.getInstance();
window.mediaManager = window.castReceiverContext.getPlayerManager();

const playbackMgr = new playbackManager(window.mediaManager);

var init = function () {
    resetPlaybackScope($scope);
};

init();

var mgr = window.mediaManager;

var broadcastToServer = new Date();

export function onMediaElementTimeUpdate() {
    if ($scope.isChangingStream) {
        return;
    }

    var now = new Date();

    var elapsed = now - broadcastToServer;

    if (elapsed > 5000) {
        // TODO use status as input
        reportPlaybackProgress($scope, getReportingParams($scope));
        broadcastToServer = now;
    } else if (elapsed > 1500) {
        // TODO use status as input
        reportPlaybackProgress($scope, getReportingParams($scope), false);
    }
}

export function onMediaElementPause() {
    if ($scope.isChangingStream) {
        return;
    }

    reportEvent('playstatechange', true);
}

export function onMediaElementPlaying() {
    if ($scope.isChangingStream) {
        return;
    }
    reportEvent('playstatechange', true);
}

export function onMediaElementVolumeChange() {
    var volume = window.mediaElement.volume;
    window.VolumeInfo.Level = volume * 100;
    window.VolumeInfo.IsMuted = volume == 0;

    reportEvent('volumechange', true);
}

export function enableTimeUpdateListener() {
    window.mediaManager.addEventListener(
        cast.framework.events.EventType.TIME_UPDATE,
        onMediaElementTimeUpdate
    );
    window.mediaManager.addEventListener(
        cast.framework.events.EventType.REQUEST_VOLUME_CHANGE,
        onMediaElementVolumeChange
    );
    window.mediaManager.addEventListener(
        cast.framework.events.EventType.PAUSE,
        onMediaElementPause
    );
    window.mediaManager.addEventListener(
        cast.framework.events.EventType.PLAYING,
        onMediaElementPlaying
    );
}

export function disableTimeUpdateListener() {
    window.mediaManager.removeEventListener(
        cast.framework.events.EventType.TIME_UPDATE,
        onMediaElementTimeUpdate
    );
    window.mediaManager.removeEventListener(
        cast.framework.events.EventType.REQUEST_VOLUME_CHANGE,
        onMediaElementVolumeChange
    );
    window.mediaManager.removeEventListener(
        cast.framework.events.EventType.PAUSE,
        onMediaElementPause
    );
    window.mediaManager.removeEventListener(
        cast.framework.events.EventType.PLAYING,
        onMediaElementPlaying
    );
}

enableTimeUpdateListener();

window.addEventListener('beforeunload', function () {
    // Try to cleanup after ourselves before the page closes
    disableTimeUpdateListener();
    reportPlaybackStopped($scope, getReportingParams($scope));
});

mgr.defaultOnPlay = function (event) {
    play($scope, event);
    reportPlaybackProgress($scope, getReportingParams($scope));
};
mgr.addEventListener(cast.framework.events.EventType.PLAY, mgr.defaultOnPlay);

mgr.defaultOnPause = function () {
    reportPlaybackProgress($scope, getReportingParams($scope));
};
mgr.addEventListener(cast.framework.events.EventType.PAUSE, mgr.defaultOnPause);

mgr.defaultOnStop = function () {
    playbackMgr.stop();
};

mgr.addEventListener(
    cast.framework.events.EventType.MEDIA_FINISHED,
    mgr.defaultOnStop
);
mgr.addEventListener(cast.framework.events.EventType.ABORT, mgr.defaultOnStop);

mgr.addEventListener(cast.framework.events.EventType.ENDED, function () {
    // Ignore
    if ($scope.isChangingStream) {
        return;
    }

    reportPlaybackStopped($scope, getReportingParams($scope));
    init();

    if (!playbackMgr.playNextItem()) {
        window.playlist = [];
        window.currentPlaylistIndex = -1;
        startBackdropInterval();
    }
});

window.castReceiverContext.addEventListener(
    cast.framework.system.EventType.SYSTEM_VOLUME_CHANGED,
    function (event) {
        console.log(
            '### Cast Receiver Manager - System Volume Changed : ' +
                JSON.stringify(event.data)
        );

        reportEvent('volumechange', true);
    }
);

// Set the active subtitle track once the player has loaded
window.mediaManager.addEventListener(
    cast.framework.events.EventType.PLAYER_LOAD_COMPLETE,
    () => {
        setTextTrack(
            window.mediaManager.getMediaInformation().customData
                .subtitleStreamIndex
        );
    }
);

console.log('Application is ready, starting system');

export function reportDeviceCapabilities() {
    getMaxBitrate().then((maxBitrate) => {
        let capabilitiesUrl = JellyfinApi.createUrl(
            'Sessions/Capabilities/Full'
        );

        let deviceProfile = getDeviceProfile(maxBitrate);

        let capabilities = {
            PlayableMediaTypes: ['Audio', 'Video'],
            SupportsPersistentIdentifier: false,
            SupportsMediaControl: true,
            DeviceProfile: deviceProfile
        };
        window.hasReportedCapabilities = true;

        return JellyfinApi.authAjax(capabilitiesUrl, {
            type: 'POST',
            data: JSON.stringify(capabilities),
            contentType: 'application/json'
        });
    });
}

export function processMessage(data) {
    if (
        !data.command ||
        !data.serverAddress ||
        !data.userId ||
        !data.accessToken
    ) {
        console.log('Invalid message sent from sender. Sending error response');

        broadcastToMessageBus({
            type: 'error',
            message:
                'Missing one or more required params - command,options,userId,accessToken,serverAddress'
        });
        return;
    }

    // Items will have properties - Id, Name, Type, MediaType, IsFolder

    JellyfinApi.setServerInfo(
        data.userId,
        data.accessToken,
        data.serverAddress
    );

    if (data.subtitleAppearance) {
        window.subtitleAppearance = data.subtitleAppearance;
    }

    // Report device capabilities
    if (!window.hasReportedCapabilities) {
        reportDeviceCapabilities();
    }

    data.options = data.options || {};
    var cleanReceiverName = cleanName(data.receiverName || '');
    window.deviceInfo.deviceName =
        cleanReceiverName || window.deviceInfo.deviceName;
    // deviceId just needs to be unique-ish
    window.deviceInfo.deviceId = cleanReceiverName
        ? btoa(cleanReceiverName)
        : window.deviceInfo.deviceId;

    if (data.maxBitrate) {
        window.MaxBitrate = data.maxBitrate;
    }

    window.reportEventType;

    let cmdHandler = window.commandHandler;

    if (!cmdHandler) {
        window.commandHandler = new commandHandler(
            window.mediaManager,
            playbackMgr
        );
        cmdHandler = window.commandHandler;
    }

    cmdHandler.processMessage(data, data.command);

    if (window.reportEventType) {
        var report = function () {
            reportPlaybackProgress($scope, getReportingParams($scope));
        };
        reportPlaybackProgress(
            $scope,
            getReportingParams($scope),
            true,
            window.reportEventType
        );
        setTimeout(report, 100);
        setTimeout(report, 500);
    }
}

export function reportEvent(name, reportToServer) {
    reportPlaybackProgress(
        $scope,
        getReportingParams($scope),
        reportToServer,
        name
    );
}

export function setSubtitleStreamIndex($scope, index) {
    console.log('setSubtitleStreamIndex. index: ' + index);

    var positionTicks;

    var currentSubtitleStream = $scope.mediaSource.MediaStreams.filter(
        function (m) {
            return (
                m.Index == $scope.subtitleStreamIndex && m.Type == 'Subtitle'
            );
        }
    )[0];
    var currentDeliveryMethod = currentSubtitleStream
        ? currentSubtitleStream.DeliveryMethod
        : null;

    if (index == -1 || index == null) {
        // Need to change the stream to turn off the subs
        if (currentDeliveryMethod == 'Encode') {
            console.log('setSubtitleStreamIndex video url change required');
            positionTicks = getCurrentPositionTicks($scope);
            changeStream(positionTicks, {
                SubtitleStreamIndex: -1
            });
        } else {
            $scope.subtitleStreamIndex = -1;
            setTextTrack(null);
        }
        return;
    }

    var mediaStreams = $scope.PlaybackMediaSource.MediaStreams;

    var subtitleStream = getStreamByIndex(mediaStreams, 'Subtitle', index);

    if (!subtitleStream) {
        console.log(
            'setSubtitleStreamIndex error condition - subtitle stream not found.'
        );
        return;
    }

    console.log(
        'setSubtitleStreamIndex DeliveryMethod:' + subtitleStream.DeliveryMethod
    );

    if (
        subtitleStream.DeliveryMethod == 'External' ||
        currentDeliveryMethod == 'Encode'
    ) {
        var textStreamUrl = subtitleStream.IsExternalUrl
            ? subtitleStream.DeliveryUrl
            : JellyfinApi.createUrl(subtitleStream.DeliveryUrl);

        console.log('Subtitle url: ' + textStreamUrl);
        setTextTrack(index);
        $scope.subtitleStreamIndex = subtitleStream.Index;
        return;
    } else {
        console.log('setSubtitleStreamIndex video url change required');
        positionTicks = getCurrentPositionTicks($scope);
        changeStream(positionTicks, {
            SubtitleStreamIndex: index
        });
    }
}

export function setAudioStreamIndex($scope, index) {
    var positionTicks = getCurrentPositionTicks($scope);
    changeStream(positionTicks, {
        AudioStreamIndex: index
    });
}

export function seek(ticks) {
    changeStream(ticks);
}

export function changeStream(ticks, params) {
    if (ticks) {
        ticks = parseInt(ticks);
    }

    if (
        window.mediaManager.getMediaInformation().customData.canClientSeek &&
        params == null
    ) {
        window.mediaManager.seek(ticks / 10000000);
        reportPlaybackProgress($scope, getReportingParams($scope));
        return;
    }

    params = params || {};

    var playSessionId = $scope.playSessionId;
    var liveStreamId = $scope.liveStreamId;

    var item = $scope.item;

    getMaxBitrate().then(async (maxBitrate) => {
        const deviceProfile = getDeviceProfile(maxBitrate);
        const audioStreamIndex =
            params.AudioStreamIndex == null
                ? $scope.audioStreamIndex
                : params.AudioStreamIndex;
        const subtitleStreamIndex =
            params.SubtitleStreamIndex == null
                ? $scope.subtitleStreamIndex
                : params.SubtitleStreamIndex;

        const playbackInformation = await getPlaybackInfo(
            item,
            maxBitrate,
            deviceProfile,
            ticks,
            $scope.mediaSourceId,
            audioStreamIndex,
            subtitleStreamIndex,
            liveStreamId
        );
        if (!validatePlaybackInfoResult(playbackInformation)) {
            return;
        }

        const mediaSource = playbackInformation.MediaSources[0];
        const streamInfo = createStreamInfo(item, mediaSource, ticks);

        if (!streamInfo.url) {
            showPlaybackInfoErrorMessage('NoCompatibleStream');
            return;
        }

        const mediaInformation = createMediaInformation(
            playSessionId,
            item,
            streamInfo
        );
        const loadRequest = new cast.framework.messages.LoadRequestData();
        loadRequest.media = mediaInformation;
        loadRequest.autoplay = true;

        // TODO something to do with HLS?
        const requiresStoppingTranscoding = false;
        if (requiresStoppingTranscoding) {
            window.mediaManager.pause();
            await stopActiveEncodings(playSessionId);
        }
        window.mediaManager.load(loadRequest);
        window.mediaManager.play();
        $scope.subtitleStreamIndex = subtitleStreamIndex;
        $scope.audioStreamIndex = audioStreamIndex;
    });
}

// Create a message handler for the custome namespace channel
// TODO save namespace somewhere global?
window.castReceiverContext.addCustomMessageListener(
    'urn:x-cast:com.connectsdk',
    function (evt) {
        var data = evt.data;

        // Apparently chromium likes to pass it as json, not as object.
        // chrome on android works fine
        if (typeof data == 'string' || data instanceof String) {
            console.log('Event data is a string.. Chromium detected..');
            data = JSON.parse(data);
        }

        data.options = data.options || {};
        data.options.senderId = evt.senderId;
        // TODO set it somewhere better perhaps
        window.senderId = evt.senderId;

        console.log('Received message: ' + JSON.stringify(data));
        processMessage(data);
    }
);

export function translateItems(data, options, items, method) {
    var callback = function (result) {
        options.items = result.Items;

        if (method == 'PlayNext' || method == 'PlayLast') {
            queue(options.items, method);
        } else {
            playbackMgr.playFromOptions(data.options);
        }
    };

    var smartTranslate = method != 'PlayNext' && method != 'PlayLast';
    translateRequestedItems(data.userId, items, smartTranslate).then(callback);
}

export function instantMix(data, options, item) {
    getInstantMixItems(data.userId, item).then(function (result) {
        options.items = result.Items;
        playbackMgr.playFromOptions(data.options);
    });
}

export function shuffle(data, options, item) {
    getShuffleItems(data.userId, item).then(function (result) {
        options.items = result.Items;
        playbackMgr.playFromOptions(data.options);
    });
}

export function queue(items) {
    for (var i = 0, length = items.length; i < length; i++) {
        window.playlist.push(items[i]);
    }
}

export function onStopPlayerBeforePlaybackDone(item, options) {
    var requestUrl = JellyfinApi.createUserUrl('Items/' + item.Id);

    return JellyfinApi.authAjax(requestUrl, {
        dataType: 'json',
        type: 'GET'
    }).then(function (data) {
        // Attach the custom properties we created like userId, serverAddress, itemId, etc
        extend(data, item);

        playbackMgr.playItemInternal(data, options);
    }, broadcastConnectionErrorMessage);
}

export function getDeviceProfile(maxBitrate) {
    return deviceProfileBuilder({
        enableHls: true,
        bitrateSetting: maxBitrate
    });
}

var lastBitrateDetect = 0;
var detectedBitrate = 0;
export function getMaxBitrate() {
    console.log('getMaxBitrate');

    return new Promise(function (resolve) {
        // The client can set this number
        if (window.MaxBitrate) {
            console.log('bitrate is set to ' + window.MaxBitrate);

            resolve(window.MaxBitrate);
            return;
        }

        if (
            detectedBitrate &&
            new Date().getTime() - lastBitrateDetect < 600000
        ) {
            console.log(
                'returning previous detected bitrate of ' + detectedBitrate
            );
            resolve(detectedBitrate);
            return;
        }

        console.log('detecting bitrate');

        detectBitrate($scope).then(
            function (bitrate) {
                console.log('Max bitrate auto detected to ' + bitrate);
                lastBitrateDetect = new Date().getTime();
                detectedBitrate = bitrate;

                resolve(detectedBitrate);
            },
            function () {
                console.log(
                    'Error detecting bitrate, will return device maximum.'
                );
                resolve(getMaxBitrateSupport());
            }
        );
    });
}

export function validatePlaybackInfoResult(result) {
    if (result.ErrorCode) {
        showPlaybackInfoErrorMessage(result.ErrorCode);
        return false;
    }

    return true;
}

export function showPlaybackInfoErrorMessage(errorCode) {
    broadcastToMessageBus({
        type: 'playbackerror',
        message: errorCode
    });
}

export function getOptimalMediaSource(versions) {
    var optimalVersion = versions.filter(function (v) {
        v.enableDirectPlay = supportsDirectPlay(v);

        return v.enableDirectPlay;
    })[0];

    if (!optimalVersion) {
        optimalVersion = versions.filter(function (v) {
            return v.SupportsDirectStream;
        })[0];
    }

    return (
        optimalVersion ||
        versions.filter(function (s) {
            return s.SupportsTranscoding;
        })[0]
    );
}

export function supportsDirectPlay(mediaSource) {
    if (
        mediaSource.SupportsDirectPlay &&
        mediaSource.Protocol == 'Http' &&
        !mediaSource.RequiredHttpHeaders.length
    ) {
        // TODO: Need to verify the host is going to be reachable
        return true;
    }

    return false;
}

export function setTextTrack(index) {
    try {
        var textTracksManager = window.mediaManager.getTextTracksManager();
        if (index == null) {
            textTracksManager.setActiveByIds(null);
            return;
        }

        var tracks = textTracksManager.getTracks();
        var subtitleTrack = tracks.find(function (track) {
            return track.trackId === index;
        });
        if (subtitleTrack) {
            textTracksManager.setActiveByIds([subtitleTrack.trackId]);
            var subtitleAppearance = window.subtitleAppearance;
            if (subtitleAppearance) {
                var textTrackStyle = new cast.framework.messages.TextTrackStyle();
                if (subtitleAppearance.dropShadow != null) {
                    // Empty string is DROP_SHADOW
                    textTrackStyle.edgeType =
                        subtitleAppearance.dropShadow.toUpperCase() ||
                        cast.framework.messages.TextTrackEdgeType.DROP_SHADOW;
                    textTrackStyle.edgeColor = '#000000FF';
                }

                if (subtitleAppearance.font) {
                    textTrackStyle.fontFamily = subtitleAppearance.font;
                }

                if (subtitleAppearance.textColor) {
                    // Append the transparency, hardcoded to 100%
                    textTrackStyle.foregroundColor =
                        subtitleAppearance.textColor + 'FF';
                }

                if (subtitleAppearance.textBackground === 'transparent') {
                    textTrackStyle.backgroundColor = '#00000000'; // RGBA
                }

                switch (subtitleAppearance.textSize) {
                    case 'smaller':
                        textTrackStyle.fontScale = 0.6;
                        break;
                    case 'small':
                        textTrackStyle.fontScale = 0.8;
                        break;
                    case 'large':
                        textTrackStyle.fontScale = 1.15;
                        break;
                    case 'larger':
                        textTrackStyle.fontScale = 1.3;
                        break;
                    case 'extralarge':
                        textTrackStyle.fontScale = 1.45;
                        break;
                    default:
                        textTrackStyle.fontScale = 1.0;
                        break;
                }
                textTracksManager.setTextTrackStyle(textTrackStyle);
            }
        }
    } catch (e) {
        console.log('Setting subtitle track failed: ' + e);
    }
}

export function createMediaInformation(playSessionId, item, streamInfo) {
    var mediaInfo = new cast.framework.messages.MediaInformation();
    mediaInfo.contentId = streamInfo.url;
    mediaInfo.contentType = streamInfo.contentType;
    mediaInfo.customData = {
        startPositionTicks: streamInfo.startPositionTicks || 0,
        itemId: item.Id,
        mediaSourceId: streamInfo.mediaSource.Id,
        audioStreamIndex: streamInfo.audioStreamIndex,
        subtitleStreamIndex: streamInfo.subtitleStreamIndex,
        playMethod: streamInfo.isStatic ? 'DirectStream' : 'Transcode',
        runtimeTicks: streamInfo.mediaSource.RunTimeTicks,
        liveStreamId: streamInfo.mediaSource.LiveStreamId,
        canSeek: streamInfo.canSeek,
        canClientSeek: streamInfo.canClientSeek,
        playSessionId: playSessionId
    };

    mediaInfo.metadata = getMetadata(item);

    mediaInfo.streamType = cast.framework.messages.StreamType.BUFFERED;
    mediaInfo.tracks = streamInfo.tracks;

    if (streamInfo.mediaSource.RunTimeTicks) {
        mediaInfo.duration = Math.floor(
            streamInfo.mediaSource.RunTimeTicks / 10000000
        );
    }

    mediaInfo.customData.startPositionTicks = streamInfo.startPosition || 0;

    return mediaInfo;
}

// Set the available buttons in the UI controls.
const controls = cast.framework.ui.Controls.getInstance();
controls.clearDefaultSlotAssignments();

/* Disabled for now, dynamically set controls for each media type in the future.
// Assign buttons to control slots.
controls.assignButton(
    cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
    cast.framework.ui.ControlsButton.CAPTIONS
);*/

controls.assignButton(
    cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
    cast.framework.ui.ControlsButton.SEEK_BACKWARD_15
);
controls.assignButton(
    cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
    cast.framework.ui.ControlsButton.SEEK_FORWARD_15
);

const options = new cast.framework.CastReceiverOptions();
// Global variable set by Webpack
if (!PRODUCTION) {
    window.castReceiverContext.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    // Don't time out on me :(
    // This is only normally allowed for non media apps, but in this case
    // it's for debugging purposes.
    options.disableIdleTimeout = true;
    // This alternative seems to close sooner; I think it
    // quits once the client closes the connection.
    // options.maxInactivity = 3600;

    window.mediaManager.addEventListener(
        cast.framework.events.category.CORE,
        (event) => {
            console.log('Core event: ' + event.type);
            console.log(event);
        }
    );
} else {
    window.castReceiverContext.setLoggerLevel(cast.framework.LoggerLevel.NONE);
}

options.playbackConfig = new cast.framework.PlaybackConfig();
// Set the player to start playback as soon as there are five seconds of
// media content buffered. Default is 10.
options.playbackConfig.autoResumeDuration = 5;
options.playbackConfig.supportedCommands =
    cast.framework.messages.Command.ALL_BASIC_MEDIA;

window.castReceiverContext.start(options);
