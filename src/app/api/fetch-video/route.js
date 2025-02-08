// api/fetch-video.js
import ytdl from 'ytdl-core';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!ytdl.validateURL(url)) {
        return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const info = await ytdl.getInfo(url);
        const thumbnail = info.videoDetails.thumbnails.pop().url;
        const title = info.videoDetails.title;

        // Use a Set to filter out duplicate formats based on qualityLabel
        const uniqueFormats = new Map();
        info.formats
            .filter(f => f.qualityLabel && f.hasAudio && f.hasVideo) // Ensure both audio and video are included
            .forEach(f => {
                if (!uniqueFormats.has(f.qualityLabel)) {
                    uniqueFormats.set(f.qualityLabel, {
                        itag: f.itag,
                        quality: f.qualityLabel,
                        mimeType: f.mimeType
                    });
                }
            });

        const formats = Array.from(uniqueFormats.values());

        return new Response(JSON.stringify({ thumbnail, title, formats }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Fetch Video Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch video details' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}