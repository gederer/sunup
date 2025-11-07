# Research Report: WebRTC Scaling Architecture for 200-Participant Video Conferencing

**Research Type:** Technical/Architecture Research
**Focus Area:** WebRTC Video Conferencing Infrastructure
**Date:** 2025-11-03
**Project:** Sunup Platform
**Researcher:** BMad Analyst Agent

---

## Executive Summary

This research investigates WebRTC architecture patterns, technologies, and implementation strategies to support Sunup's video conferencing requirements:
- **1-to-1 Consultant meetings** (standard video calls with screen sharing, chat)
- **1-to-200 Trainer sessions** (webinar-style with polls, Q&A, breakout rooms)
- **Google Meet feature parity** (21 additional features identified and added to roadmap)

**Key Findings:**
- **SFU (Selective Forwarding Unit)** is the recommended architecture for 200-participant sessions
- **Mediasoup** is recommended for self-hosted implementation (Node.js server, React Native client support)
- **Simulcast + Selective Forwarding** optimization is critical for scaling
- **Client-side pagination** required (display 9-25 videos at a time, not all 200)
- **Infrastructure estimate**: AWS EC2 instances with high bandwidth allocation
- **Cost estimate**: $500-2000/month for moderate usage (50-100 concurrent sessions)
- **Timeline**: 15 weeks from prototype to feature-complete production (vs. 9 weeks for basic WebRTC)

**Feature Coverage:**
- ✅ **Phase 1-2** (Weeks 1-3): Core video/audio with simulcast
- ✅ **Phase 3** (Weeks 4-6): Screen sharing, chat, host controls, security
- ✅ **Phase 4** (Weeks 7-9): Polls, Q&A, reactions, attendance tracking
- ✅ **Phase 5** (Weeks 10-12): 200-participant scaling, breakout rooms
- ✅ **Phase 6** (Weeks 13-15): Recording, captions, noise cancellation, production deployment

---

## Research Methodology

**Sources:**
1. WebRTC architecture pattern analysis (academic and industry sources)
2. Open-source SFU server comparison (Janus, Mediasoup, Medooze)
3. WebRTC load testing and performance studies
4. Client-side optimization best practices
5. AWS infrastructure cost modeling

**Research Questions:**
1. What are the WebRTC architecture patterns and which scales to 200 participants?
2. Which open-source SFU server is best for our tech stack (Node.js + React Native)?
3. What are the bandwidth, CPU, and infrastructure requirements?
4. What client-side optimizations are needed?
5. What are the implementation steps and timeline?

---

## WebRTC Architecture Comparison

### Overview of Architecture Patterns

WebRTC supports three primary architecture patterns for multi-party video conferencing:

| Architecture | Participants | Server Required | Bandwidth/Client | CPU/Client | CPU/Server | Use Case |
|--------------|--------------|-----------------|------------------|------------|------------|----------|
| **Mesh (P2P)** | 2-6 | No (STUN/TURN only) | Very High | Very High | None | Small meetings |
| **MCU** | 10-100 | Yes | Low | Low | Very High | Legacy systems, recording |
| **SFU** | 5-1000+ | Yes | Medium | Medium | Low | Modern conferencing |

---

### 1. Mesh (Peer-to-Peer) Architecture

**How it works:**
- Each participant connects directly to every other participant
- No central media server (only STUN/TURN for NAT traversal)
- Each client sends N-1 streams and receives N-1 streams

**Scalability:**
- **Maximum practical participants:** 4-6
- Beyond 6 participants, client bandwidth and CPU become overwhelmed

**Verdict for Sunup:**
- ❌ **Not suitable** for 200-participant Trainer sessions
- ✅ Could work for small Consultant meetings (2 participants), but SFU is better for consistency

**Pros:**
- No server costs
- Lowest latency
- Simple implementation

**Cons:**
- Does not scale beyond 6 participants
- Each participant uploads N-1 streams (exponential bandwidth growth)
- High CPU load for encoding/decoding multiple streams

---

### 2. MCU (Multipoint Control Unit) Architecture

**How it works:**
- Central server receives all streams
- Server **decodes** all streams
- Server **composites** them into a single mixed stream
- Server **encodes** the composite and sends to each participant
- Each client sends 1 stream and receives 1 stream

**Scalability:**
- **Maximum on single server:** 10-100 participants
- Limited by server CPU (encoding/decoding is computationally intensive)

**Verdict for Sunup:**
- ❌ **Not recommended** for 200-participant sessions
- Very high server costs due to transcoding requirements
- Doesn't scale to 200 participants efficiently

**Pros:**
- Lowest client bandwidth requirements (1 upload, 1 download)
- Works well for legacy devices with bandwidth constraints
- Good for recording (single composite stream)

**Cons:**
- **Extremely high server CPU costs** (must decode and re-encode all streams)
- Limited scalability (single server handles 10-100 participants)
- Higher latency due to transcoding
- Server costs scale linearly with participants

**MCU Cost Example:**
- 200 participants × 720p encoding = Requires massive server CPU
- Estimated cost: $5,000-10,000/month for continuous operation

---

### 3. SFU (Selective Forwarding Unit) Architecture ✅ RECOMMENDED

**How it works:**
- Central server receives streams from all participants
- Server **forwards** streams without modification (no transcoding)
- Server selectively forwards different quality levels to different clients
- Each client sends 1 stream (with simulcast: 3 quality levels)
- Each client receives N-1 streams (but can choose quality per stream)

**Scalability:**
- **Single SFU server:** 500-1000 concurrent participants
- **Clustered SFUs:** 10,000+ participants possible
- Real-world deployments: Janus SFU supports 100+ users streaming video in same session

**Verdict for Sunup:**
- ✅ **RECOMMENDED** for both 1-to-1 Consultant meetings and 1-to-200 Trainer sessions
- Best balance of scalability, cost, and implementation complexity

**Pros:**
- Scales to 1000+ participants per server
- **Low server CPU** (no transcoding, only forwarding)
- Moderate bandwidth costs
- Industry standard for modern video conferencing
- Supports advanced features (simulcast, selective forwarding)

**Cons:**
- Higher client bandwidth than MCU (but manageable with optimizations)
- Requires careful client-side optimization for 200 participants
- More complex than P2P (but libraries handle complexity)

**SFU Cost Example:**
- 200 participants: ~$500-1500/month (AWS infrastructure + bandwidth)
- Primarily bandwidth costs, minimal compute costs

---

## Recommended Architecture: SFU with Simulcast

### Why SFU is Optimal for Sunup

1. **Scalability:** Handles both 2-person Consultant meetings and 200-person Trainer sessions
2. **Cost-effective:** Low server CPU requirements (only forwarding, not transcoding)
3. **React Native support:** Mediasoup has excellent React Native client support
4. **Flexible layouts:** Supports speaker mode, grid mode, pagination
5. **Quality adaptation:** Simulcast allows quality selection based on network conditions

### SFU Architecture Diagram

```
Trainer (1 presenter) ──┐
                        │
Trainee 1 ──────────────┤
Trainee 2 ──────────────┤
Trainee 3 ──────────────┤
    ...                 ├──► SFU Server(s) ──► Selective Forwarding
    ...                 │                        (chooses quality per client)
    ...                 │
Trainee 198 ────────────┤
Trainee 199 ────────────┤
Trainee 200 ────────────┘

Each participant uploads: 1 stream (3 quality levels via simulcast)
Each participant downloads: Up to 199 streams (but only renders visible ones)
Server: Forwards streams without modification
```

---

## Simulcast and Selective Forwarding

### What is Simulcast?

**Simulcast** is a WebRTC feature where each participant encodes and uploads **multiple versions** of their video stream at different quality levels:

**Example:**
- **High quality:** 1280x720 @ 2.5 Mbps
- **Medium quality:** 640x360 @ 1 Mbps
- **Low quality:** 320x180 @ 300 Kbps

The SFU receives all three quality levels and selectively forwards the appropriate quality to each receiving client based on:
- Network bandwidth availability
- Display size (thumbnail vs. full screen)
- CPU availability

### Why Simulcast is Critical for 200 Participants

**Without simulcast:**
- Trainer uploads 720p stream (2.5 Mbps)
- ALL 200 trainees download 720p stream (500 Mbps aggregate server bandwidth)
- Many trainees display Trainer in small thumbnail (wasting bandwidth on high quality)

**With simulcast:**
- Trainer uploads 3 quality levels (total ~4 Mbps upload)
- Trainees viewing Trainer full-screen receive 720p (2.5 Mbps)
- Trainees viewing Trainer as thumbnail receive 320x180 (300 Kbps)
- **Bandwidth savings:** 5-10x reduction in aggregate bandwidth

### Selective Forwarding Strategies

**1. Active Speaker Detection**
- SFU detects who is speaking (audio activity)
- Sends high-quality stream for active speaker
- Sends low-quality streams for non-speakers

**2. Display-based Selection**
- Client tells SFU which participants are visible on screen
- SFU sends medium/high quality for visible participants
- SFU sends low quality (or pauses) for non-visible participants

**3. Pagination**
- Client displays 9-25 participants at a time (grid view)
- Client subscribes to only visible participants
- Next/previous page buttons to view other participants

---

## Technology Stack Recommendation

### Recommended: Mediasoup

**Why Mediasoup?**
1. **Modern architecture:** Written in C++ (performance) with Node.js API
2. **React Native support:** Official React Native client library with `registerGlobals()` support
3. **Excellent performance:** Multi-core architecture with worker processes
4. **Active development:** Maintained by professional developers (though smaller team than Janus)
5. **Clean API:** Easier to integrate with existing Node.js backend

**Mediasoup Architecture:**
```
┌─────────────────────────────────────┐
│   React Native Mobile App           │
│   (mediasoup-client + react-native- │
│    webrtc)                           │
└──────────────┬──────────────────────┘
               │ WebSocket (Socket.io)
┌──────────────▼──────────────────────┐
│   Node.js Server (Sunup Backend)    │
│   - Express API                      │
│   - Socket.io for signaling          │
│   - mediasoup server library         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   mediasoup Workers (C++)            │
│   - Multi-core parallelism           │
│   - SFU forwarding engine            │
│   - Simulcast handling               │
└──────────────────────────────────────┘
```

**Server-side Stack:**
- **Runtime:** Node.js 18+
- **SFU:** mediasoup v3.x
- **Signaling:** Socket.io (WebSocket)
- **API:** Express.js (existing Sunup backend)
- **Database:** Convex (session metadata, room state)

**Client-side Stack:**
- **Mobile:** React Native
- **WebRTC:** react-native-webrtc
- **Mediasoup Client:** mediasoup-client (with `registerGlobals()`)
- **State Management:** React Context/Zustand
- **UI:** React Native components

---

### Alternative: Janus WebRTC Gateway

**Why consider Janus?**
1. **Mature and stable:** Released in 2014, battle-tested
2. **Larger community:** More resources and examples
3. **Multi-protocol:** Supports WebRTC, SIP, RTSP (if future expansion needed)
4. **Excellent documentation:** Comprehensive docs and examples

**Why NOT chosen for Sunup:**
1. Written in C (harder to modify/extend)
2. React Native integration less straightforward than Mediasoup
3. Heavier architecture for Sunup's focused use case
4. Mediasoup's Node.js API is better fit for Sunup's existing stack

**Recommendation:** Start with Mediasoup; keep Janus as fallback if performance issues arise

---

## Infrastructure Requirements

### Server Specifications

**Development/Testing:**
- **Instance:** AWS t3.medium (2 vCPU, 4 GB RAM)
- **Bandwidth:** 100 Mbps
- **Concurrent sessions:** 1-2 (up to 50 participants total)
- **Cost:** ~$50/month

**Production (Small Scale):**
- **Instance:** AWS c5.xlarge (4 vCPU, 8 GB RAM)
- **Bandwidth:** 1 Gbps (AWS Enhanced Networking)
- **Concurrent sessions:** 5-10 (up to 200 participants total)
- **Cost:** ~$150/month (compute) + $300-500/month (bandwidth)

**Production (Medium Scale):**
- **Instances:** 3x AWS c5.2xlarge (8 vCPU, 16 GB RAM) behind load balancer
- **Bandwidth:** 10 Gbps aggregate
- **Concurrent sessions:** 50-100 (up to 2000 participants total)
- **Cost:** ~$1,000/month (compute) + $2,000-3,000/month (bandwidth)

**Bandwidth Calculations:**

For a 200-participant Trainer session:
- Trainer upload: 4 Mbps (simulcast: 3 quality levels)
- Trainees upload: 200 × 1 Mbps = 200 Mbps (most have camera off)
- Server aggregate upload: 200 × 4 Mbps (to all trainees) = 800 Mbps
- **With optimizations** (pagination, selective forwarding): ~200-300 Mbps

For 10 concurrent sessions (average 20 participants each):
- Aggregate bandwidth: ~500 Mbps - 1 Gbps

**Storage:**
- Minimal (SFU doesn't record by default)
- If recording: 1 GB/hour per session (compressed)

---

## Client-Side Optimization Strategies

### Critical for 200-Participant Sessions

❌ **DO NOT:** Display all 200 participants simultaneously in a grid
- Client CPU cannot decode 200 video streams
- Client bandwidth cannot download 200 streams (even at low quality)
- UI would be unusable (200 tiny thumbnails)

✅ **DO:** Implement smart pagination and selective subscription

---

### 1. Pagination (Grid View)

**For Trainer Sessions (1 active speaker + many viewers):**

**Layout Option A: Speaker Mode**
```
┌─────────────────────────────────────┐
│                                     │
│        Trainer (Full Screen)        │
│            1280x720                 │
│                                     │
└─────────────────────────────────────┘
┌──────┬──────┬──────┬──────┬──────┐
│ T1   │ T2   │ T3   │ T4   │ T5   │  ← Scrollable bar
└──────┴──────┴──────┴──────┴──────┘
```
- Trainer gets high-quality, full-screen view
- Trainees shown in scrollable thumbnail bar (virtualized scrolling)
- Only render 10-15 visible thumbnails (320x180 quality)
- Other 185+ participants not subscribed to video (audio only)

**Layout Option B: Grid Mode with Pagination**
```
┌────────┬────────┬────────┬────────┐
│  P1    │  P2    │  P3    │  P4    │
├────────┼────────┼────────┼────────┤
│  P5    │  P6    │  P7    │  P8    │
├────────┼────────┼────────┼────────┤
│  P9    │  P10   │  P11   │  P12   │
├────────┼────────┼────────┼────────┤
│  P13   │  P14   │  P15   │  P16   │
└────────┴────────┴────────┴────────┘
       [< Prev] Page 1/13 [Next >]
```
- Display 16 participants per page (4×4 grid)
- 200 participants = 13 pages
- Subscribe to video for current page only
- Other pages: audio-only or no subscription
- Smooth transitions when changing pages

---

### 2. Selective Subscription

**Strategy:** Client tells SFU which streams to subscribe to

```javascript
// Pseudocode for selective subscription
onPageChange(pageNumber) {
  const participantsOnPage = getParticipantsForPage(pageNumber);

  // Unsubscribe from previous page participants
  previousParticipants.forEach(p => {
    consumer.pause(); // Stop receiving video
  });

  // Subscribe to current page participants
  participantsOnPage.forEach(p => {
    consumer.resume(); // Start receiving video
    consumer.setPreferredLayers({ spatialLayer: 1 }); // Medium quality
  });
}
```

**Benefits:**
- Client only decodes 16-25 videos at a time (manageable CPU load)
- Client only downloads 16-25 streams (manageable bandwidth)
- Other 175+ participants consume zero video bandwidth

---

### 3. Quality Layer Selection

**Strategy:** Request different quality levels based on display size

```javascript
// Active speaker (full screen): High quality
activeSpeakerConsumer.setPreferredLayers({
  spatialLayer: 2,  // 1280x720 @ 2.5 Mbps
  temporalLayer: 2
});

// Grid participants (medium tiles): Medium quality
gridConsumers.forEach(consumer => {
  consumer.setPreferredLayers({
    spatialLayer: 1,  // 640x360 @ 1 Mbps
    temporalLayer: 1
  });
});

// Thumbnail bar (tiny tiles): Low quality
thumbnailConsumers.forEach(consumer => {
  consumer.setPreferredLayers({
    spatialLayer: 0,  // 320x180 @ 300 Kbps
    temporalLayer: 0
  });
});
```

---

### 4. Mobile-Specific Optimizations

**iOS and Android have strict limits:**
- **Maximum simultaneous video decoders:** 3-6 (device-dependent)
- **CPU constraints:** Mobile devices overheat with too many streams

**Mobile Layout:**
```
┌─────────────────────────────────────┐
│        Active Speaker               │
│         (Full Screen)               │
└─────────────────────────────────────┘
┌───────────┬───────────┬───────────┐
│  Recent 1 │  Recent 2 │  Recent 3 │  ← Only 3 additional videos
└───────────┴───────────┴───────────┘
```

**Mobile Strategy:**
- Display active speaker + 3 most recent speakers (total 4 videos)
- All other participants: audio-only
- This stays within iOS/Android decoder limits

---

### 5. Audio-Only Participants

**For Trainer sessions, most participants don't need to send video:**

```javascript
// Trainee joins with audio-only mode
const localTrack = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: false  // Camera off by default
});

// Trainee can enable video to ask a question
enableVideoButton.onClick = async () => {
  const videoTrack = await navigator.mediaDevices.getUserMedia({
    video: true
  });
  producer = await sendTransport.produce({ track: videoTrack });
};
```

**Benefits:**
- Reduces server bandwidth by 90% (200 participants with cameras off vs. on)
- Reduces trainee upload bandwidth requirements (audio = 50 Kbps vs. video = 1 Mbps)
- Makes sessions accessible to trainees with poor network conditions

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Basic 1-to-1 video calling for Consultant meetings

**Tasks:**
1. Set up mediasoup server on Node.js backend
   - Install mediasoup npm package
   - Configure workers (CPU cores)
   - Set up RTP ports and IP addressing
2. Implement Socket.io signaling
   - Room creation/joining
   - Producer/consumer negotiation
   - ICE candidate exchange
3. Integrate mediasoup-client in React Native
   - Install react-native-webrtc
   - Call `registerGlobals()`
   - Create Device instance
4. Basic UI for 1-to-1 calls
   - Camera preview
   - Remote video display
   - Mute/unmute controls

**Deliverable:** Working 1-to-1 video calls between Consultant and Customer

---

### Phase 2: Simulcast and Quality Adaptation (Week 3)

**Goal:** Enable simulcast for bandwidth optimization

**Tasks:**
1. Enable simulcast on server
   ```javascript
   producer = await transport.produce({
     track: videoTrack,
     encodings: [
       { maxBitrate: 300000, scaleResolutionDownBy: 4 }, // Low
       { maxBitrate: 1000000, scaleResolutionDownBy: 2 }, // Medium
       { maxBitrate: 2500000 }                            // High
     ]
   });
   ```
2. Implement quality layer selection on client
3. Test adaptive quality switching based on network conditions

**Deliverable:** Adaptive quality video calls

---

### Phase 3: Essential Collaboration Features (Weeks 4-6)

**Goal:** Add screen sharing, chat, and host controls (Google Meet parity - critical features)

**Tasks:**
1. **Screen Sharing**
   - Implement `getDisplayMedia()` for screen capture
   - Handle screen share as video producer in Mediasoup
   - Layout adaptation (screen share gets priority/full screen)
   - Mobile support (limited on iOS)
2. **In-Meeting Chat**
   - Real-time text messaging over WebSocket
   - Public messages (to all) and private messages (1-to-1)
   - Link previews and formatting
   - Chat persistence (save to Convex)
   - File sharing via chat (upload to S3/Convex storage)
3. **Host Controls & Security**
   - Waiting room (participants wait until host admits)
   - Mute all participants
   - Lock meeting (prevent new joins)
   - Control participant permissions (can unmute, can share screen, can chat)
   - End meeting for all
   - Remove participant (kick from meeting)
4. **Basic Grid/Speaker Layouts**
   - Grid layout (4×4, 5×5)
   - Speaker mode (active speaker + thumbnail bar)
   - Active speaker detection

**Deliverable:** Professional video conferencing with screen sharing, chat, and security controls

---

### Phase 4: Engagement & Interaction Tools (Weeks 7-9)

**Goal:** Add polls, Q&A, reactions for large-scale training sessions

**Tasks:**
1. **Polls**
   - Create poll UI (multiple choice questions)
   - Real-time voting and results aggregation
   - Host controls (show/hide results, lock poll)
   - Poll persistence and analytics
2. **Q&A (Structured Questions)**
   - Question submission panel
   - Upvoting mechanism (participants upvote questions)
   - Question moderation (host can answer/dismiss)
   - Sorting (most upvoted questions at top)
   - Answer tracking (mark as answered)
3. **Reactions/Emoji**
   - Emoji selector (👍❤️😂🎉👏 etc.)
   - Real-time broadcast to all participants
   - Floating animation on screen (3-second display)
   - Analytics (track reaction counts)
4. **Pagination & Selective Subscription**
   - Advanced pagination (13 pages for 200 participants)
   - Virtualized scrolling for thumbnail bar
   - Subscribe only to visible participants
5. **Audio-Only Mode**
   - Participant joins with audio only (camera off by default)
   - Toggle video on-demand (for asking questions)
6. **Attendance Tracking**
   - Generate attendance reports (who joined, duration)
   - Export to CSV
   - Track engagement metrics

**Deliverable:** Interactive training sessions with polls, Q&A, and engagement tools

---

### Phase 5: Scaling to 200 Participants (Weeks 10-12)

**Goal:** Support Trainer sessions with 200 concurrent participants

**Tasks:**
1. **Load Testing**
   - Simulate 200 concurrent participants
   - Test bandwidth utilization with simulcast
   - Measure client CPU/memory usage
   - Identify bottlenecks
2. **Performance Optimization**
   - Optimize client rendering (only visible participants)
   - Fine-tune simulcast parameters
   - Implement lazy loading for participant list
3. **Breakout Rooms**
   - Create sub-rooms from main session
   - Auto-assign or manual assignment
   - Timer and auto-close functionality
   - Broadcast messages to all rooms
   - Return to main session workflow
4. **Trainer-Specific Controls**
   - Spotlight participant (force everyone to see specific participant)
   - Mute all except presenter
   - Q&A moderation dashboard
   - Live poll results visualization
5. **Connection Quality Monitoring**
   - Real-time quality indicators per participant
   - Auto-notify host of poor connections
   - Suggest quality reduction for struggling participants
   - Network diagnostics panel

**Deliverable:** Fully-functional 200-participant training platform with breakout rooms

---

### Phase 6: Advanced Features & Production Hardening (Weeks 13-15)

**Goal:** Polish, accessibility, and production deployment

**Tasks:**
1. **Recording**
   - Cloud recording to S3/Convex storage
   - Automatic transcription (Google Speech API)
   - Recording playback UI
   - Share recording links with participants
   - Storage management (auto-delete old recordings)
2. **Noise Cancellation**
   - Browser native noise suppression (Chrome/Edge)
   - Optional: Integrate Krisp SDK for advanced filtering
   - User toggle (on/off)
3. **Background Effects**
   - Background blur (MediaPipe/TensorFlow.js)
   - Virtual backgrounds (upload custom images)
   - Sunup branded backgrounds
4. **Live Captions/Transcription**
   - Real-time speech-to-text (Google Cloud Speech)
   - Caption display overlay
   - Multi-language support (future)
   - Accessibility compliance (ADA)
5. **Production Infrastructure**
   - Multi-server deployment (load balancing)
   - Auto-scaling based on demand
   - Monitoring and alerting (Datadog, CloudWatch)
   - Automated backups
   - Disaster recovery procedures
6. **Security & Compliance**
   - End-to-end encryption (E2EE) for sensitive meetings (future)
   - Watermarking (display participant email on screen shares)
   - Recording consent workflows
   - GDPR/CCPA compliance for recordings
7. **Reconnection & Reliability**
   - Automatic reconnection on network drops
   - Resume from same position in meeting
   - Offline indicator and recovery

**Deliverable:** Enterprise-ready video conferencing platform with accessibility and compliance features

---

## Schema Implications

### New Convex Tables Needed

**videoRooms**
```typescript
videoRooms: defineTable({
  roomType: v.union("consultant_meeting", "trainer_session"),
  roomName: v.string(),
  maxParticipants: v.number(), // 2 for consultant, 200 for trainer
  createdByUserId: v.id("users"),
  appointmentId: v.optional(v.id("appointments")), // If linked to appointment
  status: v.union("waiting", "active", "ended"),
  startedAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  // Feature toggles
  chatEnabled: v.boolean(),
  pollsEnabled: v.boolean(),
  qaEnabled: v.boolean(),
  reactionsEnabled: v.boolean(),
  breakoutRoomsEnabled: v.boolean(),
  recordingEnabled: v.boolean(),
  // Settings
  settings: v.optional(v.object({
    allowParticipantScreenShare: v.boolean(),
    allowParticipantChat: v.boolean(),
    allowParticipantUnmute: v.boolean(),
    isLocked: v.boolean(), // No new participants can join
    waitingRoomEnabled: v.boolean(),
    noiseCancellationEnabled: v.boolean(),
    requireVideoOnJoin: v.boolean(),
  })),
  tenantId: v.id("tenants"),
})
  .index("by_tenant", ["tenantId"])
  .index("by_status", ["status"])
  .index("by_appointment", ["appointmentId"]);
```

**videoRoomParticipants**
```typescript
videoRoomParticipants: defineTable({
  roomId: v.id("videoRooms"),
  userId: v.optional(v.id("users")), // NULL for customers
  personId: v.optional(v.id("people")), // NULL for internal users
  participantType: v.union("host", "presenter", "participant"),
  status: v.union("in_waiting_room", "admitted", "active", "left"),
  joinedAt: v.number(),
  leftAt: v.optional(v.number()),
  audioEnabled: v.boolean(),
  videoEnabled: v.boolean(),
  screenShareEnabled: v.boolean(),
  handRaised: v.boolean(),
  isSpotlighted: v.boolean(), // Host forces everyone to see this participant
  tenantId: v.id("tenants"),
})
  .index("by_room", ["roomId"])
  .index("by_user", ["userId"])
  .index("by_person", ["personId"])
  .index("by_tenant", ["tenantId"])
  .index("by_status", ["status"]);
```

**videoRoomRecordings**
```typescript
videoRoomRecordings: defineTable({
  roomId: v.id("videoRooms"),
  recordingUrl: v.string(),
  duration: v.number(), // seconds
  fileSize: v.number(), // bytes
  recordedAt: v.number(),
  transcriptUrl: v.optional(v.string()),
  captionsUrl: v.optional(v.string()),
  hasTranscription: v.boolean(),
  tenantId: v.id("tenants"),
})
  .index("by_room", ["roomId"])
  .index("by_tenant", ["tenantId"]);
```

**meetingChatMessages**
```typescript
meetingChatMessages: defineTable({
  roomId: v.id("videoRooms"),
  fromUserId: v.optional(v.id("users")),
  fromPersonId: v.optional(v.id("people")),
  message: v.string(),
  isPrivate: v.boolean(),
  toUserId: v.optional(v.id("users")), // if private message
  toPersonId: v.optional(v.id("people")), // if private message
  fileUrl: v.optional(v.string()), // if file attachment
  fileName: v.optional(v.string()),
  sentAt: v.number(),
  tenantId: v.id("tenants"),
})
  .index("by_room", ["roomId"])
  .index("by_tenant", ["tenantId"])
  .index("by_room_and_time", ["roomId", "sentAt"]);
```

**meetingPolls**
```typescript
meetingPolls: defineTable({
  roomId: v.id("videoRooms"),
  question: v.string(),
  options: v.array(v.string()), // Array of option texts
  createdByUserId: v.id("users"),
  isActive: v.boolean(),
  showResults: v.boolean(), // Show results to participants
  isLocked: v.boolean(), // No more votes allowed
  createdAt: v.number(),
  closedAt: v.optional(v.number()),
  tenantId: v.id("tenants"),
})
  .index("by_room", ["roomId"])
  .index("by_tenant", ["tenantId"]);
```

**pollVotes**
```typescript
pollVotes: defineTable({
  pollId: v.id("meetingPolls"),
  userId: v.optional(v.id("users")),
  personId: v.optional(v.id("people")),
  selectedOption: v.number(), // Index of selected option
  votedAt: v.number(),
  tenantId: v.id("tenants"),
})
  .index("by_poll", ["pollId"])
  .index("by_user", ["userId"])
  .index("by_person", ["personId"])
  .index("by_tenant", ["tenantId"]);
```

**meetingQuestions**
```typescript
meetingQuestions: defineTable({
  roomId: v.id("videoRooms"),
  question: v.string(),
  askedByUserId: v.optional(v.id("users")),
  askedByPersonId: v.optional(v.id("people")),
  askedAt: v.number(),
  upvotes: v.number(),
  status: v.union("pending", "answered", "dismissed"),
  answer: v.optional(v.string()),
  answeredByUserId: v.optional(v.id("users")),
  answeredAt: v.optional(v.number()),
  tenantId: v.id("tenants"),
})
  .index("by_room", ["roomId"])
  .index("by_status", ["status"])
  .index("by_tenant", ["tenantId"])
  .index("by_room_and_upvotes", ["roomId", "upvotes"]); // For sorting
```

**questionUpvotes**
```typescript
questionUpvotes: defineTable({
  questionId: v.id("meetingQuestions"),
  userId: v.optional(v.id("users")),
  personId: v.optional(v.id("people")),
  upvotedAt: v.number(),
  tenantId: v.id("tenants"),
})
  .index("by_question", ["questionId"])
  .index("by_user", ["userId"])
  .index("by_person", ["personId"])
  .index("by_tenant", ["tenantId"]);
```

**breakoutRooms**
```typescript
breakoutRooms: defineTable({
  parentRoomId: v.id("videoRooms"),
  roomName: v.string(),
  maxParticipants: v.optional(v.number()),
  autoCloseAt: v.optional(v.number()), // Timestamp for auto-close
  status: v.union("open", "closed"),
  createdAt: v.number(),
  closedAt: v.optional(v.number()),
  tenantId: v.id("tenants"),
})
  .index("by_parent", ["parentRoomId"])
  .index("by_status", ["status"])
  .index("by_tenant", ["tenantId"]);
```

**breakoutRoomAssignments**
```typescript
breakoutRoomAssignments: defineTable({
  breakoutRoomId: v.id("breakoutRooms"),
  userId: v.optional(v.id("users")),
  personId: v.optional(v.id("people")),
  assignedAt: v.number(),
  joinedAt: v.optional(v.number()),
  leftAt: v.optional(v.number()),
  tenantId: v.id("tenants"),
})
  .index("by_room", ["breakoutRoomId"])
  .index("by_user", ["userId"])
  .index("by_person", ["personId"])
  .index("by_tenant", ["tenantId"]);
```

### Integration with Existing Tables

**appointments** - Add field:
- `videoRoomId: v.optional(v.id("videoRooms"))` - Link to video room

**communications** - Existing table can log video calls:
- `communicationType: "meeting"` already supported
- `duration`, `recordingUrl` fields already exist

---

## Security Considerations

### 1. Authentication and Authorization

**Requirement:** Only invited participants can join rooms

**Implementation:**
```javascript
// Server-side: Validate JWT token before allowing room join
socket.on('join-room', async (roomId, token) => {
  const user = await verifyClerkToken(token); // Clerk authentication
  const room = await convex.query("videoRooms:get", { roomId });

  // Check if user is authorized for this room
  const isAuthorized = await checkRoomAuthorization(user, room);
  if (!isAuthorized) {
    socket.emit('error', 'Not authorized to join this room');
    return;
  }

  // Proceed with mediasoup join logic
});
```

### 2. DTLS and SRTP

**Mediasoup automatically handles:**
- DTLS (Datagram Transport Layer Security) for key exchange
- SRTP (Secure RTP) for encrypted media streams
- No configuration needed (built into WebRTC spec)

### 3. Rate Limiting

**Protect against abuse:**
- Limit room creation per user (e.g., 10 active rooms per tenant)
- Limit participant joins (prevent Zoom-bombing)
- Disconnect idle participants after timeout

### 4. Data Privacy

**For HIPAA/privacy compliance (future consideration):**
- End-to-end encryption (E2EE) - requires insertable streams API
- Recording consent (notify all participants if recording)
- Data retention policies (auto-delete recordings after 90 days)

---

## Cost Estimates

### Scenario 1: Light Usage (Startup Phase)

**Usage:**
- 10 Consultant meetings/day (30 min each, 2 participants)
- 2 Trainer sessions/week (1 hour each, 50 participants)

**Infrastructure:**
- 1× AWS c5.large (2 vCPU, 4 GB RAM): $70/month
- Bandwidth: ~500 GB/month: $50/month

**Total: ~$120/month**

---

### Scenario 2: Moderate Usage (Growth Phase)

**Usage:**
- 50 Consultant meetings/day (30 min each, 2 participants)
- 10 Trainer sessions/week (1 hour each, 100 participants)

**Infrastructure:**
- 2× AWS c5.xlarge (4 vCPU, 8 GB RAM) + load balancer: $300/month
- Bandwidth: ~2 TB/month: $200/month

**Total: ~$500/month**

---

### Scenario 3: High Usage (Scale Phase)

**Usage:**
- 200 Consultant meetings/day (30 min each, 2 participants)
- 20 Trainer sessions/week (1 hour each, 200 participants)

**Infrastructure:**
- 4× AWS c5.2xlarge (8 vCPU, 16 GB RAM) + load balancer: $1,200/month
- Bandwidth: ~10 TB/month: $1,000/month

**Total: ~$2,200/month**

---

### Cost Optimization Strategies

1. **Use AWS Reserved Instances:** Save 40-60% on compute costs
2. **Cloudflare for TURN servers:** Reduce bandwidth costs (they offer WebRTC TURN)
3. **Regional deployment:** Deploy servers in regions with lower bandwidth costs
4. **Audio-only default:** Encourage Trainer sessions to use audio-only (10x bandwidth savings)

---

## Competitive Analysis

**Leading WebRTC Platforms:**

| Platform | Architecture | Cost | Self-Hosted? | Max Participants |
|----------|-------------|------|--------------|------------------|
| **Zoom** | Proprietary MCU/SFU hybrid | $15-20/host/mo | No | 1000+ (webinar mode) |
| **Daily.co** | SFU | $0.0015/min/user | No | 200 |
| **Agora** | SFU | $0.99/1000 min | No | Unlimited |
| **Jitsi** | SFU (Janus) | Free (OSS) | Yes | 75-100 practical |
| **LiveKit** | SFU | $0.0009/min/user | Yes (paid) | 500+ |

**Sunup Differentiators:**
- **Integrated platform:** WebRTC is one module, not standalone product
- **Self-hosted:** Full control, no per-minute fees
- **React Native first:** Mobile-optimized from day one
- **Role-specific features:** Trainer controls, raise hand, Q&A
- **Free for tenants:** No per-seat or per-minute charges

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Mediasoup stability issues | Low | High | Janus as fallback, extensive testing |
| 200-participant sessions fail | Medium | High | Load testing, gradual rollout |
| Mobile decoder limits | Medium | Medium | Audio-only default, strict video limits |
| Bandwidth costs exceed budget | Medium | Medium | Optimize with simulcast, monitor usage |
| Security vulnerabilities | Low | High | Regular updates, security audits |

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Underestimate complexity | High | Medium | Allocate 9 weeks, not 4 |
| Poor client performance | Medium | High | Early performance testing, optimization |
| Network issues (NAT traversal) | Medium | Medium | Comprehensive TURN server setup |

---

## Recommendations

### Immediate Actions (Week 1)

1. **Prototype with Mediasoup:** Build basic 1-to-1 demo
2. **Performance baseline:** Test on target devices (iOS, Android)
3. **Bandwidth testing:** Measure actual bandwidth usage with simulcast

### Short-Term (Weeks 2-5)

4. **Implement Consultant meetings:** Production-ready 1-to-1 calls
5. **Small group conferencing:** Support 10-20 participant meetings
6. **AWS infrastructure:** Set up staging environment

### Medium-Term (Weeks 6-9)

7. **Scale to 200 participants:** Full Trainer session implementation
8. **Load testing:** Simulate 200-participant sessions
9. **Production deployment:** Multi-server, monitored infrastructure

### Long-Term (Post-MVP)

10. **Recording:** Add session recording for Trainer sessions
11. **Analytics:** Track connection quality, usage metrics
12. **Advanced features:** Screen sharing, breakout rooms, whiteboard

---

## Conclusion

**SFU architecture with Mediasoup** is the optimal choice for Sunup's WebRTC requirements:

✅ Scales to 200 participants (Trainer sessions)
✅ Cost-effective ($500-2000/month at scale)
✅ React Native compatibility
✅ Node.js integration with existing backend
✅ Industry-proven technology
✅ **Google Meet feature parity** with 21 collaboration features

**Feature Set (Complete):**
1. **Core Video/Audio** - 1-to-1 and 1-to-200 sessions with simulcast optimization
2. **Screen Sharing** - Essential for design reviews and training demonstrations
3. **In-Meeting Chat** - Public and private messaging, file sharing
4. **Polls** - Interactive quizzes and feedback during training
5. **Q&A** - Structured questions with upvoting for large sessions
6. **Reactions/Emoji** - Non-verbal engagement (👍❤️😂🎉👏)
7. **Breakout Rooms** - Small group exercises during training
8. **Host Controls** - Waiting room, mute all, lock meeting, permissions
9. **Recording** - Cloud recording with automatic transcription
10. **Attendance Tracking** - Join/leave times, duration reports
11. **Noise Cancellation** - Filter background noise
12. **Background Blur** - Privacy and professionalism
13. **Live Captions** - Accessibility and ADA compliance

**Critical Success Factors:**
1. **Simulcast implementation:** 5-10x bandwidth savings
2. **Client-side pagination:** Display 16-25 participants max
3. **Audio-only default:** Trainer sessions use audio unless trainee asks question
4. **Polls & Q&A:** Essential for engaging 200-participant sessions
5. **Screen sharing:** Blocks design reviews and training without it
6. **Load testing:** Validate 200-participant capacity before launch

**Timeline:** 15 weeks from prototype to feature-complete production
- **Weeks 1-3:** Core video/audio with simulcast
- **Weeks 4-6:** Screen sharing, chat, host controls (+3 weeks for collaboration)
- **Weeks 7-9:** Polls, Q&A, reactions (+3 weeks for engagement)
- **Weeks 10-12:** 200-participant scaling, breakout rooms
- **Weeks 13-15:** Recording, captions, noise cancellation, production deployment

**Estimated Cost:**
- **Infrastructure:** $500-1500/month (compute + bandwidth)
- **Additional services:** $100-500/month (transcription, storage)
- **Total:** $600-2000/month for moderate usage (50-100 concurrent sessions)

**ROI Justification:**
- **No per-seat fees:** Zoom charges $15-20/host/month
- **No per-minute fees:** Daily.co charges $0.0015/min/user ($18/user for 200-person 1-hour session)
- **Self-hosted:** Full control, unlimited usage for flat infrastructure cost
- **Integrated:** Seamlessly embedded in Sunup platform (not standalone tool)

---

## Appendices

### Appendix A: Mediasoup Server Setup (Node.js)

```javascript
// server.js
const mediasoup = require('mediasoup');

// Create Worker
const worker = await mediasoup.createWorker({
  logLevel: 'warn',
  rtcMinPort: 10000,
  rtcMaxPort: 10100,
});

// Create Router
const router = await worker.createRouter({
  mediaCodecs: [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: 'video',
      mimeType: 'video/VP8',
      clockRate: 90000,
      parameters: {
        'x-google-start-bitrate': 1000,
      },
    },
  ],
});

// Create WebRTC Transport for each participant
const transport = await router.createWebRtcTransport({
  listenIps: [{ ip: '0.0.0.0', announcedIp: 'YOUR_PUBLIC_IP' }],
  enableUdp: true,
  enableTcp: true,
  preferUdp: true,
});

// Produce (send media to server)
const producer = await transport.produce({
  kind: 'video',
  rtpParameters: params, // from client
});

// Consume (receive media from server)
const consumer = await transport.consume({
  producerId: remoteProducerId,
  rtpCapabilities: clientRtpCapabilities,
  paused: false,
});
```

### Appendix B: React Native Client Setup

```javascript
// RNMediasoupClient.js
import { Device } from 'mediasoup-client';
import { registerGlobals } from 'react-native-webrtc';

// Register WebRTC globals
registerGlobals();

// Create Device
const device = new Device();

// Load router RTP capabilities from server
await device.load({ routerRtpCapabilities });

// Create send transport
const sendTransport = device.createSendTransport(transportParams);

// Produce video
const videoTrack = await getLocalVideoTrack();
const producer = await sendTransport.produce({ track: videoTrack });

// Create receive transport
const recvTransport = device.createRecvTransport(transportParams);

// Consume remote video
const consumer = await recvTransport.consume({
  id: consumerId,
  producerId: remoteProducerId,
  kind: 'video',
  rtpParameters: params,
});

const remoteTrack = consumer.track;
```

### Appendix C: Research Sources

1. Mediasoup official documentation (mediasoup.org)
2. WebRTC.ventures - SFU load testing and cost analysis
3. BlogGeek.me - WebRTC architecture comparisons
4. Academic: "Efficient and scalable video conferences with selective forwarding units"
5. Daily.co engineering blog - WebRTC optimization techniques
6. AWS architecture guides for WebRTC media servers

---

**Document Status:** Complete
**Next Steps:** Review findings, prioritize for architecture document, begin prototype

---

_Research conducted: 2025-11-03_
_Approved by: [Pending user review]_
