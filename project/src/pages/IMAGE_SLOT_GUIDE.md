# Image Slot Guide

## Where to Add Images

### Login Page (`Login.jsx`)
**Location:** Lines ~30-45

Replace the placeholder div with your image:

```jsx
{/* Replace this entire div with your image */}
<div className="absolute inset-0 flex items-center justify-center">
  <img 
    src="/path-to-your-login-image.jpg" 
    alt="Login" 
    className="w-full h-full object-cover"
  />
</div>
```

### Register Page (`Register.jsx`)
**Location:** Lines ~30-45

Replace the placeholder div with your image:

```jsx
{/* Replace this entire div with your image */}
<div className="absolute inset-0 flex items-center justify-center">
  <img 
    src="/path-to-your-signup-image.jpg" 
    alt="Sign Up" 
    className="w-full h-full object-cover"
  />
</div>
```

## Recommended Image Specifications

- **Format:** JPG, PNG, or WebP
- **Aspect Ratio:** 1:1 (square) or 4:3
- **Resolution:** Minimum 1200x1200px for best quality
- **File Size:** Optimize to under 500KB for faster loading
- **Content:** Should be relevant to agriculture/farming theme

## Tips

1. Place images in `public/` folder for easy access
2. Use descriptive filenames like `login-hero.jpg` or `signup-illustration.png`
3. Consider using next-gen formats like WebP for better compression
4. Test on different screen sizes to ensure images look good

