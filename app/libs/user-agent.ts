import Bowser from 'bowser';

// Functions
function getPlatformTypeName(platformType?: string) {
    switch (platformType) {
        case 'bot': return '自動化工具';
        case 'desktop': return '電腦';
        case 'mobile': return '手機';
        case 'tablet': return '平板';
        case 'tv': return '智慧電視';
        default: return '未知裝置';
    }
}

export function parseUserAgentToDeviceInfo(userAgent?: string) {
    if (!userAgent) return '未知裝置';
    const {
        browser,
        os,
        platform,
    } = Bowser.parse(userAgent);

    const browserName = [
        browser.name,
        browser.version,
    ].filter((value) => value).join(' ');

    const osName = [
        os.name,
        os.versionName || os.version,
    ].filter((value) => value).join(' ');

    const platformName = [
        platform.vendor,
        platform.model,
    ].filter((value) => value).join(' ');

    const platformTypeName = platformName || osName ? '' : getPlatformTypeName(platform.type);

    return [
        browserName,
        platformName,
        osName,
        platformTypeName,
    ].filter((value) => value).join(' · ') || '未知裝置';
}
