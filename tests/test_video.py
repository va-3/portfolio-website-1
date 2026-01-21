"""
Video Functionality Tests
Tests video click-to-fullscreen, reset behavior, and pause/play controls
"""
import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(scope="session")
def base_url():
    """Base URL for the local server"""
    return "http://localhost:8000"


def test_video_exists(page: Page, base_url):
    """Test that video element exists on the page"""
    page.goto(base_url)
    video = page.locator('.video-container video')
    expect(video).to_be_visible()


def test_video_has_poster(page: Page, base_url):
    """Test that video has poster attribute"""
    page.goto(base_url)
    video = page.locator('.video-container video')
    poster = video.get_attribute('poster')
    assert poster == "images/video-thumbnail.jpg"


def test_video_no_controls_in_collapsed_state(page: Page, base_url):
    """Test that video doesn't have controls in collapsed state"""
    page.goto(base_url)
    video = page.locator('.video-container video')
    has_controls = video.get_attribute('controls')
    assert has_controls is None, "Video should not have controls in collapsed state"


def test_video_starts_at_zero(page: Page, base_url):
    """Test that video always starts at 0:00"""
    page.goto(base_url)
    video = page.locator('.video-container video')

    current_time = page.evaluate("""
        () => {
            const video = document.querySelector('.video-container video');
            return video.currentTime;
        }
    """)

    assert current_time == 0, f"Video should start at 0:00, got {current_time}"


def test_video_reset_on_page_refresh(page: Page, base_url):
    """Test that video resets to 0:00 after page refresh"""
    page.goto(base_url)

    # Simulate video playback
    page.evaluate("""
        () => {
            const video = document.querySelector('.video-container video');
            video.currentTime = 5.0; // Set to 5 seconds
        }
    """)

    # Verify it's at 5 seconds
    current_time = page.evaluate("() => document.querySelector('.video-container video').currentTime")
    assert current_time == 5.0

    # Refresh page
    page.reload()

    # Verify it's back to 0:00
    current_time = page.evaluate("() => document.querySelector('.video-container video').currentTime")
    assert current_time == 0, f"Video should reset to 0:00 after refresh, got {current_time}"


def test_video_overlay_visible(page: Page, base_url):
    """Test that video overlay with 'Click to watch' is visible on hover"""
    page.goto(base_url)

    video_container = page.locator('.video-container')
    video_container.hover()

    # Wait a moment for transition
    page.wait_for_timeout(500)

    overlay = page.locator('.video-overlay')
    expect(overlay).to_be_visible()


def test_video_click_triggers_fullscreen_request(page: Page, base_url):
    """Test that clicking video triggers fullscreen request"""
    page.goto(base_url)

    # Set up listener for fullscreen request
    fullscreen_requested = page.evaluate("""
        () => {
            return new Promise((resolve) => {
                const video = document.querySelector('.video-container video');
                const originalRequestFullscreen = video.requestFullscreen;

                video.requestFullscreen = function() {
                    resolve(true);
                    return Promise.resolve();
                };

                // Trigger click after 100ms
                setTimeout(() => {
                    video.click();
                }, 100);
            });
        }
    """)

    assert fullscreen_requested, "Clicking video should trigger fullscreen request"


def test_video_no_inline_playback(page: Page, base_url):
    """Test that video doesn't play inline (only in fullscreen)"""
    page.goto(base_url)

    # Try to play video programmatically
    play_prevented = page.evaluate("""
        () => {
            const video = document.querySelector('.video-container video');

            return new Promise((resolve) => {
                video.addEventListener('play', (e) => {
                    // Check if video is paused immediately after play event
                    setTimeout(() => {
                        resolve(video.paused);
                    }, 100);
                });

                video.play();
            });
        }
    """)

    assert play_prevented, "Video should be paused if not in fullscreen"


def test_no_localstorage_persistence(page: Page, base_url):
    """Test that no localStorage is used for video progress"""
    page.goto(base_url)

    # Check localStorage for video progress keys
    storage_keys = page.evaluate("""
        () => {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.includes('video-progress')) {
                    keys.push(key);
                }
            }
            return keys;
        }
    """)

    assert len(storage_keys) == 0, f"Should have no video-progress in localStorage, found: {storage_keys}"


@pytest.mark.skip(reason="Requires actual fullscreen capability - manual test only")
def test_video_pause_play_in_fullscreen(page: Page, base_url):
    """Test pause/play toggle when clicking video in fullscreen"""
    # This test requires actual fullscreen capability
    # In real browser with user gesture, video should toggle pause/play
    pass


def test_video_responsive_layout(page: Page, base_url):
    """Test video container is responsive"""
    page.goto(base_url)

    # Desktop viewport
    page.set_viewport_size({"width": 1920, "height": 1080})
    video = page.locator('.video-container video')
    expect(video).to_be_visible()

    # Tablet viewport
    page.set_viewport_size({"width": 768, "height": 1024})
    expect(video).to_be_visible()

    # Mobile viewport
    page.set_viewport_size({"width": 375, "height": 667})
    expect(video).to_be_visible()


def test_video_element_attributes(page: Page, base_url):
    """Test video element has correct attributes"""
    page.goto(base_url)
    video = page.locator('.video-container video')

    # Should have playsinline attribute for iOS
    playsinline = video.get_attribute('playsinline')
    assert playsinline is not None, "Video should have playsinline attribute"

    # Should have source element
    source = page.locator('.video-container video source')
    expect(source).to_be_visible()

    src = source.get_attribute('src')
    assert 'about-me.mp4' in src, f"Video source should be about-me.mp4, got {src}"
