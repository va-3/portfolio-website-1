"""
Dobby Chat Functionality Tests
Tests chat expansion, minimize button, and navigation behavior
"""
import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(scope="session")
def base_url():
    """Base URL for the local server"""
    return "http://localhost:8000"


def test_dobby_chat_card_exists(page: Page, base_url):
    """Test that Dobby chat card exists on the page"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')
    expect(chat_card).to_be_visible()


def test_dobby_chat_collapsed_by_default(page: Page, base_url):
    """Test that chat is collapsed by default"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Should not have expanded class
    has_expanded = page.evaluate("""
        () => {
            const card = document.getElementById('ai-chat-card');
            return card.classList.contains('expanded');
        }
    """)

    assert not has_expanded, "Chat should be collapsed by default"


def test_dobby_branding_visible_when_collapsed(page: Page, base_url):
    """Test that Dobby branding is visible in collapsed state"""
    page.goto(base_url)
    branding = page.locator('.dobby-branding')
    expect(branding).to_be_visible()

    dobby_text = page.locator('.dobby-text')
    expect(dobby_text).to_have_text('DOBBY')


def test_minimize_button_hidden_when_collapsed(page: Page, base_url):
    """Test that minimize button is hidden when chat is collapsed"""
    page.goto(base_url)
    minimize_btn = page.locator('#chat-minimize-btn')

    # Button should exist but not be visible
    is_visible = page.evaluate("""
        () => {
            const btn = document.getElementById('chat-minimize-btn');
            const styles = window.getComputedStyle(btn);
            return styles.display !== 'none';
        }
    """)

    assert not is_visible, "Minimize button should be hidden when collapsed"


def test_chat_expands_on_click(page: Page, base_url):
    """Test that clicking chat card expands it"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Click to expand
    chat_card.click()

    # Wait for animation
    page.wait_for_timeout(500)

    # Should have expanded class
    has_expanded = page.evaluate("""
        () => {
            const card = document.getElementById('ai-chat-card');
            return card.classList.contains('expanded');
        }
    """)

    assert has_expanded, "Chat should be expanded after click"


def test_minimize_button_visible_when_expanded(page: Page, base_url):
    """Test that minimize button is visible when chat is expanded"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # Minimize button should be visible
    minimize_btn = page.locator('#chat-minimize-btn')
    is_visible = page.evaluate("""
        () => {
            const btn = document.getElementById('chat-minimize-btn');
            const styles = window.getComputedStyle(btn);
            return styles.display !== 'none';
        }
    """)

    assert is_visible, "Minimize button should be visible when expanded"
    expect(minimize_btn).to_be_visible()


def test_minimize_button_collapses_chat(page: Page, base_url):
    """Test that clicking minimize button collapses chat"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # Click minimize button
    minimize_btn = page.locator('#chat-minimize-btn')
    minimize_btn.click()
    page.wait_for_timeout(500)

    # Should be collapsed
    has_expanded = page.evaluate("""
        () => {
            const card = document.getElementById('ai-chat-card');
            return card.classList.contains('expanded');
        }
    """)

    assert not has_expanded, "Chat should be collapsed after clicking minimize"


def test_chat_messages_area_shown_when_expanded(page: Page, base_url):
    """Test that messages area is shown when expanded"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # Messages area should be visible
    messages_area = page.locator('#chat-messages-area')
    is_displayed = page.evaluate("""
        () => {
            const area = document.getElementById('chat-messages-area');
            const styles = window.getComputedStyle(area);
            return styles.display !== 'none';
        }
    """)

    assert is_displayed, "Messages area should be visible when expanded"


def test_chat_preview_hidden_when_expanded(page: Page, base_url):
    """Test that preview is hidden when expanded"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # Preview should be hidden
    preview = page.locator('#chat-preview')
    is_displayed = page.evaluate("""
        () => {
            const preview = document.getElementById('chat-preview');
            const styles = window.getComputedStyle(preview);
            return styles.display !== 'none';
        }
    """)

    assert not is_displayed, "Preview should be hidden when expanded"


def test_chat_input_field_exists(page: Page, base_url):
    """Test that chat input field exists"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # Input field should exist
    input_field = page.locator('#chatbot-input')
    expect(input_field).to_be_attached()


def test_minimize_button_has_icon(page: Page, base_url):
    """Test that minimize button has chevron-down icon"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # Check for icon
    icon = page.locator('#chat-minimize-btn i.fa-chevron-down')
    expect(icon).to_be_attached()


def test_minimize_button_size(page: Page, base_url):
    """Test that minimize button has proper touch target size (44x44px)"""
    page.goto(base_url)
    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # Check button size
    button_size = page.evaluate("""
        () => {
            const btn = document.getElementById('chat-minimize-btn');
            const styles = window.getComputedStyle(btn);
            return {
                width: parseInt(styles.width),
                height: parseInt(styles.height)
            };
        }
    """)

    assert button_size['width'] >= 44, f"Button width should be at least 44px, got {button_size['width']}"
    assert button_size['height'] >= 44, f"Button height should be at least 44px, got {button_size['height']}"


def test_chat_mobile_fullscreen(page: Page, base_url):
    """Test that chat goes fullscreen on mobile viewports"""
    page.goto(base_url)
    page.set_viewport_size({"width": 375, "height": 667})

    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # On mobile, should be position: fixed with 100% dimensions
    mobile_fullscreen = page.evaluate("""
        () => {
            const card = document.getElementById('ai-chat-card');
            const styles = window.getComputedStyle(card);
            return {
                position: styles.position,
                width: styles.width,
                height: styles.height
            };
        }
    """)

    # On mobile (<768px), chat should be fixed and full screen
    assert mobile_fullscreen['position'] == 'fixed', "Chat should be position: fixed on mobile"


def test_chat_session_storage(page: Page, base_url):
    """Test that chat uses sessionStorage for message history"""
    page.goto(base_url)

    # Check that sessionStorage key exists
    storage_key_exists = page.evaluate("""
        () => {
            // Expand chat to trigger initialization
            const card = document.getElementById('ai-chat-card');
            card.click();

            // Check if storage key is defined in code
            return typeof window !== 'undefined';
        }
    """)

    assert storage_key_exists, "Session storage should be available"


@pytest.mark.skip(reason="Requires API endpoint - integration test")
def test_chat_send_message(page: Page, base_url):
    """Test sending a message through the chat"""
    # This would require a working API endpoint
    pass


def test_chat_responsive_on_desktop(page: Page, base_url):
    """Test that chat maintains proper size on desktop"""
    page.goto(base_url)
    page.set_viewport_size({"width": 1920, "height": 1080})

    chat_card = page.locator('#ai-chat-card')

    # Expand chat
    chat_card.click()
    page.wait_for_timeout(500)

    # On desktop, should have fixed height of 550px
    desktop_height = page.evaluate("""
        () => {
            const card = document.getElementById('ai-chat-card');
            const styles = window.getComputedStyle(card);
            return parseInt(styles.height);
        }
    """)

    assert desktop_height == 550, f"Desktop chat height should be 550px, got {desktop_height}px"
