# Student Dashboard - Component Tree

```
DashboardScreen (ScrollView with RefreshControl)
│
├─ 📱 Header Section (White background, top padding)
│  ├─ Greeting & Subtitle
│  │  ├─ "Hello, Student!" (28pt bold)
│  │  └─ "Track your attendance" (14pt light)
│  └─ Profile Button (Icon: person-circle-outline)
│
├─ 📊 Stats Container (3 gradient cards)
│  │
│  ├─ Large Attendance Card (Purple-Violet gradient)
│  │  ├─ Header (pie-chart icon + "Attendance Rate")
│  │  ├─ Percentage (48pt bold white)
│  │  ├─ Subtitle ("X of Y classes attended")
│  │  └─ Progress Bar (animated fill)
│  │
│  └─ Small Cards Row (2 cards side-by-side)
│     │
│     ├─ Total Classes Card (Green gradient)
│     │  ├─ book icon
│     │  ├─ Number (32pt)
│     │  └─ Label "Total Classes"
│     │
│     └─ This Month Card (Orange gradient)
│        ├─ calendar icon
│        ├─ Number (32pt)
│        └─ Label "This Month"
│
├─ ⚡ Quick Actions Section
│  ├─ Section Title "Quick Actions"
│  └─ Actions Row (4 buttons)
│     ├─ My Records (blue bg, list icon)
│     ├─ Scan QR (green bg, qr-code icon)
│     ├─ Refresh (yellow bg, refresh icon)
│     └─ Settings (purple bg, settings icon)
│
└─ 📍 Nearby Sessions Section
   │
   ├─ Section Header
   │  ├─ "Nearby Sessions" title
   │  └─ GPS Badge (if active)
   │     ├─ location icon (green)
   │     └─ "GPS Active" text
   │
   └─ Sessions List (or Empty State)
      │
      ├─ Empty State (if no sessions)
      │  ├─ calendar icon (large, 64px)
      │  ├─ "No nearby sessions"
      │  └─ "Pull down to refresh..."
      │
      └─ Session Cards (mapped array)
         │
         └─ Session Card (white, soft shadow, conditional green border)
            │
            ├─ Session Header
            │  ├─ school icon + Session Info
            │  │  ├─ Subject name (16pt bold)
            │  │  └─ Faculty name (13pt light)
            │  └─ "In Range" Badge (if distance < 15m)
            │
            ├─ Session Details Row
            │  ├─ location icon + distance
            │  └─ time icon + start time
            │
            └─ Footer (only if in range)
               └─ Mark Attendance Button (Green gradient)
                  ├─ checkmark-circle icon
                  └─ "Mark Attendance" text

```

## State Management

```javascript
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [location, setLocation] = useState(null);
const [nearbySessions, setNearbySessions] = useState([]);
const [stats, setStats] = useState({
  totalClasses: 0,
  attended: 0,
  percentage: 0,
  thisMonth: 0
});
```

## Lifecycle Flow

```
Component Mount
    ↓
useEffect() trigger
    ↓
initializeDashboard()
    ↓
├─ getLocationAndSessions()
│  ├─ Request permissions
│  ├─ Get GPS coordinates
│  └─ Fetch nearby sessions from API
│
└─ fetchStats()
   └─ Get attendance statistics from API
    ↓
setLoading(false)
    ↓
Render Dashboard
    ↓
User interactions:
- Pull to refresh → onRefresh()
- Tap session card → handleMarkAttendance()
- Tap quick action → Navigate to screen
```

## Data Flow

```
API Layer (services/api.js)
    ↓
getNearbySessions(lat, lon) → Backend API
    ↓
Response: [sessions array]
    ↓
setNearbySessions(sessions)
    ↓
Calculate distances (Haversine)
    ↓
Render session cards with distances
    ↓
User taps "Mark Attendance"
    ↓
handleMarkAttendance(session)
    ↓
Check distance < 15m
    ↓
Navigate to MarkAttendance screen
```

## Styling Architecture

```
StyleSheet.create({
  // Layout
  container, contentContainer, loadingContainer
  
  // Header (60px top padding for notch)
  header, greeting, subtitle, profileButton
  
  // Stats (gradient cards with shadows)
  statsContainer, statCard, largeCard, smallCardsRow
  statCardHeader, statCardTitle, percentageText
  progressBar, progressFill
  smallCardContent, smallCardNumber, smallCardLabel
  
  // Quick Actions (icon grid)
  quickActionsContainer, actionsRow
  actionButton, actionIcon, actionLabel
  
  // Nearby Sessions
  nearbyContainer, sectionHeader, sectionTitle
  locationBadge, locationText
  emptyState, emptyStateText, emptyStateSubtext
  
  // Session Cards (dynamic styling)
  sessionCard, sessionCardActive (green border)
  sessionHeader, sessionTitleContainer, sessionInfo
  sessionSubject, sessionFaculty
  inRangeBadge, inRangeText
  sessionDetails, sessionDetailItem, sessionDetailText
  sessionFooter, markAttendanceButton, markAttendanceText
})
```

## Key Design Patterns

1. **Conditional Rendering**: Empty state vs sessions list
2. **Dynamic Styling**: Green border for in-range sessions
3. **Computed Values**: Real-time distance calculation
4. **Error Boundaries**: Try-catch with user-friendly alerts
5. **Progressive Enhancement**: GPS badge only when active
6. **Touch Feedback**: All interactive elements respond
7. **Accessibility**: Large touch targets (56px icons)
8. **Performance**: Efficient re-renders, memoized calculations
