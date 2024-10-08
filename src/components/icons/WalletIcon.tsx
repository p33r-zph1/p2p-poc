import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {}

function WalletIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      {...props}
    >
      <path d="M16.3 13.6c.417 0 .787-.162 1.113-.487.325-.325.487-.705.487-1.138 0-.417-.162-.783-.487-1.1-.326-.317-.696-.475-1.113-.475-.417 0-.788.158-1.113.475-.324.317-.487.683-.487 1.1 0 .433.163.813.488 1.138.324.325.695.487 1.112.487Zm-2.85 3.075c-.567 0-1.017-.167-1.35-.5-.333-.333-.5-.775-.5-1.325V9.175c0-.567.167-1.013.5-1.338.333-.324.783-.487 1.35-.487h6.725c.567 0 1.017.163 1.35.488.333.324.5.77.5 1.337v5.675c0 .55-.167.992-.5 1.325-.333.333-.783.5-1.35.5H13.45ZM4.5 21c-.383 0-.73-.15-1.038-.45C3.155 20.25 3 19.9 3 19.5v-15c0-.383.154-.73.462-1.038C3.772 3.155 4.117 3 4.5 3h15c.4 0 .75.154 1.05.462.3.309.45.655.45 1.038v1.35h-7.55c-.967 0-1.767.317-2.4.95s-.95 1.425-.95 2.375v5.675c0 .95.317 1.742.95 2.375s1.433.95 2.4.95H21V19.5c0 .4-.15.75-.45 1.05-.3.3-.65.45-1.05.45h-15Z" />
    </svg>
  );
}

export default WalletIcon;
