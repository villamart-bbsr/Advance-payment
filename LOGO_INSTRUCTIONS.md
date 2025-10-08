# VillaMart Logo Replacement Instructions

## Current Logo Setup

The application currently uses a placeholder logo (Building2 icon from Lucide) with a green gradient background.

## How to Replace with Your VillaMart Logo

### Option 1: Using an Image File (Recommended)

1. **Add your logo image** to `client/public/` folder:
   - Save your VillaMart logo as `villamart-logo.png` or `villamart-logo.svg`
   - Recommended size: 200x200px or larger

2. **Update the Logo component** (`client/src/components/Logo.jsx`):

Replace lines 14-20 with:
```jsx
<div className="relative">
  <img 
    src="/villamart-logo.png" 
    alt="VillaMart Logo" 
    className={currentSize.icon}
  />
</div>
```

### Option 2: Keep Icon but Customize

If you prefer to keep the icon-based logo temporarily:
- The current setup uses the Building2 icon with green gradient
- You can change the icon by importing a different one from `lucide-react`
- Colors are already set to green theme

## Logo Appears In:

- ✅ Navbar (small size)
- ✅ Home Page (large size with company name)
- ✅ All pages via Navbar component

## Green Theme Applied To:

- ✅ All backgrounds (green-50 to emerald-50)
- ✅ All buttons (green-600 to emerald-600)
- ✅ All gradients changed from blue/purple to green/emerald
- ✅ All accent colors
- ✅ All hover states
- ✅ Table headers
- ✅ Status indicators

Your VillaMart branding is now consistently applied throughout the application!
