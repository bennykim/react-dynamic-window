# React Dynamic Window 🪟

React virtualization library for efficiently rendering large scrollable lists with dynamic heights and expandable content.

### 🚀 [Live Demo](https://react-dynamic-window.netlify.app/)

## ✨ Features

- 🚀 **Virtualized Rendering**: Only renders items that are visible in the viewport, optimizing performance for large lists
- 📏 **Dynamic Heights**: Supports items with varying heights using ResizeObserver for automatic height detection
- 🔄 **Expandable Content**: Built-in support for expandable/collapsible items with smooth animations
- 🔄 **Infinite Loading**: Seamless infinite scroll with support for loading both newer and older items
- 🎯 **Buffer Management**: Configurable buffer size for smooth scrolling experience
- 🎨 **Customizable**: Fully customizable item rendering and styling with flexible children props
- 📱 **Responsive**: Works on all screen sizes with adaptive viewport calculations
- 🔍 **Smart Scroll Management**: Intelligent scroll position restoration for dynamic content updates
- 🎮 **External Controls**: Supports external scroll controls with smooth animations

## 📦 Installation

```bash
npm install react-dynamic-window
# or
yarn add react-dynamic-window
# or
pnpm add react-dynamic-window
```

## 🚀 Quick Start

```tsx
import { ReactDynamicWindow } from 'react-dynamic-window';

function App() {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Item ${i}`,
    content: `Content for item ${i}`,
  }));

  return (
    <div style={{ width: '500px', height: '600px' }}>
      <ReactDynamicWindow
        className="list-item"
        data={items}
        itemHeight={150}
        bufferSize={4}
        onLoadMore={() => {
          // Load more items
        }}
      >
        {({ data, isExpanded, onClick }) => (
          <div onClick={onClick}>
            <h3>{data.title}</h3>
            {isExpanded && <p>{data.content}</p>}
          </div>
        )}
      </ReactDynamicWindow>
    </div>
  );
}
```

## 🔧 Props

| Prop            | Type                         | Default  | Description                                       |
| --------------- | ---------------------------- | -------- | ------------------------------------------------- |
| `data`          | `T[]`                        | Required | Array of items to render                          |
| `itemHeight`    | `number`                     | `150`    | Default height for each item (10-1000px)          |
| `bufferSize`    | `number`                     | `4`      | Number of items to render outside viewport (1-20) |
| `threshold`     | `number`                     | `0.9`    | Scroll threshold for loading more items (0.1-1.0) |
| `className`     | `string`                     | -        | Custom CSS class for list items                   |
| `hasLatestData` | `boolean`                    | -        | Indicates if latest data is available             |
| `controls`      | `ReactDynamicWindowControls` | -        | External controls for scroll management           |
| `onLoadMore`    | `() => void`                 | Required | Callback when more items needed                   |
| `onLoadLatest`  | `() => Promise<boolean>`     | -        | Callback to load latest items                     |

## 🔄 Advanced Usage

### Dynamic Heights with ResizeObserver

The library automatically handles dynamic heights using ResizeObserver, making it perfect for expandable content:

```tsx
<ReactDynamicWindow data={items}>
  {({ data, isExpanded }) => (
    <div>
      <h3>{data.title}</h3>
      {isExpanded && (
        <div className="expandable-content">
          <img src={data.image} alt={data.title} loading="lazy" />
          <p>{data.description}</p>
        </div>
      )}
    </div>
  )}
</ReactDynamicWindow>
```

### External Controls

You can control the scroll behavior externally using the controls prop:

```tsx
const controls = {
  scrollToTop: () => () => void,
  // First function (provided by component) handles the scroll behavior
  // Second function (user-defined) can be used for custom actions
};

<ReactDynamicWindow
  controls={controls}
  data={items}
>
  {/* ... */}
</ReactDynamicWindow>

// Later in your code
const scrollFn = controls.scrollToTop({ behavior: 'smooth' });
scrollFn(); // Execute the returned function
```

### Infinite Loading

The component supports infinite scrolling in both directions: loading more items when scrolling down and loading latest items when scrolling to top.

```tsx
<ReactDynamicWindow
  data={items}
  hasLatestData={hasNewItems} // Flag indicating new items are available
  onLoadMore={handleLoadMore} // Called when scrolling down
  onLoadLatest={handleLoadLatest} // Called when scrolling to top
>
  {({ data }) => <ListItem data={data} />}
</ReactDynamicWindow>
```

Key concepts:

- `hasLatestData`: Indicates whether new items are available at the top
- `onLoadLatest`: Triggered only when scrolling to top AND `hasLatestData` is true
- Return `true` from `onLoadLatest` if new items were loaded, `false` otherwise
- The component handles scroll position management automatically

Typical use cases:

- Real-time feeds where new content arrives periodically
- Chat or messaging interfaces
- Social media timelines

### Custom Styling

The component accepts a className prop and provides full control over item styling:

```tsx
<ReactDynamicWindow className="custom-list-item" data={items}>
  {({ data, isExpanded }) => (
    <div className={`item ${isExpanded ? 'expanded' : ''}`}>
      {/* Your custom item content */}
    </div>
  )}
</ReactDynamicWindow>
```

## 🛠️ Technical Details

- Uses ResizeObserver for accurate dynamic height measurements
- Implements optimized scroll position restoration for dynamic content updates
- Supports both append and prepend modes with automatic scroll adjustment
- Provides type-safe props with runtime validation
- Implements memoization for optimal re-rendering
- Uses virtual DOM for efficient updates
- Handles window resize events automatically

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

📝 MIT © [MNIII]
