# UI Components

Beautiful, reusable React Native Expo components with soft UI design, gradients, and glassmorphism effects.

## Components

### Button
A gradient button component with multiple variants and sizes.

**Props:**
- `title` (string, required) - Button text
- `onPress` (function, required) - Press handler
- `loading` (boolean) - Show loading spinner
- `disabled` (boolean) - Disable button
- `variant` (string) - 'primary' | 'secondary' | 'outline'
- `size` (string) - 'small' | 'medium' | 'large'
- `style` (object) - Custom container styles
- `textStyle` (object) - Custom text styles

**Example:**
```jsx
import { Button } from './src/components';

<Button 
  title="Sign In" 
  onPress={handleSignIn}
  variant="primary"
  size="medium"
/>
```

---

### Card
A glassmorphism card component with optional gradient background.

**Props:**
- `children` (node, required) - Card content
- `style` (object) - Custom styles
- `glassmorphism` (boolean) - Enable glassmorphism effect (default: true)
- `gradient` (boolean) - Use gradient background instead
- `gradientColors` (array) - Custom gradient colors

**Example:**
```jsx
import { Card } from './src/components';

<Card glassmorphism>
  <Text>Card content</Text>
</Card>
```

---

### Input
A soft-designed input field with focus effects and error handling.

**Props:**
- `label` (string) - Input label
- `value` (string, required) - Input value
- `onChangeText` (function, required) - Change handler
- `placeholder` (string) - Placeholder text
- `secureTextEntry` (boolean) - Password mode
- `error` (string) - Error message
- `icon` (element) - Left icon
- `rightIcon` (element) - Right icon
- `onRightIconPress` (function) - Right icon press handler
- `style` (object) - Container styles
- `inputStyle` (object) - Input styles

**Example:**
```jsx
import { Input } from './src/components';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  error={emailError}
/>
```

---

### Loading
An animated gradient spinner with pulse effect.

**Props:**
- `size` (number) - Spinner size (default: 60)
- `color` (string) - Primary color (default: '#667eea')
- `fullScreen` (boolean) - Show as fullscreen overlay
- `style` (object) - Custom styles

**Example:**
```jsx
import { Loading } from './src/components';

<Loading size={80} fullScreen />
```

---

### StatsCard
A gradient card for displaying statistics with decorative elements.

**Props:**
- `title` (string, required) - Stat title
- `value` (string|number, required) - Stat value
- `subtitle` (string) - Additional info
- `icon` (element) - Icon element
- `gradientColors` (array) - Custom gradient colors
- `style` (object) - Custom styles

**Example:**
```jsx
import { StatsCard } from './src/components';

<StatsCard
  title="Total Hours"
  value="142"
  subtitle="This month"
  gradientColors={['#667eea', '#764ba2']}
/>
```

---

### SessionCard
A detailed card for displaying attendance session information.

**Props:**
- `date` (string, required) - Session date
- `checkIn` (string) - Check-in time
- `checkOut` (string) - Check-out time
- `duration` (string) - Session duration
- `status` (string) - 'completed' | 'active' | 'pending'
- `location` (string) - Location name
- `onPress` (function) - Press handler
- `style` (object) - Custom styles

**Example:**
```jsx
import { SessionCard } from './src/components';

<SessionCard
  date="Mon, Feb 7, 2026"
  checkIn="09:00 AM"
  checkOut="05:30 PM"
  duration="8h 30m"
  status="completed"
  location="Main Office"
  onPress={() => console.log('Session pressed')}
/>
```

---

## Installation

The components require `expo-linear-gradient`:

```bash
npm install expo-linear-gradient --legacy-peer-deps
```

## Import All Components

```jsx
import { 
  Button, 
  Card, 
  Input, 
  Loading, 
  StatsCard, 
  SessionCard 
} from './src/components';
```

## Design Features

- **Soft UI Design**: Rounded corners, subtle shadows, and smooth transitions
- **Gradients**: Beautiful gradient backgrounds and borders
- **Glassmorphism**: Frosted glass effect with transparency
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Proper touch targets and visual feedback
- **Customizable**: All components accept custom styles

## Color Palette

Default gradients used:
- Primary: `#667eea` → `#764ba2`
- Secondary: `#f093fb` → `#f5576c`
- Success: `#4caf50` → `#66bb6a`
- Info: `#2196f3` → `#42a5f5`
- Warning: `#ff9800` → `#ffa726`
