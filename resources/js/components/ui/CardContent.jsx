// CardContent.jsx
import React from "react";

const CardContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <div 
    ref={ref} 
    className={`p-6 ${className}`} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

export default CardContent;