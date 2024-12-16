type ScrollToTopButtonProps = {
  onClick: () => void;
};

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  onClick,
}) => (
  <button className="scroll-top-button" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </button>
);
