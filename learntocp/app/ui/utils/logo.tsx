import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const Logo: React.FC<IconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor" /* Inherits text color from parent container */
      strokeWidth={2}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};
