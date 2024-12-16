# React Dynamic Window 🪟

React virtualization library for efficiently rendering large scrollable lists with dynamic heights and expandable content.

...

## ✨ Features

- 🚀 **Virtualized Rendering**: Only renders items that are visible in the viewport
- 📏 **Dynamic Heights**: Supports items with varying heights
- 🔄 **Expandable Content**: Built-in support for expandable/collapsible items
- 🔄 **Infinite Loading**: Seamless integration with infinite scroll functionality
- 🎯 **Buffer Management**: Configurable buffer size for smooth scrolling
- 🎨 **Customizable**: Fully customizable item rendering and styling
- 📱 **Responsive**: Works great on all screen sizes

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
    <div style={{ width: '500px' height: '600px' }}>
      <ReactDynamicWindow
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

| Prop            | Type                         | Default    | Description                                |
| --------------- | ---------------------------- | ---------- | ------------------------------------------ |
| `data`          | `T[]`                        | Required   | Array of items to render                   |
| `itemHeight`    | `number`                     | `150`      | Default height for each item               |
| `bufferSize`    | `number`                     | `4`        | Number of items to render outside viewport |
| `threshold`     | `number`                     | `0.9`      | Scroll threshold for loading more items    |
| `className`     | `string`                     | -          | Custom CSS class for items                 |
| `entryType`     | `'append' \| 'prepend'`      | `'append'` | Direction for adding new items             |
| `hasLatestData` | `boolean`                    | -          | Indicates if latest data is loaded         |
| `controls`      | `ReactDynamicWindowControls` | -          | External controls object                   |
| `onLoadMore`    | `() => void`                 | Required   | Callback when more items needed            |
| `onLoadLatest`  | `() => Promise<boolean>`     | -          | Callback to load latest items              |

## 🔄 Advanced Usage

### Custom Controls

```tsx
const controls = {
  scrollToTop: () => void
};

<ReactDynamicWindow
  controls={controls}
  // ... other props
>
  {/* ... */}
</ReactDynamicWindow>
```

### Dynamic Heights with ResizeObserver

The library automatically handles dynamic heights using ResizeObserver:

```tsx
<ReactDynamicWindow data={items}>
  {({ data, isExpanded }) => (
    <div>
      <h3>{data.title}</h3>
      {isExpanded && (
        <div className="expandable-content">
          {/* Content with dynamic height */}
          <img src={data.image} alt={data.title} />
          <p>{data.description}</p>
        </div>
      )}
    </div>
  )}
</ReactDynamicWindow>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
