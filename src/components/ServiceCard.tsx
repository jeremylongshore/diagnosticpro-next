import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import ShieldIcon from './icons/ShieldIcon';
import DiagnosticIcon from './icons/DiagnosticIcon';
import EmergencyIcon from './icons/EmergencyIcon';
import type { ServiceType } from '../types';

interface ServiceCardProps {
  service: ServiceType;
  isSelected: boolean;
  onSelect: (service: ServiceType) => void;
  index: number;
}

const ServiceCard = ({ service, isSelected, onSelect, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`
        service-card
        ${isSelected ? 'selected' : ''}
      `}
      onClick={() => onSelect(service)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-success-500 text-white rounded-full p-2"
        >
          <Check className="w-4 h-4" />
        </motion.div>
      )}

      {/* Service Icon */}
      <div className="text-center mb-4">
        {service.id === 'emergency' && <EmergencyIcon className="w-16 h-16 mx-auto" />}
        {service.id === 'diagnosis' && <DiagnosticIcon className="w-16 h-16 mx-auto" />}
        {service.id === 'quote-verification' && <ShieldIcon className="w-16 h-16 mx-auto" />}
      </div>

      {/* Service Info */}
      <div className="text-center">
        <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
          {service.name}
        </h3>
        
        <div className={`text-3xl font-black mb-3 ${isSelected ? 'text-white' : 'text-primary-600'}`}>
          ${service.price}
        </div>
        
        <p className={`text-sm mb-4 leading-relaxed ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-2">
          {service.features.map((feature, idx) => (
            <div key={idx} className="flex items-center text-sm">
              <Check className={`w-4 h-4 mr-2 flex-shrink-0 ${isSelected ? 'text-white' : 'text-success-500'}`} />
              <span className={isSelected ? 'text-white/90' : 'text-gray-600'}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Effect Background */}
      {!isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default ServiceCard;