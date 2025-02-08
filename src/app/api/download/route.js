// api/download.js
import ytdl from 'ytdl-core';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const itag = searchParams.get('itag');

    if (!ytdl.validateURL(url)) {
        return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const videoStream = ytdl(url, {
            quality: itag,
            filter: format => format.hasAudio && format.hasVideo // Ensure both audio and video are included
        });

        return new Response(videoStream, {
            status: 200,
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': 'attachment; filename="video.mp4"'
            }
        });
    } catch (error) {
        console.error('Download Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to stream video' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}