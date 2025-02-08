export default function VideoPreview({ thumbnail, title }) {
    return (
        <div className="text-center">
            <img src={ thumbnail } alt="Video Thumbnail" className="mx-auto w-80 h-48 rounded-lg" />
            <h2 className="mt-2 text-lg font-semibold  text-slate-700 dark:text-white">{ title }</h2>
        </div>
    );
}