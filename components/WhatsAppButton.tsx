import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '+1234567890'; // Replace with your actual WhatsApp number
  const message = encodeURIComponent('Hi! I have a question about AVANA PARFUM.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center"
      style={{ maxWidth: 'calc(100% - 1.5rem)', boxSizing: 'border-box' }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </Link>
  );
};

export default WhatsAppButton; 