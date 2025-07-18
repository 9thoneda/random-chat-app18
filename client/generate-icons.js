const fs = require("fs");
const path = require("path");

// Create a simple HTML file to render SVG to different sizes
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgContent = fs.readFileSync(
  path.join(__dirname, "public/logo.svg"),
  "utf8",
);

// Create a basic HTML file for each size that we can screenshot
iconSizes.forEach((size) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background: transparent; }
    svg { width: ${size}px; height: ${size}px; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>
  `;

  fs.writeFileSync(
    path.join(__dirname, `public/icons/icon-${size}x${size}.html`),
    htmlContent,
  );
});

console.log(
  "Icon HTML files generated. You can convert these to PNG using a browser or tool.",
);
