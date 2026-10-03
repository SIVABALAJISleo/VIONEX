# VIONEX Formal Feature Parity Matrix

**Project:** VIONEX Video Platform  
**Total Features Tracked:** 370  
**Parity Target:** 90–95% User-Facing Capability Parity  
**Scoring Formula:** Sum(Implemented_Weight) / Sum(Applicable_Weight) * 100  

| Feature ID | Domain | Description | Target User | Reference Source | Status | Weight | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `CORE-001` | **CORE_USER_FEATURES** | Play/Pause video toggle with keyboard shortcut (Space/K) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-002` | **CORE_USER_FEATURES** | Seek forward/backward by 5s/10s with keyboard arrows (J/L/Left/Right) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-003` | **CORE_USER_FEATURES** | Volume slider with mute toggle and M shortcut | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-004` | **CORE_USER_FEATURES** | Fullscreen toggle with F shortcut and Escape exit | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-005` | **CORE_USER_FEATURES** | Picture-in-Picture (PiP) support across modern browsers | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-006` | **CORE_USER_FEATURES** | Playback speed selector (0.25x to 2.0x in 0.25x steps) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-007` | **CORE_USER_FEATURES** | Adaptive Bitrate (ABR) rendition switcher (Auto, 1080p, 720p, 480p, 360p, 240p) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-008` | **CORE_USER_FEATURES** | Closed Captions / WebVTT subtitle display with custom styling | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-009` | **CORE_USER_FEATURES** | Multiple audio track selection for multi-language videos | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-010` | **CORE_USER_FEATURES** | Interactive video chapter markers on progress bar with tooltip preview | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-011` | **CORE_USER_FEATURES** | Thumbnail preview sprite on timeline hover | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-012` | **CORE_USER_FEATURES** | Persistent playback resume position saved per user/video | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-013` | **CORE_USER_FEATURES** | Miniplayer mode allowing continued watching while browsing platform | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-014` | **CORE_USER_FEATURES** | Autoplay toggle with configurable countdown timer | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-015` | **CORE_USER_FEATURES** | Theater / cinema mode expanding player viewport | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-016` | **CORE_USER_FEATURES** | Touch gesture seek and double-tap skip on mobile viewports | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-017` | **CORE_USER_FEATURES** | Player error handling with graceful fallback and retry button | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-018` | **CORE_USER_FEATURES** | DVR live seeking support for active livestreams | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-019` | **CORE_USER_FEATURES** | Network degradation detection with seamless lower-rendition switch | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-020` | **CORE_USER_FEATURES** | Zero-layout-shift video player container with 16:9 aspect ratio preservation | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-021` | **CORE_USER_FEATURES** | Video title, publication date, and view counter display | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-022` | **CORE_USER_FEATURES** | Expandable video description with markdown and timestamp links | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-023` | **CORE_USER_FEATURES** | Hashtag rendering in description linking to hashtag search feeds | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-024` | **CORE_USER_FEATURES** | Like and Dislike engagement buttons with optimistic UI updates | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-025` | **CORE_USER_FEATURES** | Video share modal with timestamped deep-link and social shortcuts | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-026` | **CORE_USER_FEATURES** | Save to Playlist modal with instant playlist creation | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-027` | **CORE_USER_FEATURES** | Download video option with expiring signed download URL | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-028` | **CORE_USER_FEATURES** | Video report action triggering trust & safety report modal | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-029` | **CORE_USER_FEATURES** | Interactive transcript panel with auto-scroll synced to playback | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-030` | **CORE_USER_FEATURES** | Related videos recommendation sidebar on desktop watch page | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-031` | **CORE_USER_FEATURES** | Autoplay next recommended video queue with cancellation | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-032` | **CORE_USER_FEATURES** | End-screen card overlays linking to channel and related videos | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-033` | **CORE_USER_FEATURES** | Mobile-optimized watch layout with collapsible comment sheet | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-034` | **CORE_USER_FEATURES** | Personalized Home feed generating diverse candidate recommendations | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-035` | **CORE_USER_FEATURES** | Infinite scroll pagination with stable keyset cursors | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-036` | **CORE_USER_FEATURES** | Home feed category filter pills (All, Music, Gaming, Tech, News) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-037` | **CORE_USER_FEATURES** | Trending feed ranked by velocity and engagement decay | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-038` | **CORE_USER_FEATURES** | Explore hub featuring rising creators and popular categories | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-039` | **CORE_USER_FEATURES** | Watch History page with search and clear history controls | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-040` | **CORE_USER_FEATURES** | Watch Later system playlist with reordering and quick remove | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-041` | **CORE_USER_FEATURES** | Liked Videos system playlist aggregating positive feedback | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-042` | **CORE_USER_FEATURES** | Global navigation header with search input, notifications, and profile menu | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-043` | **CORE_USER_FEATURES** | Collapsible desktop sidebar with compact rail mode | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-044` | **CORE_USER_FEATURES** | Mobile bottom navigation bar with quick access to Home, Shorts, Subscriptions | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-045` | **CORE_USER_FEATURES** | High-contrast dark and light theme switching with system auto-detect | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-046` | **CORE_USER_FEATURES** | WCAG 2.2 AA compliant keyboard focus indicators across all views | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-047` | **CORE_USER_FEATURES** | Screen-reader ARIA live regions for dynamic player and feed updates | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-048` | **CORE_USER_FEATURES** | Offline PWA app shell with service worker asset caching | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-049` | **CORE_USER_FEATURES** | Data Saver playback mode capping resolutions to 480p on cellular networks | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-050` | **CORE_USER_FEATURES** | Localization engine supporting English, Tamil, Hindi, Malayalam, Telugu | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-051` | **CORE_USER_FEATURES** | Safe Mode / Restricted Mode toggle filtering sensitive/mature content | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-052` | **CORE_USER_FEATURES** | Universal embed player with iframe isolation and privacy mode | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-053` | **CORE_USER_FEATURES** | Embed domain allowlist/denylist enforcement | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-054` | **CORE_USER_FEATURES** | Anonymous view registration with bot suppression and rate limits | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-055` | **CORE_USER_FEATURES** | Fast page transitions with Next.js App Router and optimistic navigation | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-056` | **CORE_USER_FEATURES** | Skeleton loading state for video grid cards and metadata | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-057` | **CORE_USER_FEATURES** | Empty state illustrations with actionable call-to-actions | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-058` | **CORE_USER_FEATURES** | Error boundaries preventing whole-app crash on sub-component failure | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-059` | **CORE_USER_FEATURES** | Browser history navigation preserving player state where possible | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-060` | **CORE_USER_FEATURES** | Video card hover preview playing muted short preview clip | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-061` | **CORE_USER_FEATURES** | Channel avatar and name badge with verified creator icon | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-062` | **CORE_USER_FEATURES** | Relative timestamp formatting (e.g. '2 hours ago', '3 days ago') | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-063` | **CORE_USER_FEATURES** | Compact view count formatting (e.g. '1.2M views', '45K views') | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-064` | **CORE_USER_FEATURES** | Notification toast for background events and system alerts | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-065` | **CORE_USER_FEATURES** | Keyboard shortcut cheat sheet modal accessible via '?' key | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-066` | **CORE_USER_FEATURES** | Responsive video grid adjusting columns from 1 to 5 based on screen width | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-067` | **CORE_USER_FEATURES** | Video embed responsive wrapper supporting standard oEmbed discovery | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-068` | **CORE_USER_FEATURES** | Watch progress indicator bar displayed on video card thumbnails | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-069` | **CORE_USER_FEATURES** | Auto-reconnect logic for interrupted media stream playback | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-070` | **CORE_USER_FEATURES** | Memory leak prevention on unmount of HLS video player instance | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-071` | **CORE_USER_FEATURES** | Signed playback token validation preventing hotlinking of private assets | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-072` | **CORE_USER_FEATURES** | Audio volume normalization (loudness equalization) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-073` | **CORE_USER_FEATURES** | Buffer health telemetry reporting rebuffer ratio to analytics | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-074` | **CORE_USER_FEATURES** | Dynamic document title updating to current video title and channel | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-075` | **CORE_USER_FEATURES** | Media Session API integration for OS lock-screen media controls | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-076` | **CORE_USER_FEATURES** | Ambient lighting player mode projecting video edge colors onto backdrop | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-077` | **CORE_USER_FEATURES** | Video loop toggle for repeating playback continuously | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-078` | **CORE_USER_FEATURES** | Copy video URL at current time to clipboard shortcut | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-079` | **CORE_USER_FEATURES** | Stats for nerds overlay showing codec, resolution, bitrate, buffer health | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-080` | **CORE_USER_FEATURES** | Auto-pause when video is scrolled out of viewport (configurable) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-081` | **CORE_USER_FEATURES** | Seamless quality transition without screen blackouts using HLS dual buffers | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-082` | **CORE_USER_FEATURES** | Subtitles font size, color, background opacity customization settings | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-083` | **CORE_USER_FEATURES** | Multi-language audio track indicator in player settings menu | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-084` | **CORE_USER_FEATURES** | Speed pitch correction preserving natural voice tone on accelerated playback | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-085` | **CORE_USER_FEATURES** | Keyboard seek acceleration on holding arrow keys | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-086` | **CORE_USER_FEATURES** | Touch swipe volume and brightness gestures on mobile fullscreen player | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-087` | **CORE_USER_FEATURES** | Picture-in-picture auto-trigger on switching browser tabs (where permitted) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-088` | **CORE_USER_FEATURES** | AirPlay and Google Cast sender integration in player toolbar | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-089` | **CORE_USER_FEATURES** | Video unavailable graceful error screen (private, deleted, blocked) | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-090` | **CORE_USER_FEATURES** | Age-gate verification screen requiring authenticated confirmation | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-091` | **CORE_USER_FEATURES** | Geographic restriction advisory message with explanation | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-092` | **CORE_USER_FEATURES** | Custom branded watermark in player bottom-right corner linking to channel | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-093` | **CORE_USER_FEATURES** | Video metadata JSON-LD structured data for rich search engine indexing | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-094` | **CORE_USER_FEATURES** | OpenGraph and Twitter Card social preview tags for all watch URLs | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-095` | **CORE_USER_FEATURES** | RSS feed endpoint for public channels and category feeds | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-096` | **CORE_USER_FEATURES** | PWA install banner with custom install prompt trigger | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-097` | **CORE_USER_FEATURES** | Network offline banner warning user when internet connection is lost | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-098` | **CORE_USER_FEATURES** | Reduced motion preference detection disabling intensive background animations | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-099` | **CORE_USER_FEATURES** | Accessible color contrast ratios exceeding 4.5:1 across all themes | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CORE-100` | **CORE_USER_FEATURES** | Zero tracking cookies mode for anonymous visitors before consent | Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.6 | `E2E_TEST` |
| `CREAT-001` | **CREATOR_FEATURES** | Multi-channel creation under a single authenticated user account | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-002` | **CREATOR_FEATURES** | Custom channel handle reservation with uniqueness validation | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-003` | **CREATOR_FEATURES** | Channel avatar image upload with client-side crop tool and WebP transcode | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-004` | **CREATOR_FEATURES** | Channel banner upload with responsive safe-area crop guidelines | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-005` | **CREATOR_FEATURES** | Channel trailer assignment for non-subscribed visitors | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-006` | **CREATOR_FEATURES** | Featured video showcase section on channel homepage | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-007` | **CREATOR_FEATURES** | Custom channel section organization (Uploads, Popular, Playlists, Shorts) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-008` | **CREATOR_FEATURES** | Granular channel team roles (Owner, Manager, Editor, Moderator, Analyst) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-009` | **CREATOR_FEATURES** | Channel collaborator invitation via email with secure acceptance link | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-010` | **CREATOR_FEATURES** | Channel verification badge request workflow with audit logging | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-011` | **CREATOR_FEATURES** | Channel deletion and transfer of ownership with 2FA verification | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-012` | **CREATOR_FEATURES** | Drag-and-drop video file uploader supporting multi-gigabyte files | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-013` | **CREATOR_FEATURES** | Resumable chunked upload protocol recovering from network disconnection | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-014` | **CREATOR_FEATURES** | Pre-upload client-side checksum and container validation | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-015` | **CREATOR_FEATURES** | Multi-step upload wizard (Details, Video Elements, Checks, Visibility) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-016` | **CREATOR_FEATURES** | Video title, description, category, and language metadata editor | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-017` | **CREATOR_FEATURES** | Video visibility selector (Public, Unlisted, Private, Scheduled) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-018` | **CREATOR_FEATURES** | Scheduled video publication with timezone-aware server execution | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-019` | **CREATOR_FEATURES** | Custom thumbnail upload with size/resolution validation and preview | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-020` | **CREATOR_FEATURES** | Automatic frame thumbnail candidate selector from transcoded video | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-021` | **CREATOR_FEATURES** | Interactive chapter marker editor with real-time player preview | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-022` | **CREATOR_FEATURES** | End-screen and card editor positioning links to videos and playlists | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-023` | **CREATOR_FEATURES** | Subtitle file upload (.srt, .vtt) with language code tagging | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-024` | **CREATOR_FEATURES** | In-browser subtitle timing and text editor with waveform synchronization | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-025` | **CREATOR_FEATURES** | Automated Whisper speech-to-text transcript generator with edit capability | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-026` | **CREATOR_FEATURES** | Content audience declaration (Made for Kids / Not Made for Kids) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-027` | **CREATOR_FEATURES** | Age restriction declaration and content warning tags | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-028` | **CREATOR_FEATURES** | Video comments policy configuration (Allow all, Hold for review, Disable) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-029` | **CREATOR_FEATURES** | Embedding policy toggle (Allow embedding on third-party sites / Disallow) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-030` | **CREATOR_FEATURES** | License selector (Standard VIONEX License, Creative Commons Attribution) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-031` | **CREATOR_FEATURES** | Original media retention preference (Keep original master / Purge after transcode) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-032` | **CREATOR_FEATURES** | Batch video management (Bulk edit visibility, category, delete, tags) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-033` | **CREATOR_FEATURES** | Creator Studio dashboard summarizing 28-day views, watch hours, subscribers | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-034` | **CREATOR_FEATURES** | Real-time analytics widget showing views in last 48 hours and 60 minutes | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-035` | **CREATOR_FEATURES** | Audience retention graph showing relative drop-off and key moments | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-036` | **CREATOR_FEATURES** | Traffic sources breakdown (Search, Suggested, External, Direct, Channel pages) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-037` | **CREATOR_FEATURES** | Audience demographics report (Geography, Device, Operating System, Language) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-038` | **CREATOR_FEATURES** | Top performing videos table sorted by views, CTR, and watch duration | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-039` | **CREATOR_FEATURES** | Impression click-through rate (CTR) analytics chart with historical trend | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-040` | **CREATOR_FEATURES** | Subscriber gain/loss timeline linked to specific video publications | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-041` | **CREATOR_FEATURES** | Export channel analytics report to CSV and JSON formats | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-042` | **CREATOR_FEATURES** | Creator Studio comments manager with filtering (Unreplied, Held for review) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-043` | **CREATOR_FEATURES** | Creator heart and pin badge directly from Studio comments dashboard | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-044` | **CREATOR_FEATURES** | Canned responses and bulk comment approval tools for creators | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-045` | **CREATOR_FEATURES** | Creator copyright claims manager listing potential matches on content | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-046` | **CREATOR_FEATURES** | Dispute submission form for copyright claims with evidence upload | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-047` | **CREATOR_FEATURES** | Channel monetization overview showing estimated earnings and RPM/CPM | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-048` | **CREATOR_FEATURES** | Channel membership tier creator (Set price, perk description, custom badges) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-049` | **CREATOR_FEATURES** | Member-only video publishing option restricting playback to active members | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-050` | **CREATOR_FEATURES** | Creator Studio dark theme matching video editing workspace ergonomics | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-051` | **CREATOR_FEATURES** | Video processing status monitor showing real-time encoding progress | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-052` | **CREATOR_FEATURES** | Video re-transcoding request trigger for failed or legacy renditions | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-053` | **CREATOR_FEATURES** | Video trim and cut editor in browser creating new VOD clips | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-054` | **CREATOR_FEATURES** | Community post composer supporting text announcements and image attachments | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-055` | **CREATOR_FEATURES** | Community poll creation with multiple options and duration setting | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-056` | **CREATOR_FEATURES** | Live stream scheduling dashboard with persistent stream key generation | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-057` | **CREATOR_FEATURES** | Custom RTMP stream latency selector (Normal latency vs Low latency) | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-058` | **CREATOR_FEATURES** | Live stream health monitor showing inbound bitrate, FPS, and dropped frames | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-059` | **CREATOR_FEATURES** | Live chat replay archive configuration for scheduled broadcasts | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `CREAT-060` | **CREATOR_FEATURES** | Channel export archive packaging all metadata and analytics for backup | Creator | MULTIPLE_SOURCES | `DESIGNED` | 0.25 | `INTEGRATION_TEST` |
| `SOC-001` | **SOCIAL_COMMUNITY** | Subscribe and unsubscribe channel action with instantaneous state update | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-002` | **SOCIAL_COMMUNITY** | Notification bell toggle with three states (All, Personalized, None) | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-003` | **SOCIAL_COMMUNITY** | Subscriber count display with privacy toggle (Show count / Hide count) | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-004` | **SOCIAL_COMMUNITY** | Subscriptions feed listing newly published videos from followed channels | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-005` | **SOCIAL_COMMUNITY** | Subscription manager page with channel grouping and unsubscribe shortcuts | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-006` | **SOCIAL_COMMUNITY** | Nested comment threads with multi-level reply hierarchy | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-007` | **SOCIAL_COMMUNITY** | Comment upvote and downvote rating with net score calculation | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-008` | **SOCIAL_COMMUNITY** | Comment editing with '(edited)' audit indicator and time history | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-009` | **SOCIAL_COMMUNITY** | Comment deletion by comment author or channel owner | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-010` | **SOCIAL_COMMUNITY** | Creator heart badge highlighted prominently on comments | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-011` | **SOCIAL_COMMUNITY** | Pinned comment by creator staying at the top of the comment section | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-012` | **SOCIAL_COMMUNITY** | Comment sorting selector (Top comments vs Newest first) | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-013` | **SOCIAL_COMMUNITY** | User mentions in comments and community posts using '@handle' syntax | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-014` | **SOCIAL_COMMUNITY** | Automated hashtag recognition in comments with clickable search links | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-015` | **SOCIAL_COMMUNITY** | Markdown formatting in comments (Bold, Italic, Strikethrough, Code blocks) | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-016` | **SOCIAL_COMMUNITY** | Comment anti-spam rate limiter preventing rapid copy-paste floods | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-017` | **SOCIAL_COMMUNITY** | Comment automated toxicity filter holding suspected harassment for review | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-018` | **SOCIAL_COMMUNITY** | Blocked words list per channel automatically hiding matching comments | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-019` | **SOCIAL_COMMUNITY** | User report comment action submitting flagged content to moderation triage | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-020` | **SOCIAL_COMMUNITY** | Community post feed showing updates from subscribed channels | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-021` | **SOCIAL_COMMUNITY** | Interactive community polls with real-time percentage votes | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-022` | **SOCIAL_COMMUNITY** | Community post comments and reactions | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-023` | **SOCIAL_COMMUNITY** | Public playlist creation with custom title, description, and cover thumbnail | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-024` | **SOCIAL_COMMUNITY** | Unlisted and Private playlist privacy settings | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-025` | **SOCIAL_COMMUNITY** | Collaborative playlist support allowing invited users to append videos | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-026` | **SOCIAL_COMMUNITY** | Drag-and-drop playlist video reordering with persistent index positions | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-027` | **SOCIAL_COMMUNITY** | Add video to playlist shortcut from video cards and player controls | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-028` | **SOCIAL_COMMUNITY** | Watch Playlist mode featuring continuous playback and interactive queue drawer | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-029` | **SOCIAL_COMMUNITY** | Save whole playlist to user library with one-click follow | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-030` | **SOCIAL_COMMUNITY** | User profile page displaying public playlists, channels, and liked videos | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-031` | **SOCIAL_COMMUNITY** | In-app notification center categorizing alerts (New upload, Reply, Mention) | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-032` | **SOCIAL_COMMUNITY** | Mark notification as read / mark all as read action | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-033` | **SOCIAL_COMMUNITY** | Desktop browser push notifications via Web Push API | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-034` | **SOCIAL_COMMUNITY** | Email notification digest for channel subscriptions (configurable frequency) | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-035` | **SOCIAL_COMMUNITY** | User blocking mechanism preventing blocked accounts from commenting | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-036` | **SOCIAL_COMMUNITY** | Hidden users list in creator settings preventing specific users from commenting | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-037` | **SOCIAL_COMMUNITY** | Share to social platforms with customized metadata card previews | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-038` | **SOCIAL_COMMUNITY** | Direct message / channel inquiry contact link for business inquiries | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-039` | **SOCIAL_COMMUNITY** | Activity feed showing recent community updates and community polls | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SOC-040` | **SOCIAL_COMMUNITY** | ActivityPub follow actor endpoint for optional federated discovery | User | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `LIVE-001` | **LIVE_STREAMING** | RTMP server ingest endpoint accepting standard streaming software (OBS, vMix) | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-002` | **LIVE_STREAMING** | Cryptographically secure stream key generation with Argon2 hash verification | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-003` | **LIVE_STREAMING** | One-click stream key rotation immediately invalidating compromised keys | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-004` | **LIVE_STREAMING** | Live stream creation dashboard with title, category, and thumbnail setup | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-005` | **LIVE_STREAMING** | Live broadcast scheduling with countdown timer display on channel page | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-006` | **LIVE_STREAMING** | Real-time video transcoding of incoming RTMP stream into multi-bitrate HLS | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-007` | **LIVE_STREAMING** | Low-latency HLS packaging with 2-second segment durations | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-008` | **LIVE_STREAMING** | Live DVR playback allowing viewers to pause and scrub back through live stream | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-009` | **LIVE_STREAMING** | Live stream health dashboard reporting inbound bitrate, keyframe interval, FPS | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-010` | **LIVE_STREAMING** | Encoder disconnection handling with 60-second grace reconnection window | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-011` | **LIVE_STREAMING** | Real-time live concurrent viewer counter with Redis HyperLogLog estimation | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-012` | **LIVE_STREAMING** | WebSocket-powered real-time live chat room with sub-100ms message delivery | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-013` | **LIVE_STREAMING** | Live chat slow mode restricting users to 1 message every X seconds | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-014` | **LIVE_STREAMING** | Subscriber-only live chat mode requiring minimum subscription duration | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-015` | **LIVE_STREAMING** | Members-only live chat mode restricted to paid channel members | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-016` | **LIVE_STREAMING** | Live chat moderator roles with message deletion and user timeout abilities | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-017` | **LIVE_STREAMING** | Temporary user timeout (5 minutes, 24 hours) muting abusive chatters | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-018` | **LIVE_STREAMING** | Permanent channel ban from live chat for repeat policy violators | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-019` | **LIVE_STREAMING** | Automated banned words filter masking or rejecting abusive chat messages | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-020` | **LIVE_STREAMING** | Pinned chat announcement displayed at the top of the chat panel | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-021` | **LIVE_STREAMING** | Live chat reactions (floating emoji particles) rendered on stream | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-022` | **LIVE_STREAMING** | Live stream viewer report action flagging unlawful broadcast content | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-023` | **LIVE_STREAMING** | Instant emergency stream termination by platform administrators or moderators | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-024` | **LIVE_STREAMING** | Automated live stream recording assembling HLS segments into permanent master | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-025` | **LIVE_STREAMING** | Post-stream VOD conversion publishing recorded broadcast to channel uploads | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-026` | **LIVE_STREAMING** | Live chat replay synchronized with the archived stream VOD playback | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-027` | **LIVE_STREAMING** | Premiere / Scheduled release experience with live countdown and premiere chat | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-028` | **LIVE_STREAMING** | Simultaneous live restreaming adapter broadcasting to external RTMP destinations | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-029` | **LIVE_STREAMING** | Live stream embed player with interactive live chat popup window | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `LIVE-030` | **LIVE_STREAMING** | Live stream ending statistics summary (Peak concurrents, Total watch hours) | Creator/Viewer | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `TRUST-001` | **TRUST_SAFETY** | Comprehensive user report modal with granular reason classification | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-002` | **TRUST_SAFETY** | Video report categories (Spam, Harassment, Violence, Sexual, Copyright, Child Safety) | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-003` | **TRUST_SAFETY** | Comment report action forwarding specific comment text to moderation triage | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-004` | **TRUST_SAFETY** | Channel report action submitting whole account for behavioral investigation | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-005` | **TRUST_SAFETY** | Moderation case management queue with priority sorting and severity scoring | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-006` | **TRUST_SAFETY** | Moderator action: Content removal with automated violation notification | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-007` | **TRUST_SAFETY** | Moderator action: Mandatory age-gate restriction for mature content | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-008` | **TRUST_SAFETY** | Moderator action: Content demonetization removing ad/membership eligibility | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-009` | **TRUST_SAFETY** | Moderator action: Shadow-hide content from recommendation feeds and search | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-010` | **TRUST_SAFETY** | Community Guidelines Strike system with 3-strike policy leading to suspension | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-011` | **TRUST_SAFETY** | Creator appeal submission form with text rationale and evidence upload | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-012` | **TRUST_SAFETY** | Moderator appeal review workflow with strike reversal and content restoration | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-013` | **TRUST_SAFETY** | Immutable audit log recording every moderation decision, actor, and timestamp | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-014` | **TRUST_SAFETY** | Legal Terms of Service and Community Guidelines policy specification pages | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-015` | **TRUST_SAFETY** | DMCA / Copyright infringement notification legal submission form | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-016` | **TRUST_SAFETY** | Counter-notification submission workflow compliant with legal safe harbors | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-017` | **TRUST_SAFETY** | Rights-owner reference asset registration and audio/visual upload portal | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-018` | **TRUST_SAFETY** | Automated audio fingerprint extraction using open-source Chromaprint (fpcalc) | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-019` | **TRUST_SAFETY** | Audio fingerprint candidate matching engine against reference registry | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-020` | **TRUST_SAFETY** | Visual perceptual hashing (pHash) candidate matching for duplicate video frames | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-021` | **TRUST_SAFETY** | Potential copyright match triage queue for verified rights holders | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-022` | **TRUST_SAFETY** | Copyright claim policy actions (Track analytics, Monetize, Block viewing) | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-023` | **TRUST_SAFETY** | Creator dispute workflow contesting automated copyright claims | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-024` | **TRUST_SAFETY** | Rights-owner claim resolution interface (Release claim or escalate to takedown) | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-025` | **TRUST_SAFETY** | Repeat infringer automated detection and channel suspension policy | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-026` | **TRUST_SAFETY** | Upload security scanner rejecting files with shell metacharacters or path traversal | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-027` | **TRUST_SAFETY** | Media quarantine engine verifying ISO base media box headers before processing | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-028` | **TRUST_SAFETY** | Decompression bomb defense enforcing hard upload size and expansion limits | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-029` | **TRUST_SAFETY** | Antivirus / ClamAV integration adapter for scanning uploaded binary payloads | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-030` | **TRUST_SAFETY** | Automated spam account velocity detector flagging bulk account creation | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-031` | **TRUST_SAFETY** | View inflation detection pipeline filtering artificial refresh loops and proxies | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-032` | **TRUST_SAFETY** | Fake engagement detection flagging automated bot likes and subscriptions | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-033` | **TRUST_SAFETY** | Search manipulation defense preventing repetitive keyword stuffing indexing | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-034` | **TRUST_SAFETY** | Child-directed content classification and privacy protections (no targeted ads) | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-035` | **TRUST_SAFETY** | Data minimization engine purging unneeded IP addresses and session logs | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-036` | **TRUST_SAFETY** | User account deletion workflow with complete personal data anonymization | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-037` | **TRUST_SAFETY** | User data export bundle (JSON/CSV archive of profile, videos, comments) | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-038` | **TRUST_SAFETY** | Rate-limiting protection on authentication and password reset endpoints | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-039` | **TRUST_SAFETY** | CSRF protection on all state-mutating cookie-authenticated endpoints | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `TRUST-040` | **TRUST_SAFETY** | Content Security Policy (CSP) headers preventing cross-site scripting (XSS) | Moderator/Admin | MULTIPLE_SOURCES | `DESIGNED` | 0.125 | `SECURITY_TEST` |
| `MONET-001` | **MONETIZATION** | Channel membership subscription tier creation with custom monthly pricing | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-002` | **MONETIZATION** | Member-only video access gate enforced server-side before playback | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-003` | **MONETIZATION** | Member-only live stream and live chat access authorization | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-004` | **MONETIZATION** | Custom creator loyalty badges displayed next to member names in comments | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-005` | **MONETIZATION** | Pay-per-view video unlock allowing one-off purchase of premium content | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-006` | **MONETIZATION** | Creator tip / donation button enabling viewers to send financial support | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-007` | **MONETIZATION** | Provider-agnostic payment gateway adapter (Stripe, Razorpay, Mock local) | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-008` | **MONETIZATION** | Immutable double-entry ledger database recording all credits and debits | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-009` | **MONETIZATION** | Server-side price and entitlement recalculation ignoring client-sent values | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-010` | **MONETIZATION** | Cryptographic webhook signature verification preventing fake payment injection | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-011` | **MONETIZATION** | Webhook replay attack defense utilizing idempotency keys and timestamp checks | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-012` | **MONETIZATION** | Creator digital wallet balance displaying available and pending funds | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-013` | **MONETIZATION** | Creator payout request interface with payout threshold validation | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-014` | **MONETIZATION** | Administrator payout approval workflow with payout batch export | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-015` | **MONETIZATION** | Internal video advertising insertion engine (Pre-roll, Mid-roll, Post-roll) | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-016` | **MONETIZATION** | VAST 4.x / VMAP standard ad tag delivery adapter for external ad networks | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-017` | **MONETIZATION** | Skippable ad experience with 5-second countdown timer and skip button | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-018` | **MONETIZATION** | Non-skippable short ad bumper support (6-second or 15-second ads) | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-019` | **MONETIZATION** | Ad impression and completion telemetry recording verified ad views | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-020` | **MONETIZATION** | Ad frequency capping preventing over-exposure to individual viewers | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-021` | **MONETIZATION** | Ad-free playback mode for channel members or premium platform subscribers | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-022` | **MONETIZATION** | Local development ad-free toggle ensuring zero friction during testing | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-023` | **MONETIZATION** | Creator revenue share percentage configuration in system settings | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-024` | **MONETIZATION** | Platform fee calculation automatically deducted upon transaction settlement | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-025` | **MONETIZATION** | Refund processing workflow reversing ledger transactions and entitlements | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-026` | **MONETIZATION** | Promotional coupon and discount code engine for membership discounts | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-027` | **MONETIZATION** | Sponsorship and paid promotion disclosure badge on video playback | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-028` | **MONETIZATION** | Affiliate product link cards rendered below video player | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-029` | **MONETIZATION** | Financial compliance audit reports for tax and revenue accounting | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `MONET-030` | **MONETIZATION** | Zero-transaction-fee local test mode for automated billing integration tests | Creator/Platform | MULTIPLE_SOURCES | `DESIGNED` | 0.166 | `INTEGRATION_TEST` |
| `SHRT-001` | **SHORTS** | Dedicated vertical video feed layout optimized for 9:16 aspect ratio | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-002` | **SHORTS** | Single-video snap-scrolling viewport with smooth touch swipe on mobile | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-003` | **SHORTS** | Keyboard arrow navigation (Up/Down) for cycling Shorts on desktop | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-004` | **SHORTS** | Automatic background pre-buffering of next Short in feed for instant play | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-005` | **SHORTS** | Continuous looped playback of active Short until user scrolls | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-006` | **SHORTS** | Audio mute/unmute toggle state preserved across vertical feed scrolling | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-007` | **SHORTS** | Floating quick-action rail (Like, Dislike, Comments, Share, Remix) | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-008` | **SHORTS** | Collapsible slide-up comment drawer overlaid on vertical video | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-009` | **SHORTS** | Creator channel badge and quick-follow button on video bottom-left | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-010` | **SHORTS** | Sound / audio track attribution pill linking to original audio source | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-011` | **SHORTS** | Vertical video transcoding profile (1080x1920, 720x1280, 480x854) | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-012` | **SHORTS** | Shorts duration enforcement (Maximum 60 seconds duration limit) | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-013` | **SHORTS** | Shorts discovery carousel on desktop Home feed and channel pages | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-014` | **SHORTS** | Shorts upload flow with automatic vertical aspect ratio detection | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-015` | **SHORTS** | Shorts analytics tab in Creator Studio tracking swipe-away rate | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-016` | **SHORTS** | Shorts sound selector allowing creators to reuse permitted audio clips | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-017` | **SHORTS** | Shorts hashtag navigation filtering feed by trending short challenges | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-018` | **SHORTS** | Interactive captions generated automatically on vertical video viewport | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-019` | **SHORTS** | Shorts report action directly from mobile quick-action menu | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `SHRT-020` | **SHORTS** | Shorts offline pre-caching for smooth PWA mobile playback | User/Creator | SOURCE_PLAYTUBE | `DESIGNED` | 0.25 | `E2E_TEST` |
| `P2P-001` | **P2P_DELIVERY** | WebRTC Datachannel browser-assisted P2P segment sharing via HLS.js | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-002` | **P2P_DELIVERY** | Lightweight WebRTC signaling tracker matching peers watching same stream | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-003` | **P2P_DELIVERY** | Strict origin fallback circuit breaker reverting to CDN on high peer latency | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-004` | **P2P_DELIVERY** | P2P telemetry dashboard measuring origin bandwidth saved vs P2P bytes | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-005` | **P2P_DELIVERY** | User opt-out toggle in playback settings disabling P2P sharing | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-006` | **P2P_DELIVERY** | Encrypted peer-to-peer data transfer preventing packet snooping | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-007` | **P2P_DELIVERY** | Zero private metadata leakage across WebRTC peer connection handshakes | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-008` | **P2P_DELIVERY** | NAT and firewall traversal handling via standard STUN servers | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-009` | **P2P_DELIVERY** | Segment cryptographic hash verification preventing malicious peer corruption | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-010` | **P2P_DELIVERY** | Automatic P2P disablement on metered cellular data connections | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-011` | **P2P_DELIVERY** | Peer churn tolerance maintaining uninterrupted video buffer during peer exit | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-012` | **P2P_DELIVERY** | HLS segment immutable caching policy (`Cache-Control: max-age=31536000`) | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-013` | **P2P_DELIVERY** | Dynamic master manifest caching with short TTL for live streams | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-014` | **P2P_DELIVERY** | AVIF and WebP image optimization for thumbnails reducing egress by 60% | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `P2P-015` | **P2P_DELIVERY** | Byte-range request support enabling efficient media seeking | System | SOURCE_PEERTUBE | `DESIGNED` | 0.333 | `BROWSER_TEST` |
| `DISC-001` | **DISCOVERY_SEARCH** | PostgreSQL trigram (pg_trgm) and full-text search across titles and tags | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-002` | **DISCOVERY_SEARCH** | Real-time search autocomplete suggestions with debounced query dispatch | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-003` | **DISCOVERY_SEARCH** | Search filter drawer (Upload date, Duration, Type, Quality, Sort by) | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-004` | **DISCOVERY_SEARCH** | Search query normalization and typo tolerance (fuzzy matching) | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-005` | **DISCOVERY_SEARCH** | Two-tower candidate generation combining collaborative and topic signals | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-006` | **DISCOVERY_SEARCH** | Freshness boost ranking newly uploaded content to give new creators exposure | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-007` | **DISCOVERY_SEARCH** | Cold-start recommendation strategy for new anonymous and signed-up users | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-008` | **DISCOVERY_SEARCH** | Recommendation explainability tags displayed in UI (e.g. 'From a channel you watch') | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-009` | **DISCOVERY_SEARCH** | Negative feedback signal ('Not interested' / 'Don't recommend channel') | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-010` | **DISCOVERY_SEARCH** | Topic affinity clustering grouping related video vectors | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-011` | **DISCOVERY_SEARCH** | Trending ranking algorithm factoring in view velocity and unique viewer counts | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-012` | **DISCOVERY_SEARCH** | Hashtag discovery pages aggregating top and recent videos | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-013` | **DISCOVERY_SEARCH** | Channel handle global search matching exact `@handle` queries | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-014` | **DISCOVERY_SEARCH** | Search abuse detector throttling bot query scrapers | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `DISC-015` | **DISCOVERY_SEARCH** | Opt-in anonymous query analytics for search quality evaluation | Viewer | NEW_IMPLEMENTATION | `DESIGNED` | 0.333 | `INTEGRATION_TEST` |
| `OPS-001` | **DEVOPS_OPS** | Zero-Cost Self-Host Deployment profile (Oracle Always Free / VPS compatible) | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-002` | **DEVOPS_OPS** | Standard Single-Node Docker Compose deployment specification | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-003` | **DEVOPS_OPS** | Scale Profile architecture decoupling API, workers, PostgreSQL, and S3 | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-004` | **DEVOPS_OPS** | StorageProvider abstraction switching seamlessly between Local disk and S3/R2 | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-005` | **DEVOPS_OPS** | ResourceGovernor dynamically capping concurrent FFmpeg jobs by system RAM | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-006` | **DEVOPS_OPS** | StorageGovernor enforcing per-user quotas and automated orphan cleanup | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-007` | **DEVOPS_OPS** | Health check endpoints (`/health`, `/ready`, `/version`) for all services | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-008` | **DEVOPS_OPS** | Structured JSON logging with unique trace ID propagated across requests | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-009` | **DEVOPS_OPS** | Automated database schema migration engine with rollback verification | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-010` | **DEVOPS_OPS** | Daily automated database backup script with optional offsite sync | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-011` | **DEVOPS_OPS** | Disaster recovery restore automation verifying database integrity | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-012` | **DEVOPS_OPS** | Redis Pub/Sub event bus decoupling video processing from HTTP requests | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-013` | **DEVOPS_OPS** | BullMQ durable job queues with exponential backoff and dead-letter queue | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-014` | **DEVOPS_OPS** | Graceful shutdown handlers closing database connections and media jobs | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-015` | **DEVOPS_OPS** | NGINX reverse proxy configuration with TLS termination and gzip/brotli | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-016` | **DEVOPS_OPS** | Environment variable schema validation at startup failing fast on bad config | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-017` | **DEVOPS_OPS** | Feature flags system toggling P2P, live streaming, and monetization at runtime | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-018` | **DEVOPS_OPS** | Admin system health dashboard displaying CPU, RAM, disk, and queue latency | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-019` | **DEVOPS_OPS** | Comprehensive CI/CD GitHub Actions workflow (Lint, Typecheck, Test, Build) | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
| `OPS-020` | **DEVOPS_OPS** | Reproducible Dockerfile container builds with pinned base images and non-root user | DevOps/SRE | NEW_IMPLEMENTATION | `DESIGNED` | 0.25 | `E2E_TEST` |
