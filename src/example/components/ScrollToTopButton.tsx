import { ChevronUp } from 'lucide-react';

type ScrollToTopButtonProps = {
  onClick: () => void;
};

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  onClick,
}) => (
  <button
    className="absolute p-2 text-white bg-white rounded-full shadow-md bottom-4 right-4 hover:bg-gray-100"
    onClick={onClick}
  >
    <ChevronUp size={24} color="#000" />
  </button>
);
