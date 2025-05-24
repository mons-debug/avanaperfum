import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const WhatsAppButton: React.FC<{ customMessage?: string }> = ({ customMessage }) => {
  // Moroccan phone number format (ensuring correct international format for WhatsApp)
  // The number format for Morocco should be +212 followed by the 9-digit number without the leading 0
  const rawNumber = '0674428593';
  const formattedNumber = rawNumber.startsWith('0') 
    ? `+212${rawNumber.substring(1)}` 
    : `+212${rawNumber}`;
    
  // Default message or use custom message if provided
  const defaultMessage = 'Hi! I have a question about AVANA PARFUM.';
  const message = encodeURIComponent(customMessage || defaultMessage);
  
  // Create WhatsApp URL using the wa.me format
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;

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