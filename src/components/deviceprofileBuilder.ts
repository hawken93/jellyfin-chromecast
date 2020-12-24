import { CodecProfile } from '../api/generated/models/codec-profile';
import { ContainerProfile } from '../api/generated/models/container-profile';
import { DeviceProfile } from '../api/generated/models/device-profile';
import { DirectPlayProfile } from '../api/generated/models/direct-play-profile';
import { DlnaProfileType } from '../api/generated/models/dlna-profile-type';
import { EncodingContext } from '../api/generated/models/encoding-context';
import { ProfileCondition } from '../api/generated/models/profile-condition';
import { ProfileConditionType } from '../api/generated/models/profile-condition-type';
import { ResponseProfile } from '../api/generated/models/response-profile';
import { SubtitleDeliveryMethod } from '../api/generated/models/subtitle-delivery-method';
import { SubtitleProfile } from '../api/generated/models/subtitle-profile';
import { TranscodingProfile } from '../api/generated/models/transcoding-profile';
import { CodecType } from '../api/generated/models/codec-type';
import { ProfileConditionValue } from '../api/generated/models/profile-condition-value';

import { deviceIds, getActiveDeviceId } from './castDevices';

import {
    hasTextTrackSupport,
    hasVP8Support,
    hasVP9Support,
    hasHEVCSupport,
    getMaxWidthSupport,
    getH264ProfileSupport,
    getH264LevelSupport,
    getHEVCProfileSupport,
    getHEVCLevelSupport,
    getSupportedVPXVideoCodecs,
    getSupportedMP4VideoCodecs,
    getSupportedMP4AudioCodecs,
    getSupportedmkvAudioCodecs,
    getSupportedHLSVideoCodecs,
    getSupportedHLSAudioCodecs,
    getSupportedSurroundCodecs,
    getSupportedWebMAudioCodecs,
    getSupportedAudioCodecs
} from './codecSupportHelper';

interface ProfileOptions {
    enableHls: boolean;
    bitrateSetting: number;
}

let profileOptions: ProfileOptions;
let currentDeviceId: number;

/**
 * @param {ProfileConditionValue} Property What property the condition should test.
 * @param {ProfileConditionType} Condition The condition to test the values for.
 * @param {string} Value The value to compare against.
 * @param {boolean} [IsRequired=false] Don't permit unknown values
 * @returns {ProfileCondition} A profile condition created from the parameters.
 */
function createProfileCondition(
    Property: ProfileConditionValue,
    Condition: ProfileConditionType,
    Value: string,
    IsRequired = false
): ProfileCondition {
    return {
        Condition,
        Property,
        Value,
        IsRequired
    };
}

/**
 * @returns Container profiles.
 */
function getContainerProfiles(): Array<ContainerProfile> {
    return [];
}

/**
 * @returns Response profiles.
 */
function getResponseProfiles(): Array<ResponseProfile> {
    return [];
}

/**
 * @returns Direct play profiles.
 */
function getDirectPlayProfiles(): Array<DirectPlayProfile> {
    const DirectPlayProfiles: Array<DirectPlayProfile> = [];

    if (currentDeviceId !== deviceIds.AUDIO) {
        // For devices with video
        const mp4VideoCodecs = getSupportedMP4VideoCodecs();
        const mp4AudioCodecs = getSupportedMP4AudioCodecs();
        const surroundAudioCodecs = getSupportedSurroundCodecs();
        const vpxVideoCodecs = getSupportedVPXVideoCodecs();
        const webmAudioCodecs = getSupportedWebMAudioCodecs();

        for (const codec of vpxVideoCodecs) {
            DirectPlayProfiles.push({
                Container: 'webm',
                Type: DlnaProfileType.Video,
                AudioCodec: webmAudioCodecs.join(','),
                VideoCodec: codec
            });
        }

        // mkv profile: surround and normal codecs
        DirectPlayProfiles.push({
            Container: 'mkv',
            Type: DlnaProfileType.Video,
            VideoCodec: mp4VideoCodecs.join(','),
            AudioCodec: getSupportedmkvAudioCodecs()
                .concat(surroundAudioCodecs)
                .join(',')
        });

        // HLS+MPEGTS profile
        DirectPlayProfiles.push({
            Container: 'mp4,m4v',
            Type: DlnaProfileType.Video,
            VideoCodec: mp4VideoCodecs.join(','),
            AudioCodec: mp4AudioCodecs.join(',')
        });
    }

    const supportedAudio = getSupportedAudioCodecs();

    for (const audioFormat of supportedAudio) {
        if (audioFormat === 'mp3') {
            DirectPlayProfiles.push({
                Container: audioFormat,
                Type: DlnaProfileType.Audio,
                AudioCodec: audioFormat
            });
        } else if (audioFormat === 'webma') {
            DirectPlayProfiles.push({
                Container: 'webma,webm',
                Type: DlnaProfileType.Audio
            });
        } else {
            DirectPlayProfiles.push({
                Container: audioFormat,
                Type: DlnaProfileType.Audio
            });
        }

        // aac also appears in the m4a and m4b container
        if (audioFormat === 'aac') {
            DirectPlayProfiles.push({
                Container: 'm4a,m4b',
                AudioCodec: audioFormat,
                Type: DlnaProfileType.Audio
            });
        }
    }

    return DirectPlayProfiles;
}

/**
 * @returns Codec profiles.
 */
function getCodecProfiles(): Array<CodecProfile> {
    const CodecProfiles: Array<CodecProfile> = [];

    const audioConditions: CodecProfile = {
        Type: CodecType.Audio,
        Codec: 'flac',
        Conditions: [
            createProfileCondition(
                ProfileConditionValue.AudioSampleRate,
                ProfileConditionType.LessThanEqual,
                '96000'
            ),
            createProfileCondition(
                ProfileConditionValue.AudioBitDepth,
                ProfileConditionType.LessThanEqual,
                '24'
            )
        ]
    };

    CodecProfiles.push(audioConditions);

    // If device is audio only, don't add all the video related stuff
    if (currentDeviceId == deviceIds.AUDIO) {
        return CodecProfiles;
    }

    for (const acodec in getSupportedmkvAudioCodecs()) {
        CodecProfiles.push({
            Type: CodecType.VideoAudio,
            Codec: acodec,
            Conditions: [
                // Not sure what secondary audio means in this context. Multiple audio tracks?
                //createProfileCondition(
                //    ProfileConditionValue.IsSecondaryAudio,
                //    ProfileConditionType.Equals,
                //    'false'
                //),
                createProfileCondition(
                    ProfileConditionValue.IsSecondaryAudio,
                    ProfileConditionType.LessThanEqual,
                    '2'
                )
            ]
        });
    }

    const maxWidth: number = getMaxWidthSupport(currentDeviceId);

    CodecProfiles.push({
        Type: CodecType.Video,
        Codec: 'h264',
        Conditions: [
            createProfileCondition(
                ProfileConditionValue.IsAnamorphic,
                ProfileConditionType.NotEquals,
                'true'
            ),
            createProfileCondition(
                ProfileConditionValue.VideoProfile,
                ProfileConditionType.EqualsAny,
                getH264ProfileSupport()
            ),
            createProfileCondition(
                ProfileConditionValue.VideoLevel,
                ProfileConditionType.LessThanEqual,
                getH264LevelSupport(currentDeviceId).toString()
            ),
            createProfileCondition(
                ProfileConditionValue.Width,
                ProfileConditionType.LessThanEqual,
                maxWidth.toString(),
                true
            )
        ]
    });

    if (hasHEVCSupport()) {
        CodecProfiles.push({
            Type: CodecType.Video,
            Codec: 'hevc',
            Conditions: [
                createProfileCondition(
                    ProfileConditionValue.IsAnamorphic,
                    ProfileConditionType.NotEquals,
                    'true'
                ),
                createProfileCondition(
                    ProfileConditionValue.VideoProfile,
                    ProfileConditionType.EqualsAny,
                    getHEVCProfileSupport(currentDeviceId)
                ),
                createProfileCondition(
                    ProfileConditionValue.VideoLevel,
                    ProfileConditionType.LessThanEqual,
                    getHEVCLevelSupport(currentDeviceId).toString()
                ),
                createProfileCondition(
                    ProfileConditionValue.Width,
                    ProfileConditionType.LessThanEqual,
                    maxWidth.toString(),
                    true
                )
            ]
        });
    }

    // Not sure about this one, isn't it covered above? Or can we use this
    // for common conditions?
    CodecProfiles.push({
        Type: CodecType.Video,
        Conditions: [
            createProfileCondition(
                ProfileConditionValue.Width,
                ProfileConditionType.LessThanEqual,
                maxWidth.toString(),
                true
            )
        ]
    });

    CodecProfiles.push({
        Type: CodecType.VideoAudio,
        Conditions: [
            createProfileCondition(
                ProfileConditionValue.IsSecondaryAudio,
                ProfileConditionType.Equals,
                'false'
            )
        ]
    });

    return CodecProfiles;
}

/**
 * @returns Transcoding profiles.
 */
function getTranscodingProfiles(): Array<TranscodingProfile> {
    const TranscodingProfiles: Array<TranscodingProfile> = [];

    const hlsAudioCodecs = getSupportedHLSAudioCodecs();

    if (profileOptions.enableHls !== false) {
        // HLS for audio only
        TranscodingProfiles.push({
            Container: 'ts',
            Type: DlnaProfileType.Audio,
            AudioCodec: hlsAudioCodecs.join(','),
            Context: EncodingContext.Streaming,
            Protocol: 'hls',
            // only 2ch supported for audio
            MaxAudioChannels: '2',
            MinSegments: 1,
            BreakOnNonKeyFrames: false
        });
    }

    const supportedAudio = getSupportedAudioCodecs();
    const surroundCodecs = getSupportedSurroundCodecs();

    // audio only profiles here
    for (const audioFormat of supportedAudio) {
        // direct download audio
        TranscodingProfiles.push({
            Container: audioFormat,
            Type: DlnaProfileType.Audio,
            AudioCodec: audioFormat,
            Context: EncodingContext.Streaming,
            Protocol: 'http',
            // only 2ch supported for audio
            MaxAudioChannels: '2'
        });
    }

    // If device is audio only, don't add all the video related stuff
    if (currentDeviceId == deviceIds.AUDIO) {
        return TranscodingProfiles;
    }

    const hlsVideoCodecs = getSupportedHLSVideoCodecs();

    if (hlsVideoCodecs.length) {
        // We must do HLS, come on
        if (surroundCodecs.length) {
            // Direct streaming for passthrough codecs
            TranscodingProfiles.push({
                Container: 'mkv',
                Type: DlnaProfileType.Video,
                AudioCodec: surroundCodecs.join(','),
                VideoCodec: hlsVideoCodecs.join(','),
                Context: EncodingContext.Streaming,
                Protocol: 'http',
                MaxAudioChannels: '8'
            });
        }

        // Direct streaming for normal codecs
        TranscodingProfiles.push({
            Container: 'mkv',
            Type: DlnaProfileType.Video,
            AudioCodec: getSupportedmkvAudioCodecs().join(','),
            VideoCodec: hlsVideoCodecs.join(','),
            Context: EncodingContext.Streaming,
            Protocol: 'http',
            MaxAudioChannels: '2'
        });

        if (hlsAudioCodecs.length && profileOptions.enableHls !== false) {
            TranscodingProfiles.push({
                Container: 'ts',
                Type: DlnaProfileType.Video,
                AudioCodec: hlsAudioCodecs.join(','),
                VideoCodec: hlsVideoCodecs.join(','),
                Context: EncodingContext.Streaming,
                Protocol: 'hls',
                // Only stereo for this mode
                MaxAudioChannels: '2',
                MinSegments: 1,
                BreakOnNonKeyFrames: false
            });
        }
    }

    if (hasVP8Support() || hasVP9Support()) {
        TranscodingProfiles.push({
            Container: 'webm',
            Type: DlnaProfileType.Video,
            AudioCodec: 'vorbis',
            VideoCodec: 'vpx',
            Context: EncodingContext.Streaming,
            Protocol: 'http',
            // If audio transcoding is needed, limit channels to number of physical audio channels
            // Trying to transcode to 5 channels when there are only 2 speakers generally does not sound good
            MaxAudioChannels: surroundCodecs.length ? '6' : '2'
        });
    }

    return TranscodingProfiles;
}

/**
 * @returns Subtitle profiles.
 */
function getSubtitleProfiles(): Array<SubtitleProfile> {
    const subProfiles: Array<SubtitleProfile> = [];

    if (hasTextTrackSupport(currentDeviceId)) {
        subProfiles.push({
            Format: 'vtt',
            Method: SubtitleDeliveryMethod.External
        });

        subProfiles.push({
            Format: 'vtt',
            Method: SubtitleDeliveryMethod.Hls
        });
    }

    return subProfiles;
}

/**
 * Creates a device profile containing supported codecs for the active Cast device.
 *
 * @param options Profile options
 * @returns Device profile.
 */
export function getDeviceProfile(options: ProfileOptions): DeviceProfile {
    profileOptions = options;
    currentDeviceId = getActiveDeviceId();

    // MaxStaticBitrate seems to be for offline sync only
    const profile: DeviceProfile = {
        MaxStreamingBitrate: options.bitrateSetting,
        MaxStaticBitrate: options.bitrateSetting,
        MusicStreamingTranscodingBitrate: options.bitrateSetting
    };

    profile.DirectPlayProfiles = getDirectPlayProfiles();
    profile.TranscodingProfiles = getTranscodingProfiles();
    profile.ContainerProfiles = getContainerProfiles();
    profile.CodecProfiles = getCodecProfiles();
    profile.SubtitleProfiles = getSubtitleProfiles();
    profile.ResponseProfiles = getResponseProfiles();

    return profile;
}

export default getDeviceProfile;
