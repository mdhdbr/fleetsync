import { useState, useEffect, useRef } from 'react';

const TimelineSlider = ({ telemetryEvents = [], onTimeChange }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const intervalRef = useRef(null);

    // Get time range from telemetry events
    const timeRange = telemetryEvents.length > 0 ? {
        start: new Date(telemetryEvents[0].ts).getTime(),
        end: new Date(telemetryEvents[telemetryEvents.length - 1].ts).getTime()
    } : null;

    // Initialize current time to start
    useEffect(() => {
        if (timeRange && !currentTime) {
            setCurrentTime(timeRange.start);
        }
    }, [timeRange]);

    // Handle playback
    useEffect(() => {
        if (isPlaying && timeRange) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const next = prev + (5 * 60 * 1000 * playbackSpeed); // 5 minutes per tick
                    if (next >= timeRange.end) {
                        setIsPlaying(false);
                        return timeRange.end;
                    }
                    return next;
                });
            }, 1000); // Update every second
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, playbackSpeed, timeRange]);

    // Notify parent of time changes
    useEffect(() => {
        if (currentTime && onTimeChange) {
            onTimeChange(currentTime);
        }
    }, [currentTime, onTimeChange]);

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value);
        setCurrentTime(value);
        setIsPlaying(false);
    };

    const togglePlayback = () => {
        if (currentTime >= timeRange.end) {
            setCurrentTime(timeRange.start);
        }
        setIsPlaying(!isPlaying);
    };

    const resetTimeline = () => {
        setCurrentTime(timeRange.start);
        setIsPlaying(false);
    };

    if (!timeRange) {
        return (
            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                No telemetry data available for timeline playback
            </div>
        );
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const progress = ((currentTime - timeRange.start) / (timeRange.end - timeRange.start)) * 100;

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlayback}
                    className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                {/* Reset Button */}
                <button
                    onClick={resetTimeline}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
                >
                    ⏮
                </button>

                {/* Timeline Slider */}
                <div className="flex-1">
                    <input
                        type="range"
                        min={timeRange.start}
                        max={timeRange.end}
                        value={currentTime}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>{formatTime(timeRange.start)}</span>
                        <span className="font-semibold text-blue-600">{formatTime(currentTime)}</span>
                        <span>{formatTime(timeRange.end)}</span>
                    </div>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Speed:</span>
                    <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                        <option value="5">5x</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TimelineSlider;
